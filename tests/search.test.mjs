import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,recommend} from '../dist/engine.mjs';
import {PRODUCTS} from '../dist/data.mjs';
import {filterReasons,executeSearch,normalizeWeights,evaluateCases,summarizeFunnel} from '../dist/search.mjs';
import {EVAL_CASES,DEV_CASES,HOLDOUT_CASES} from '../dist/eval-data.mjs';
import {runShoppingTurn} from '../dist/agent.mjs';
import {initialLab,getLabResults} from '../dist/strategy-ui.mjs';

test('Recall channels deduplicate while filter audit preserves every failed constraint',()=>{
 const r=executeSearch(analyze('100美元以内的降噪旅行耳机'));
 assert.ok(r.channels.keyword.length);assert.ok(r.channels.category.length);assert.ok(r.channels.attribute.length);
 assert.equal(r.counts.recalled,new Set(Object.values(r.channels).flat()).size);
 assert.ok(Object.values(r.channels).flat().length>r.counts.recalled);
 assert.equal(r.counts.recalled,r.counts.eligible+r.counts.filtered);
 const studio=r.audit.find(p=>p.id==='p8');assert.ok(studio.reasons.includes('stock'));assert.ok(studio.reasons.includes('budget'));
 assert.ok(r.audit.find(p=>p.id==='p2').reasons.includes('subcategory'));
});
test('Spelling and alias normalization preserve explicit prices and product intent',()=>{
 for(const t of ['headphons under $100 for travel','耳麦，100刀以内','100美元以内的降躁耳机']){
  const q=analyze(t);assert.equal(q.budget,100);assert.equal(q.category,'audio');assert.ok(q.preprocessing.changes.length);
 }
 assert.deepEqual(recommend(analyze('headphons under $100 for travel')).items.map(p=>p.id),recommend(analyze('headphones under $100 for travel')).items.map(p=>p.id));
});
test('Every strategy keeps hard constraints even under extreme ranking weights',()=>{
 for(const strategy of ['rating','match','diverse'])for(const c of EVAL_CASES){
  const q=analyze(c.text,c.market),r=executeSearch(q,PRODUCTS,{strategy,weights:{relevance:0,budget:0,availability:0,delivery:0,rating:100}});
  for(const p of r.items){assert.ok(p.stock>0);assert.ok(p.markets.includes(q.market));assert.ok(q.budgetUSD===null||p.price<=q.budgetUSD+.001);assert.ok(q.requiredFeatures.every(t=>p.tags.includes(t)));if(q.brand)assert.equal(p.brand,q.brand);}
 }
});
test('Weighted score components reconcile; zero weights fall back to safe defaults',()=>{
 assert.ok(Math.abs(Object.values(normalizeWeights({relevance:0,budget:0,availability:0,delivery:0,rating:0})).reduce((a,b)=>a+b)-1)<1e-9);
 const r=executeSearch(analyze('100美元以内的降噪耳机'),PRODUCTS,{weights:{relevance:1,budget:2,availability:3,delivery:4,rating:5}});
 for(const p of r.ranked)assert.ok(Math.abs(p.score-Object.values(p.components).reduce((a,b)=>a+b)*100)<.006);
});
test('Brand reranking changes the list without replacing explicit cheaper ordering',()=>{
 const q=analyze('100美元以内，适合坐飞机的降噪耳机'),a=executeSearch(q,PRODUCTS.filter(p=>Number(p.id.slice(1))<=40)),b=executeSearch(q,PRODUCTS.filter(p=>Number(p.id.slice(1))<=40),{strategy:'diverse'});
 assert.ok(new Set(b.items.map(p=>p.brand)).size>new Set(a.items.map(p=>p.brand)).size);
 assert.ok(b.final.some(p=>p.diversityPenalty>0));assert.deepEqual(a.final.map(p=>p.id).sort(),b.final.map(p=>p.id).sort());
 const cheap=executeSearch(q,PRODUCTS,{strategy:'diverse',sort:'price'});assert.equal(cheap.items[0].price,Math.min(...cheap.ranked.map(p=>p.price)));assert.ok(cheap.items.every(p=>p.diversityPenalty===0));
});
test('Shopper strategy and diagnostics use the exact same engine as the strategy lab',()=>{
 const text='100美元以内，适合坐飞机的降噪耳机',r=runShoppingTurn(text,{},PRODUCTS,{strategy:'diverse'}),expected=executeSearch(analyze(text),PRODUCTS,{strategy:'diverse'});
 assert.deepEqual(r.products.map(p=>p.id),expected.items.map(p=>p.id));assert.equal(r.search.strategy,'diverse');assert.ok(r.trace.some(t=>t.tool==='rerank_diversity'));
});
test('Empty queries in fixed evaluation are judged separately rather than rewarded with perfect ranking',()=>{
 const r=evaluateCases(EVAL_CASES,analyze);assert.equal(r.count,EVAL_CASES.length);
 for(const row of r.rows.filter(r=>r.expectedEmpty)){assert.equal(row.empty,true);assert.equal(row.ndcg,null);assert.equal(row.precision,null);assert.equal(row.recall,null);}
 assert.equal(r.metrics.constraintPass,1);assert.equal(r.metrics.emptyAccuracy,1);
});
test('Evaluation calculates nDCG and fixed-denominator Precision@3 from independent fixture grades',()=>{
 const rows=[{id:'known',text:'Sonar headphones under $100',market:'US',grades:{p13:3,p1:2}}],r=evaluateCases(rows,analyze,PRODUCTS.filter(p=>Number(p.id.slice(1))<=16));
 assert.equal(r.rows[0].ids[0],'p13');assert.equal(r.rows[0].precision,1/3);
 assert.ok(Math.abs(r.rows[0].ndcg-7/(7+3/Math.log2(3)))<1e-9);
});
const event=(type,detail,seconds)=>({type,detail,time:new Date(1700000000000+seconds*1000).toISOString()});
test('Observed funnel deduplicates impressions and links checkout to the same clicked and added product',()=>{
 const d={searchId:'s1',productId:'p1'},events=[event('search_results',{searchId:'s1',productIds:['p1','p2']},0),event('search_impression',d,1),event('search_impression',d,2),event('product_clicked',d,3),event('cart_added',d,4),event('checkout_preview',{items:[d]},5)];
 const f=summarizeFunnel(events.reverse());assert.equal(f.searches,1);assert.equal(f.impressions,1);assert.equal(f.clicks,1);assert.equal(f.ctr,1);assert.equal(f.checkout,1);
 const wrong=summarizeFunnel([event('checkout_preview',{items:[{searchId:'s1',productId:'p2'}]},7),...events.slice(1)]);assert.equal(wrong.checkout,0);
});
test('Unattributed or unexposed interactions do not enter the search funnel; missing rates stay unknown',()=>{
 const f=summarizeFunnel([event('product_clicked',{searchId:'missing',productId:'p1'},3)]);assert.equal(f.ctr,null);assert.equal(f.searches,0);
 const e=[event('product_clicked',{searchId:'s1',productId:'p1'},3),event('search_results',{searchId:'s1',productIds:['p1']},0)];assert.equal(summarizeFunnel(e).clicked,0);
});
test('Quick back uses observed close timing and excludes interactions that later add to cart',()=>{
 const d={searchId:'s1',productId:'p1'},events=[event('search_results',{searchId:'s1',productIds:['p1']},0),event('search_impression',d,1),event('product_clicked',d,2),event('product_detail_closed',d,6)].reverse();
 assert.equal(summarizeFunnel(events).quickBackRate,1);assert.equal(summarizeFunnel([event('cart_added',d,8),...events]).quickBackRate,0);
});
test('Inspecting a follow-up keeps inherited constraints and the explicit price order',()=>{
 const first=runShoppingTurn('100美元以内的降噪耳机'),follow=runShoppingTurn('便宜一点',first.context);
 const lab={...initialLab(),text:follow.query.text,market:'US',snapshot:{text:follow.query.text,market:'US',query:follow.query,sort:follow.search.sort}};
 assert.equal(getLabResults(lab).query.budget,100);assert.equal(getLabResults(lab).query.category,'audio');assert.deepEqual(getLabResults(lab).items.map(p=>p.id),follow.products.map(p=>p.id));
 lab.text='相机预算100美元';assert.equal(getLabResults(lab).query.category,'camera');
});

test('Expanded catalog and positive labels preserve complete purchasable candidates',()=>{
 assert.equal(PRODUCTS.length,200);assert.equal(new Set(PRODUCTS.map(p=>p.id)).size,200);
 for(const p of PRODUCTS){assert.ok(p.specs&&p.variants.length&&p.price>0);for(const m of p.markets)assert.ok(p.days[m]>0);}
 for(const c of EVAL_CASES)for(const [id,grade] of Object.entries(c.grades)){const p=PRODUCTS.find(p=>p.id===id);assert.ok(p);if(grade>0)assert.deepEqual(filterReasons(p,analyze(c.text,c.market)),[],c.id+':'+id);}
});

test('Evaluation split has 140 unique inputs and excludes acceptance cases from tuning',()=>{
 assert.equal(EVAL_CASES.length,140);assert.equal(DEV_CASES.length,112);assert.equal(HOLDOUT_CASES.length,28);
 assert.equal(new Set(EVAL_CASES.map(c=>c.id)).size,140);
 assert.equal(new Set(EVAL_CASES.map(c=>c.market+':'+c.text)).size,140);
 assert.ok(HOLDOUT_CASES.every(c=>!DEV_CASES.some(d=>d.id===c.id)));
 const result=evaluateCases(DEV_CASES,analyze);assert.ok(result.rows.some(c=>c.expectedEmpty));assert.ok(result.rows.some(c=>!c.expectedEmpty));
});

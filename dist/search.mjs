import {PRODUCTS} from './data.mjs';

export const DEFAULT_WEIGHTS={relevance:38,budget:22,availability:15,delivery:15,rating:10};
export const STRATEGIES={rating:{name:'A · 评分优先',en:'A · Rating first'},match:{name:'B · 需求匹配',en:'B · Need matching'},diverse:{name:'C · 匹配 + 品牌多样性',en:'C · Match + brand diversity'}};
export const REASONS={market:'市场不可售',stock:'缺货',budget:'超出预算',category:'品类不符',subcategory:'商品类型不符',feature:'缺少必要特性',brand:'品牌不符'};
export function preprocess(text){
 const original=String(text||''),normalized=original.normalize('NFKC').trim().replace(/\s+/g,' '),changes=[];
 let rewritten=normalized;
 for(const [re,replacement] of [[/headphons/ig,'headphones'],[/耳麦/g,'耳机'],[/蓝牙喇叭/g,'蓝牙音箱'],[/降躁/g,'降噪'],[/\bANC\b/ig,'noise cancellation'],[/(\d+)刀/g,'$1美元']]){
  if(re.test(rewritten)){re.lastIndex=0;rewritten=rewritten.replace(re,replacement);changes.push(replacement);}
 }
 return {original,normalized,rewritten,changes};
}
const clamp=n=>Math.max(0,Math.min(1,n));
export function normalizeWeights(weights={}){
 const safe=Object.fromEntries(Object.entries(DEFAULT_WEIGHTS).map(([k,v])=>[k,Math.max(0,Number.isFinite(Number(weights[k]))?Number(weights[k]):v)]));
 const sum=Object.values(safe).reduce((a,b)=>a+b,0);
 return sum?Object.fromEntries(Object.entries(safe).map(([k,v])=>[k,v/sum])):normalizeWeights(DEFAULT_WEIGHTS);
}
export function filterReasons(p,q){
 return [!p.markets.includes(q.market)&&'market',p.stock<=0&&'stock',q.budgetUSD!=null&&p.price>q.budgetUSD+.001&&'budget',q.category&&p.category!==q.category&&'category',q.subcategory&&(q.subcategory==='personal_audio'?!['headphones','earbuds'].includes(p.kind):p.kind!==q.subcategory)&&'subcategory',(q.requiredFeatures||[]).some(f=>!p.tags.includes(f))&&'feature',q.brand&&p.brand?.toLowerCase()!==q.brand.toLowerCase()&&'brand'].filter(Boolean);
}
function features(p,q){
 const wants=q.concerns||[];
 const relevance=wants.length?wants.filter(c=>p.tags.includes(c)).length/wants.length:q.category?1:.5;
 return {relevance,budget:q.budgetUSD?clamp(1-Math.abs(q.budgetUSD*.78-p.price)/q.budgetUSD):.7,availability:clamp(p.stock/30),delivery:clamp(1-(p.days[q.market]-1)/5),rating:clamp(p.rating/5)};
}
function tokens(text){return [...new Set([...(text.toLowerCase().match(/[a-z][a-z0-9]+/g)||[]),...['耳机','耳塞','音箱','相机','充电宝','移动电源','托特包','出行包','防水','降噪','旅行','便携','快充','礼物','台灯'].filter(t=>text.includes(t))])].filter(t=>!['under','budget','need','want'].includes(t));}
export function executeSearch(q,products=PRODUCTS,{strategy='match',weights=DEFAULT_WEIGHTS,sort='match',limit=3,diversityPenalty=12}={}){
 strategy=STRATEGIES[strategy]?strategy:'match';
 const terms=tokens(preprocess(q.text).rewritten),hasSemantic=Boolean(q.category||q.brand||(q.concerns||[]).length);
 const channels={keyword:[],category:[],attribute:[],brand:[],browse:[]};
 for(const p of products){
  const hay=[p.name,p.zh,p.description,...p.tags].join(' ').toLowerCase();
  if(terms.some(t=>hay.includes(t)))channels.keyword.push(p.id);
  if(q.category&&p.category===q.category)channels.category.push(p.id);
  if((q.concerns||[]).some(c=>p.tags.includes(c)))channels.attribute.push(p.id);
  if(q.brand&&p.brand?.toLowerCase()===q.brand.toLowerCase())channels.brand.push(p.id);
  if(!hasSemantic)channels.browse.push(p.id);
 }
 const recalled=new Set(Object.values(channels).flat()),w=strategy==='rating'?{relevance:0,budget:0,availability:0,delivery:0,rating:1}:normalizeWeights(weights);
 const audit=products.map(p=>({id:p.id,name:p.name,channels:Object.entries(channels).filter(([,ids])=>ids.includes(p.id)).map(([k])=>k),recalled:recalled.has(p.id),reasons:filterReasons(p,q)}));
 const allowed=products.filter(p=>recalled.has(p.id)&&!filterReasons(p,q).length);
 const ranked=allowed.map(p=>{const f=features(p,q),components=Object.fromEntries(Object.entries(w).map(([k,v])=>[k,f[k]*v]));return {...p,features:f,components,score:Number((Object.values(components).reduce((a,b)=>a+b,0)*100).toFixed(2))};});
 ranked.sort(sort==='price'?(a,b)=>a.price-b.price||b.score-a.score:sort==='battery'?(a,b)=>(b.specs.battery||0)-(a.specs.battery||0)||b.score-a.score:(a,b)=>b.score-a.score||a.price-b.price||a.id.localeCompare(b.id));
 const final=[],remaining=ranked.map((p,i)=>({...p,initialRank:i+1})),penalty=Math.max(0,Number.isFinite(diversityPenalty)?diversityPenalty:12);
 while(remaining.length){
  const scored=remaining.map(p=>({...p,diversityPenalty:strategy==='diverse'&&sort==='match'?penalty*final.filter(x=>x.brand===p.brand).length:0})).map(p=>({...p,selectionScore:p.score-p.diversityPenalty}));
  if(strategy==='diverse'&&sort==='match')scored.sort((a,b)=>b.selectionScore-a.selectionScore||a.initialRank-b.initialRank);
  const chosen=scored[0];final.push({...chosen,finalRank:final.length+1});remaining.splice(remaining.findIndex(p=>p.id===chosen.id),1);
 }
 const excluded=audit.filter(x=>x.recalled&&x.reasons.length).map(x=>({...x,reason:x.reasons[0]}));
 return {query:q,strategy,weights:w,sort,channels,audit,ranked,final,items:final.slice(0,limit),excluded,counts:{catalog:products.length,recalled:recalled.size,filtered:excluded.length,eligible:allowed.length,returned:Math.min(final.length,limit)},reason:final.length?'ok':'no_match'};
}

export function evaluateCases(cases,analyze,products=PRODUCTS,options={}){
 const rows=cases.map(c=>{
  const q=analyze(c.text,c.market),r=executeSearch(q,products,options),grades=c.grades,positive=Object.keys(grades).filter(id=>grades[id]>0),ids=r.items.map(p=>p.id);
  const dcg=values=>values.reduce((s,g,i)=>s+(2**g-1)/Math.log2(i+2),0),ideal=dcg(Object.values(grades).sort((a,b)=>b-a).slice(0,3));
  const hits=ids.filter(id=>grades[id]>0).length;
  return {...c,ids,ndcg:ideal?dcg(ids.map(id=>grades[id]||0))/ideal:null,precision:positive.length?hits/3:null,recall:positive.length?positive.filter(id=>r.audit.find(x=>x.id===id)?.recalled).length/positive.length:null,violations:r.items.filter(p=>filterReasons(p,q).length).length,empty:r.items.length===0,expectedEmpty:positive.length===0,brands:new Set(r.items.map(p=>p.brand)).size};
 });
 const mean=key=>{const values=rows.map(r=>r[key]).filter(x=>x!==null);return values.length?values.reduce((a,b)=>a+b,0)/values.length:null;};
 return {rows,metrics:{ndcg:mean('ndcg'),precision:mean('precision'),recall:mean('recall'),constraintPass:rows.filter(r=>!r.violations).length/rows.length,emptyAccuracy:rows.filter(r=>r.empty===r.expectedEmpty).length/rows.length,meanBrands:mean('brands')},count:rows.length};
}

// Only the current browser's retained search events enter this funnel. Strategy-lab runs are excluded.
export function summarizeFunnel(events){
 const searches=new Map(events.filter(e=>e.type==='search_results').map(e=>[e.detail.searchId,e]));
 const sets={search:new Set(searches.keys()),exposed:new Set(),clicked:new Set(),cart:new Set(),checkout:new Set()};
 const products=new Set(),clicks=new Set(),clickTimes=new Map(),quickBack=new Set(),cartProducts=new Set();
 for(const e of [...events].reverse()){
  const d=e.detail||{},key=d.searchId&&d.productId?d.searchId+':'+d.productId:null;
  if(!searches.has(d.searchId)&&!['checkout_preview'].includes(e.type))continue;
  if(e.type==='search_impression'&&key&&searches.get(d.searchId).detail.productIds.includes(d.productId)){products.add(key);sets.exposed.add(d.searchId);}
  if(e.type==='product_clicked'&&key&&products.has(key)){clicks.add(key);sets.clicked.add(d.searchId);clickTimes.set(key,Date.parse(e.time));}
  if(e.type==='product_detail_closed'&&key&&clickTimes.has(key)&&Date.parse(e.time)-clickTimes.get(key)<10000&&!events.some(x=>x.type==='cart_added'&&x.detail.searchId===d.searchId&&x.detail.productId===d.productId))quickBack.add(key);
  if(e.type==='cart_added'&&key&&clicks.has(key)){sets.cart.add(d.searchId);cartProducts.add(key);}
  if(e.type==='checkout_preview')for(const x of d.items||[])if(cartProducts.has(x.searchId+':'+x.productId))sets.checkout.add(x.searchId);
 }
 return {searches:sets.search.size,exposed:sets.exposed.size,clicked:sets.clicked.size,cart:sets.cart.size,checkout:sets.checkout.size,impressions:products.size,clicks:clicks.size,ctr:products.size?clicks.size/products.size:null,quickBackRate:clicks.size?quickBack.size/clicks.size:null,zeroRate:searches.size?[...searches.values()].filter(e=>!e.detail.productIds.length).length/searches.size:null,stages:Object.entries(sets).map(([key,set])=>({key,count:set.size}))};
}

import {MARKETS,PRODUCTS} from './data.mjs';
import {preprocess,executeSearch} from './search.mjs';
export function money(amount,market='US'){const m=MARKETS[market]||MARKETS.US;return new Intl.NumberFormat(m.locale,{style:'currency',currency:m.currency,maximumFractionDigits:m.currency==='IDR'?0:2}).format(amount);}
export function localPrice(product,market='US'){return Math.round(product.price*(MARKETS[market]||MARKETS.US).rate*100)/100;}
const match=(s,re)=>re.test(s);
export function analyze(text,market='US'){
 const prepared=preprocess(text),s=prepared.rewritten,v=s.toLowerCase();
 const brand=[...new Set(PRODUCTS.map(p=>p.brand))].find(b=>new RegExp('\\b'+b+'\\b','i').test(s))||null;
 const lang=match(s,/[\u4e00-\u9fff]/)?'中文':match(v,/\b(quiero|busco|menos|regalo|puedo|auriculares|batería|altavoz|devolver)\b|[¿¡]/)?'Español':match(v,/\b(mau|beli|kirim|cari|sekarang|untuk|bisa)\b/)?'Bahasa Indonesia':'English';
 const after=match(v,/refund|damaged|not working|doesn.t work|broken|退货(?!政策)|退款|坏了|故障|devolver|no funciona|rusak|pengembalian|how.{0,14}return|return (it|them|my|the)/);
 const policy=match(v,/warranty|return policy|保修|退换|退货政策|garantía|returns/);
 const category=match(v,/headphone|earbud|speaker|耳机|耳塞|音箱|altavoz|auriculares/)?'audio':match(v,/camera|相机|cámara/)?'camera':match(v,/power bank|移动电源|充电宝/)?'charger':match(v,/\bbag\b|\btote\b|包|bolso/)?'bag':match(v,/\blight\b|\blamp\b|灯/)?'home':null;
 const subcategory=match(v,/speaker|音箱|altavoz/)?'speaker':match(v,/earbud|耳塞|真无线/)?'earbuds':match(v,/headphone|头戴/)?'headphones':match(v,/耳机|auriculares/)?'personal_audio':null;
 let budget=null,currency=MARKETS[market]?.currency||'USD';
 const budgetContext=match(v,/budget|under|less than|below|within|up to|por menos|presupuesto|预算|以内|以下/);
 const marked=s.match(/(?:预算(?:改成|调整为|改为|是)?|budget(?: is| of)?|under|less than|below|within|up to|por menos de|presupuesto)\s*[:：]?\s*(S\$|US\$|USD\s*|SGD\s*|GBP\s*|IDR\s*|Rp\s*|£|\$)?\s*([\d,]+(?:\.\d+)?)\s*(美元|英镑|新币|USD|GBP|SGD|IDR)?/i);
 const suffix=s.match(/([\d,]+(?:\.\d+)?)\s*(美元|英镑|新币|元|USD|GBP|SGD|IDR)\s*(?:以内|以下)/i);
 const amount=marked||(suffix?[suffix[0],suffix[2],suffix[1]]:null)||s.match(/(S\$|US\$|USD\s*|SGD\s*|GBP\s*|IDR\s*|Rp\s*|£|\$)\s*([\d,]+(?:\.\d+)?)/i);
 if(budgetContext&&amount){budget=Number(amount[2].replace(/,/g,''));const c=(amount[1]||amount[3]||'').trim().toUpperCase();currency=['S$','SGD','新币'].includes(c)?'SGD':['£','GBP','英镑'].includes(c)?'GBP':['RP','IDR'].includes(c)?'IDR':['$','US$','USD','美元'].includes(c)?'USD':currency;}
 const concerns=[];
 for(const [key,re]of [['noise',/noise|降噪|cancel/],['travel',/flight|travel|出差|旅行|飞机/],['battery',/battery|续航|batería/],['waterproof',/waterproof|resistente al agua|防水/],['gift',/gift|regalo|礼物/],['fast',/fast charg|快充/],['portable',/portable|lightweight|便携|轻便/]])if(match(v,re))concerns.push(key);
 const removed=[];for(const [key,re]of [['noise',/不(?:需要|要|用)降噪|no (need for )?(anc|noise cancelling)/],['waterproof',/不(?:需要|要)防水/],['fast',/不(?:需要|要)快充/]])if(match(v,re))removed.push(key);
 const filtered=concerns.filter(c=>!removed.includes(c));
 const budgetUSD=budget===null?null:budget/({USD:1,GBP:.78,SGD:1.34,IDR:15700}[currency]||1);
 return {text:s,originalText:String(text||''),preprocessing:prepared,brand,market,lang,intent:after?'after_sales':policy?'policy':match(v,/compare|versus|\bvs\b|比较|对比|哪个|哪款/)?'compare':'recommend',category,subcategory,budget,currency,budgetUSD,concerns:filtered,removed,requiredFeatures:filtered.filter(c=>['noise','waterproof','fast'].includes(c)),method:'rules'};
}
export function mergeQuery(previous,current){if(!previous)return current;const changed=(current.category&&current.category!==previous.category)||(current.subcategory&&previous.subcategory&&((current.subcategory==='speaker')!==(previous.subcategory==='speaker')));
 const concerns=[...new Set([...(changed?[]:previous.concerns||[]),...current.concerns])].filter(x=>!current.removed?.includes(x));
 return {...previous,...current,category:current.category||previous.category,brand:current.brand||(changed?null:previous.brand),subcategory:current.subcategory||(changed?null:previous.subcategory),budget:current.budget??previous.budget,currency:current.budget===null?previous.currency:current.currency,budgetUSD:current.budget===null?previous.budgetUSD:current.budgetUSD,concerns,requiredFeatures:concerns.filter(c=>['noise','waterproof','fast'].includes(c))};}
export function recommend(a,products=PRODUCTS,options={}){
 if(a.intent==='after_sales')return{items:[],excluded:[],reason:'after_sales'};
 const result=executeSearch(a,products,options);return {...result,items:result.items.map(p=>({...p,priceLocal:localPrice(p,a.market)}))};
}
export function guardrails(a,recs,products=PRODUCTS){return[{id:'budget',label:'预算范围',pass:recs.every(p=>a.budgetUSD===null||p.price<=a.budgetUSD+.001)},{id:'catalog',label:'商品来源',pass:recs.every(p=>products.some(x=>x.id===p.id&&x.name===p.name&&x.price===p.price))},{id:'stock',label:'库存可售',pass:recs.every(p=>p.stock>0)},{id:'market',label:'市场可达',pass:recs.every(p=>p.markets.includes(a.market))},{id:'feature',label:'必要特性',pass:recs.every(p=>(a.requiredFeatures||[]).every(f=>p.tags.includes(f)))}];}
export function compareProducts(ids,market='US',products=PRODUCTS){return [...new Set(ids)].slice(0,3).map(id=>products.find(p=>p.id===id)).filter(Boolean).map(p=>({...p,priceLocal:localPrice(p,market)}));}
export function addCart(cart,productId,variantId,market,products=PRODUCTS){const p=products.find(p=>p.id===productId);if(!p||!p.markets.includes(market)||p.stock<=0)return{ok:false,error:'unavailable'};if(!p.variants.some(v=>v.id===variantId))return{ok:false,error:'variant_required'};const total=cart.filter(x=>x.productId===p.id&&x.market===market).reduce((a,b)=>a+b.quantity,0);if(total>=p.stock)return{ok:false,error:'stock_limit'};const next=structuredClone(cart),item=next.find(x=>x.productId===p.id&&x.variantId===variantId&&x.market===market);if(item)item.quantity++;else next.push({id:`${p.id}:${variantId}:${market}`,productId:p.id,variantId,market,quantity:1});return{ok:true,cart:next};}
export function checkoutDraft(cart,market,products=PRODUCTS){const rows=cart.filter(x=>x.market===market);if(!rows.length)return{ok:false,error:'empty'};const counts=new Map();for(const x of rows){if(!Number.isInteger(x.quantity)||x.quantity<1)return{ok:false,error:'quantity'};const p=products.find(p=>p.id===x.productId);if(!p||!p.markets.includes(market)||!p.variants.some(v=>v.id===x.variantId))return{ok:false,error:'unavailable'};counts.set(p.id,(counts.get(p.id)||0)+x.quantity);if(counts.get(p.id)>p.stock)return{ok:false,error:'stock_limit'};}
 const items=rows.map(x=>{const p=products.find(p=>p.id===x.productId),v=p.variants.find(v=>v.id===x.variantId);return{productId:p.id,product:p.name,variantId:v.id,variant:v.name,quantity:x.quantity,unitPrice:localPrice(p,market)};});return{ok:true,market,currency:MARKETS[market].currency,items,subtotal:Math.round(items.reduce((sum,x)=>sum+x.unitPrice*x.quantity,0)*100)/100,shipping:null,tax:null,paymentCollected:false,orderCreated:false,mode:'demo_handoff'};}

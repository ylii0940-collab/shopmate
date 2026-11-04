// Fixture rubric, NOT independent human relevance labels or online evidence.
// Does not import the parser, ranking engine, model weights or strategy results.
import {writeFile} from 'node:fs/promises';
import {PRODUCTS} from '../dist/data.mjs';
import {EVAL_CASES as original} from '../reports/archive/eval-catalog40.mjs';
const configs=[
 {kinds:['headphones','earbuds'],budget:100,hard:['noise'],soft:['travel','comfort']},
 {kinds:['headphones'],budget:100,soft:['travel']},
 {budget:50,hard:['gift'],soft:['portable']},
 {kinds:['camera'],budget:180/1.34,soft:['portable','travel']},
 {kinds:['speaker'],budget:50,hard:['waterproof'],soft:['portable']},
 {kinds:['headphones','earbuds'],budget:50/.78,soft:['noise']},
 {kinds:['speaker'],budget:1200000/15700,soft:['portable']},
 {kinds:['charger'],budget:60,hard:['fast'],soft:['travel','portable']},
 {kinds:['headphones'],brand:'Sonar',budget:100,soft:[]},
 {kinds:['headphones'],budget:20},
 {kinds:['bag'],budget:50,hard:['waterproof'],soft:['travel']},
 {kinds:['headphones'],budget:100,soft:['travel']}
];
function grade(p,c,market){
 if(!p.markets.includes(market)||p.stock<=0||p.price>c.budget||(c.kinds&&!c.kinds.includes(p.kind))||(c.brand&&p.brand!==c.brand)||(c.hard||[]).some(t=>!p.tags.includes(t)))return 0;
 const soft=c.soft||[];return soft.every(t=>p.tags.includes(t))?3:soft.some(t=>p.tags.includes(t))?2:1;
}
const cases=original.map((c,i)=>{
 const grades={...c.grades};for(const p of PRODUCTS.filter(p=>Number(p.id.slice(1))>40)){const g=grade(p,configs[i],c.market);if(g)grades[p.id]=g;}
 return {...c,grades,note:c.id==='q11'?'扩充后ID市场已有符合预算的防水包，此例改为有结果覆盖。':'保留原商品等级；新商品按固定属性规则生成等级，未参考排序结果。'};
});
const kinds=[['headphones','头戴耳机','travel'],['earbuds','耳塞','portable'],['speaker','音箱','waterproof'],['camera','相机','portable'],['charger','充电宝','fast'],['bag','出行包','waterproof'],['lamp','桌灯','portable']];
const budgets={US:100,UK:70,SG:150,ID:1000000},rates={US:1,UK:.78,SG:1.34,ID:15700},symbols={US:'$',UK:'£',SG:'S$',ID:'Rp'};
for(const [kind,zh,tag] of kinds)for(const market of Object.keys(budgets)){
 const phrase={travel:'旅行',portable:'便携',waterproof:'防水',fast:'快充'}[tag];
 const text=market==='US'?`${phrase}${zh}，预算${budgets[market]}美元`:`${tag==='fast'?'fast charging':tag} ${kind==='charger'?'power bank':kind==='earbuds'?'earbuds':kind==='headphones'?'headphones':kind} under ${symbols[market]}${budgets[market]}`;
 const cfg={kinds:[kind],budget:budgets[market]/rates[market],hard:['waterproof','fast'].includes(tag)?[tag]:[],soft:['waterproof','fast'].includes(tag)?['portable']:[tag]};
 const grades=Object.fromEntries(PRODUCTS.map(p=>[p.id,grade(p,cfg,market)]).filter(([,g])=>g));
 cases.push({id:'q'+String(cases.length+1).padStart(2,'0'),text,market,slice:zh+' / '+market,grades,note:'合成属性规则标注：满足可售、预算、类型与必要属性；软偏好全满足3级、部分2级、未满足1级。不是独立人评。'});
}
// 70 boundary/availability/attribute cases: ten per product type.
function addCase(text,market,cfg,slice,split='dev'){
 const grades=Object.fromEntries(PRODUCTS.map(p=>[p.id,grade(p,cfg,market)]).filter(([,g])=>g));
 cases.push({id:'q'+String(cases.length+1).padStart(3,'0'),text,market,slice,split,grades,note:'固定属性规则标注；不读取解析器或策略分数。模拟数据，非独立人评。'});
}
for(const [kind,zh,tag] of kinds){
 const eligible=PRODUCTS.filter(p=>p.kind===kind&&p.stock>0&&p.markets.includes('US'));
 const min=Math.min(...eligible.map(p=>p.price));
 const rows=[
  [zh+'，预算'+(min-0.01).toFixed(2)+'美元',min-0.01,[],[], '最低价以下'],
  [zh+'，预算'+min+'美元',min,[],[], '刚好最低价'],
  [zh+'，预算'+(min+0.01).toFixed(2)+'美元',min+0.01,[],[], '最低价以上'],
  [zh+'，预算1美元',1,[],[], '无结果'],
  [zh+'，预算1000美元',1000,[],[], '宽预算'],
  ['便携'+zh+'，预算80美元',80,[],['portable'], '便携偏好'],
  ['旅行'+zh+'，预算120美元',120,[],['travel'], '旅行偏好'],
  ['防水'+zh+'，预算90美元',90,['waterproof'],[], '必要属性或属性无解'],
  [zh+'，预算45美元',45,[],[], '低价候选'],
  ['便携旅行'+zh+'，预算75美元',75,[],['portable','travel'], '组合偏好']
 ];
 for(const [text,budget,hard,soft,label] of rows)addCase(text,'US',{kinds:[kind],budget,hard,soft},zh+' / '+label,label==='组合偏好'?'holdout':'dev');
}
// 21 designated-brand cases reserved for acceptance, not interactive tuning.
for(const [kind,zh] of kinds){
 const brands=[...new Set(PRODUCTS.filter(p=>p.kind===kind).map(p=>p.brand))].slice(0,3);
 for(const brand of brands)addCase(brand+' '+zh+'，预算100美元','US',{kinds:[kind],brand,budget:100},zh+' / 指定品牌','holdout');
}
const aliases=[
 ['headphons under $70 for travel',['headphones'],70,[],['travel']],
 ['耳麦，80刀以内',['headphones','earbuds'],80,[],[]],
 ['降躁耳机，预算90美元',['headphones','earbuds'],90,['noise'],[]],
 ['蓝牙喇叭，预算40美元',['speaker'],40,[],[]],
 ['ANC earbuds under $65',['earbuds'],65,['noise'],[]],
 ['送朋友的礼物，预算30美元',null,30,[],['gift']],
 ['想随便逛逛，预算50美元',null,50,[],[]],
 ['waterproof speaker under $55',['speaker'],55,['waterproof'],[]],
 ['portable power bank under $35',['charger'],35,[],['portable']]
];
for(const [text,ks,budget,hard,soft] of aliases)addCase(text,'US',{kinds:ks,budget,hard,soft},'别名、纠错与泛需求');
for(const c of cases)c.split ||= 'dev';
if(cases.length!==140)throw new Error('Expected 140 cases, got '+cases.length);
await writeFile(new URL('../dist/eval-data.mjs',import.meta.url),`// Frozen synthetic rubric fixtures. Not independent human judgements.\nexport const EVAL_VERSION='shopmate-rubric-v4-eval140';\nexport const EVAL_CASES=${JSON.stringify(cases,null,2)};\nexport const DEV_CASES=EVAL_CASES.filter(c=>c.split==='dev');\nexport const HOLDOUT_CASES=EVAL_CASES.filter(c=>c.split==='holdout');\n`);
console.log(`${cases.length} frozen cases; ${PRODUCTS.length} products`);

// Reproducible synthetic fixtures. No network, sales data or random outcomes.
import {writeFile} from 'node:fs/promises';
import {PRODUCTS} from '../dist/data.mjs';
const base=PRODUCTS.filter(p=>Number(p.id.slice(1))<=40);
const groups=[
 ['headphones','audio',32,['Aero','Sonar','Melo'], '头戴耳机',35,12],
 ['earbuds','audio',32,['Aero','Sonar','Melo'],'真无线耳塞',25,9],
 ['speaker','audio',32,['Pulse','Trail','Sonar'],'蓝牙音箱',19,11],
 ['camera','camera',28,['Vista','Orbit','Focus'],'便携相机',69,27],
 ['charger','charger',28,['Volt','Pulse','Spark'],'移动电源',19,8],
 ['bag','bag',24,['Flow','Orbit','Trail'],'出行包',15,9],
 ['lamp','home',24,['Luma','Glow','Halo'],'桌灯',19,8]
];
let id=41;const added=[];
for(const [kind,category,total,brands,zh,low,step] of groups){
 const count=total-base.filter(p=>p.kind===kind).length;
 for(let j=0;j<count;j++){
  const tier=j%4,brand=brands[j%3],tags=[],specs={};
  if(['headphones','earbuds'].includes(kind)){
   tags.push('battery');if(j%4!==0)tags.push('noise');if(j%3!==0)tags.push('travel');if(j%2===0)tags.push('comfort');if(kind==='earbuds'||j%3===1)tags.push('portable');
   specs.battery=(kind==='headphones'?24:16)+tier*8+j%5;specs.weight=kind==='headphones'?185+tier*25:38+tier*6;
  }
  if(kind==='speaker'){tags.push('battery');if(j%3!==0)tags.push('waterproof');if(tier<2)tags.push('portable','travel');specs.battery=8+tier*6;specs.weight=180+tier*230;specs.powerW=5+tier*10;}
  if(kind==='camera'){tags.push('video');if(tier<3)tags.push('portable');if(j%3!==0)tags.push('travel');if(j%4===2)tags.push('waterproof');specs.battery=1.5+tier*.5;specs.weight=100+tier*80;specs.video=tier<2?'1080p':'4K';}
  if(kind==='charger'){tags.push('battery');if(j%3!==0)tags.push('fast');if(tier<2)tags.push('portable','travel');specs.weight=180+tier*110;specs.capacity=[10000,15000,20000,30000][tier];specs.powerW=[12,20,30,65][tier];}
  if(kind==='bag'){tags.push('travel');if(tier<2)tags.push('portable');if(j%3!==0)tags.push('waterproof');specs.weight=200+tier*160;specs.volumeL=[10,16,24,35][tier];}
  if(kind==='lamp'){tags.push('light','comfort');if(tier===0)tags.push('portable');specs.weight=240+tier*190;specs.brightnessLm=[250,400,650,900][tier];specs.powerW=[4,6,9,12][tier];}
  if(j%3===0)tags.push('gift');
  const markets=j%6===1?['US','UK']:j%6===2?['SG','ID']:['US','UK','SG','ID'];
  const days=Object.fromEntries(['US','UK','SG','ID'].map((m,k)=>[m,1+(j*3+k*2+tier)%9]));
  const price=low+tier*step+(j%5)*3;
  const description=[specs.battery&&`${specs.battery}h ${kind==='earbuds'?'with case':'battery'}`,specs.capacity&&`${specs.capacity}mAh`,specs.volumeL&&`${specs.volumeL}L`,specs.video,specs.brightnessLm&&`${specs.brightnessLm}lm`,specs.powerW&&`${specs.powerW}W`,`${specs.weight}g`].filter(Boolean).join(' · ');
  added.push({id:'p'+id++,name:`${brand} ${['Essential','Travel','Plus','Pro'][tier]} ${kind==='headphones'?'Headphones':kind==='earbuds'?'Buds':kind==='charger'?'Power Bank':kind[0].toUpperCase()+kind.slice(1)} ${String(j+1).padStart(2,'0')}`,zh:`${brand} ${['基础','轻旅','优选','进阶'][tier]}${zh} ${j+1}`,category,kind,price,rating:Number((3.8+((j*7+tier)%12)/10).toFixed(1)),stock:j%13===0?0:j%7===0?2:8+(j*17)%83,days,markets,tags,color:['#b6c7d8','#e1c4b1','#a7b8a1','#ced6ee'][tier],description,policy:`30-day returns · ${tier===3?24:12}-month warranty`,specs});
 }
}
await writeFile(new URL('../dist/catalog-extra.mjs',import.meta.url),'// Synthetic catalog v3. Rebuild with node scripts/expand-catalog.mjs.\nexport const CATALOG_EXTRA = '+JSON.stringify(added,null,2)+';\n');
console.log(`Preserved ${base.length}; added ${added.length}; total ${base.length+added.length}`);

// Temporary deterministic fixture. Delete this script when the admin supplies verified metadata.
import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../public/catalog-data.json',import.meta.url);
const products=JSON.parse(await readFile(file,'utf8'));
let state=20261125;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const snacks=Object.values(products).filter(p=>p.kind==='Брускетты');
const boxes=Object.values(products).filter(p=>p.kind==='Фудбоксы');
for(const [id,p] of Object.entries(products)){
 p.tags=[p.tag]; if(id==='fruit')p.tags.push('Фруктовое','Сладкое');
 p.demoMetadata=true; p.demoTags=[];p.demoKinds=[];
}
// Cover each additional filter without changing source names, prices or actual dish types.
for(const pool of [snacks,boxes]){const shuffled=shuffle(pool);for(const [i,tag] of ['Детское','Острое','Сладкое','Фруктовое'].entries())shuffled[i%shuffled.length].demoTags.push(tag);for(const p of pool)if(random()<0.35&&!p.demoTags.includes('Острое'))p.demoTags.push('Острое');}
shuffle(snacks).forEach((p,i)=>p.demoKinds.push(['Бургеры','Канапе','Бейглы','Нарезка','Круассаны','Аппетайзеры'][i]));
for(const p of Object.values(products)){p.tags=[...new Set(p.tags)];}
const content=JSON.stringify(products,null,2);await writeFile(file,content+'\n');await writeFile(new URL('../public/catalog-data.js',import.meta.url),'globalThis.PONE_PRODUCTS = '+content+';\n');

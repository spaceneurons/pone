import http from 'node:http';
import {readFile,stat,mkdir,appendFile} from 'node:fs/promises';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
// .env is server-only; environment variables override it.
if(existsSync(path.join(root,'.env')))for(const line of readFileSync(path.join(root,'.env'),'utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);if(m&&!Object.hasOwn(process.env,m[1]))process.env[m[1]]=m[2].replace(/^(['"])(.*)\1$/,'$2');}
const products=JSON.parse(await readFile(path.join(root,'public/catalog-data.json'),'utf8'));
const port=Number(process.env.PORT||3000), host=process.env.HOST||'127.0.0.1';
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
const openNow=()=>{const h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Minsk',hour:'2-digit',hourCycle:'h23'}).format(new Date()));return h>=9&&h<23};
const attempts=new Map();
setInterval(()=>{const cutoff=Date.now()-600000;for(const [ip,t] of attempts)if(t.start<cutoff)attempts.delete(ip)},60000).unref();
function validate(d){if(!d||typeof d!=='object')throw Error('Неверный формат данных');const get=(k,max)=>{if(d[k]!==undefined&&typeof d[k]!=='string')throw Error('Неверное значение поля');const v=(d[k]||'').trim();if(v.length>max)throw Error('Слишком длинное поле');return v};const name=get('name',80),phone=get('phone',25),email=get('email',150),comment=get('comment',1000);if(name.length<2)throw Error('Введите имя');if(!/^[+\d\s()\-]+$/.test(phone)||phone.replace(/\D/g,'').length<9||phone.replace(/\D/g,'').length>15)throw Error('Некорректный номер телефона');if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Некорректный E-mail');if(d.agreement!==true||d.privacy!==true)throw Error('Необходимо принять оба соглашения');return {name,phone,email,comment};}
async function body(req){let data='';for await(const c of req){data+=c;if(data.length>24000)throw Error('Слишком большой запрос')}try{return JSON.parse(data)}catch{throw Error('Неверный JSON')}}
async function saveSubmission(record){const dir=path.join(root,'data');await mkdir(dir,{recursive:true,mode:0o700});await appendFile(path.join(dir,'submissions.jsonl'),JSON.stringify(record)+'\n',{encoding:'utf8',mode:0o600});}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const pages=new Set(['preview.html','boxes.html','constructor.html','product.html']);
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname==='/api/status'&&req.method==='GET')return json(res,200,{open:openNow(),timezone:'Europe/Minsk',hours:'09:00–23:00'});
 if(['/api/request','/api/order'].includes(u.pathname)&&req.method==='POST'){
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))return json(res,415,{error:'Ожидается JSON'});
  if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'Недопустимый источник запроса'})}catch{return json(res,403,{error:'Недопустимый источник запроса'})}}
  const ip=req.socket.remoteAddress||'unknown',now=Date.now(),prev=attempts.get(ip);const rate=prev&&now-prev.start<600000?prev:{start:now,n:0};if(++rate.n>15)return json(res,429,{error:'Слишком много запросов. Попробуйте позже.'});attempts.set(ip,rate);
  const order=u.pathname==='/api/order';if(order&&!openNow())return json(res,403,{error:'Заказы принимаются ежедневно с 09:00 до 23:00 по Минску.'});let d,f,lines=[];try{d=await body(req);f=validate(d);if(order){if(!Array.isArray(d.items)||!d.items.length||d.items.length>Object.keys(products).length)throw Error('Корзина пуста или некорректна');const seen=new Set();let total=0;for(const item of d.items){if(!item||typeof item.id!=='string'||!Object.hasOwn(products,item.id)||seen.has(item.id))throw Error('Неизвестная или повторная позиция');seen.add(item.id);const p=products[item.id];if(!Number.isInteger(item.qty)||item.qty<p.min||item.qty>999)throw Error('Некорректное количество товара');const sum=p.price*item.qty;total+=sum;lines.push(`${p.name} [${item.id}] × ${item.qty} = ${sum} Br`)}lines.push(`Итого: ${total} Br`)}}catch(e){return json(res,400,{error:e.message})}
  if(order&&!openNow())return json(res,403,{error:'Заказы принимаются с 09:00 до 23:00 по Минску.'});try{await saveSubmission({type:order?'order':'request',createdAt:new Date().toISOString(),...f,agreement:true,privacy:true,items:order?d.items:[],lines})}catch{return json(res,500,{error:'Не удалось сохранить заявку. Попробуйте позже.'})}return json(res,200,{ok:true});
 }
 if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Метод не поддерживается'});
 let relative=decodeURIComponent(u.pathname).replace(/^\/+/, '');if(!relative||relative==='index.html')relative={boxes:'boxes.html',constructor:'constructor.html',product:'product.html'}[u.searchParams.get('page')]||'preview.html';if(relative.startsWith('assets/'))relative='public/'+relative;
 if(!pages.has(relative)&&!/^public\/(?:assets\/[A-Za-z0-9_.-]+|site\.(?:js|css)|catalog-data\.js)$/.test(relative))return json(res,404,{error:'Не найдено'});
 const file=path.join(root,relative);const info=await stat(file);if(!info.isFile())return json(res,404,{error:'Не найдено'});const content=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Content-Length':content.length});res.end(req.method==='HEAD'?undefined:content);
 }catch(e){if(!res.headersSent)json(res,e.code==='ENOENT'?404:500,{error:e.code==='ENOENT'?'Не найдено':'Ошибка сервера'});else res.end()}});
server.listen(port,host,()=>console.log(`Вкусный След: http://${host}:${port}`));

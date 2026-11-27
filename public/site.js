(() => {
'use strict';
const P=globalThis.PONE_PRODUCTS, svg=document.querySelector('svg[data-page]'); if(!P||!svg||svg.dataset.initialized)return; svg.dataset.initialized='1';
const page=svg.dataset.page, NS='http://www.w3.org/2000/svg', XHTML='http://www.w3.org/1999/xhtml';
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const S=(tag,attrs={})=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);return el};
const H=(tag,attrs={},text)=>{const el=document.createElement(tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(text!=null)el.textContent=text;return el};
const tspan=t=>t.querySelector('tspan')||t;
const val=t=>t.textContent.trim();
const textAll=()=>$$('text',svg);
const findText=(s,p=svg)=>$$('text',p).find(t=>val(t)===s);
const xy=t=>[+tspan(t).getAttribute('x'),+tspan(t).getAttribute('y')];
function action(el,fn,label){el.classList.add('click-target');el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',label);el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();fn(e)});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});return el}
function hit(p,x,y,w,h,fn,label){const pill=label==='Смотреть готовые';const r=S('rect',{x,y,width:w,height:h,rx:pill?h/2:8,fill:'transparent','pointer-events':'all',class:pill?'hit pill-hit':'hit'});p.append(r);return action(r,fn,label)}
function foreign(p,x,y,w,h,el){const f=S('foreignObject',{x,y,width:w,height:h,overflow:'visible'});f.append(el);p.append(f);return f}
function labelAt(p,x,y,msg){const t=S('text',{x,y,fill:'#393939','font-family':'Onest, Arial','font-size':22,'text-anchor':'middle'});t.textContent=msg;p.append(t);return t}
const key='pone-cart-v5';let cart={};try{cart=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{};for(const id of Object.keys(cart))if(!P[id]||!Number.isSafeInteger(cart[id])||cart[id]<P[id].min||cart[id]>999)delete cart[id];
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);const total=()=>Object.entries(cart).reduce((a,[id,n])=>a+P[id].price*n,0);
const money=n=>`${n.toLocaleString('ru-RU')} Br`;
function openNow(){const h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Minsk',hour:'2-digit',hourCycle:'h23'}).format(new Date()));return h>=9&&h<23}
function save(){try{localStorage.setItem(key,JSON.stringify(cart))}catch{};for(const t of textAll())if(/^Корзина \(\d+\)$/.test(val(t)))tspan(t).textContent=`Корзина (${count()})`;const mobileBadge=document.querySelector('.m-cart-count');if(mobileBadge)mobileBadge.textContent=String(count());renderCart()}
const toast=H('div',{class:'toast',role:'status','aria-live':'polite'});document.body.append(toast);let timer;function notify(s){toast.textContent=s;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2600)}
function add(id,n){if((cart[id]||0)+n>999){notify('Максимум 999 единиц позиции');return}cart[id]=(cart[id]||0)+n;save();notify(`В корзине: ${P[id].name} × ${n}`)}
// Original SVG cards retain all illustration, type and layout. Controls are real keyboard-accessible targets.
const cards=$$('[data-card]',svg);const qtyById={};
function setQty(id,n){qtyById[id]=Math.max(P[id].min,Math.min(999,n));for(const g of cards.filter(g=>g.dataset.card===id)){const t=$('[data-control="qty"]',g);if(t)tspan(t).textContent=qtyById[id]}document.querySelectorAll('[data-mobile-qty="'+id+'"]').forEach(el=>el.textContent=String(qtyById[id]))}
for(const g of cards){const id=g.dataset.card,p=P[id];if(!p)continue;qtyById[id]=p.min;g.setAttribute('aria-label',p.name);const plus=$('[data-control="plus"]',g),minus=$('[data-control="minus"]',g),addRect=$('[data-control="add"]',g);
 for(const [el,d,l] of [[plus,1,'Увеличить'],[minus,-1,'Уменьшить']])if(el){const [x,y]=xy(el);hit(g,x-10,y-29,37,40,()=>setQty(id,qtyById[id]+d),`${l}: ${p.name}`)}
 if(addRect){const x=+addRect.getAttribute('x'),y=+addRect.getAttribute('y'),w=+addRect.getAttribute('width');hit(g,x,y,w,w,()=>add(id,qtyById[id]),`В корзину: ${p.name}`)}
 if(page==='boxes'&&id==='fish'){hit(g,+g.dataset.x,+g.dataset.y,+g.dataset.w,329,()=>location.href='product.html','Открыть Бокс Праздничный')}
}
// Cart drawer and order submission.
const shade=H('div',{class:'cart-shade',hidden:''});const drawer=H('aside',{class:'cart-drawer',role:'dialog','aria-modal':'true','aria-label':'Корзина'});shade.append(drawer);document.body.append(shade);let cartOpen=false,checkout=false,submitting=false,lastFocus=null;
function closeCart(){cartOpen=false;checkout=false;shade.hidden=true;document.body.classList.remove('cart-open');lastFocus?.focus()}
function showCart(){lastFocus=document.activeElement;cartOpen=true;checkout=false;shade.hidden=false;document.body.classList.add('cart-open');renderCart();$('.cart-close',drawer)?.focus()}
shade.addEventListener('click',e=>{if(e.target===shade)closeCart()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cartOpen)closeCart();if(e.key==='Tab'&&cartOpen){const els=$$('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href]',drawer);if(!els.length)return;if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus()}}});
const button=(s,fn,cls='')=>{const b=H('button',{type:'button',class:cls},s);b.addEventListener('click',fn);return b};
function change(id,d){let n=cart[id]+d;if(n<P[id].min){if(P[id].min===1)delete cart[id];else n=P[id].min;}if(id in cart)cart[id]=Math.min(999,n);save()}
function renderCart(){if(!cartOpen)return;drawer.replaceChildren();const top=H('div',{class:'cart-heading'});top.append(H('h2',{},`Корзина (${count()})`),button('×',closeCart,'cart-close'));drawer.append(top);
 const status=H('p',{class:openNow()?'hours open':'hours closed'},openNow()?'Принимаем заказы до 23:00 (Минск)':'Сейчас заказы не принимаются. Работаем ежедневно 09:00–23:00 по Минску.');drawer.append(status);
 if(!count()){drawer.append(H('p',{class:'empty'},'В корзине пока пусто.'),button('Перейти в меню',()=>location.href='constructor.html','primary'));return}
 const list=H('div',{class:'cart-list'});for(const [id,n] of Object.entries(cart)){const p=P[id],row=H('article',{class:'cart-item'}),im=H('img',{src:p.image,alt:p.name}),body=H('div',{class:'cart-item-body'}),q=H('div',{class:'qty'});body.append(H('strong',{},p.name),H('small',{},`${money(p.price)} / шт. · минимум ${p.min}`));const minus=button('−',()=>change(id,-1));minus.disabled=n<=p.min&&p.min>1;q.append(minus,H('span',{},String(n)),button('+',()=>change(id,1)));body.append(q);const end=H('div',{class:'cart-item-end'});end.append(H('strong',{},money(n*p.price)),button('Удалить',()=>{delete cart[id];save()},'remove'));row.append(im,body,end);list.append(row)}drawer.append(list);
 const sum=H('div',{class:'cart-total'});sum.append(H('span',{},'Итого'),H('strong',{},money(total())));drawer.append(sum);
 if(checkout){const form=makeForm('order',true);drawer.append(form);if(!openNow())$('button[type=submit]',form).disabled=true;}else{const b=button('Оформить заказ',()=>{if(!openNow()){notify('Заказы принимаются с 09:00 до 23:00');return}checkout=true;renderCart()},'primary');b.disabled=!openNow();drawer.append(b)}
}
for(const t of textAll())if(/^Корзина \(\d+\)$/.test(val(t)))tspan(t).textContent=`Корзина (${count()})`;
hit(svg,1208,15,165,43,showCart,'Открыть корзину');setInterval(()=>{if(cartOpen){const status=$('.hours',drawer);if(status){status.className=openNow()?'hours open':'hours closed';status.textContent=openNow()?'Принимаем заказы до 23:00 (Минск)':'Сейчас заказы не принимаются. Работаем ежедневно 09:00–23:00 по Минску.'}const b=$('button[type=submit],.primary',drawer);if(b&&count())b.disabled=submitting||!openNow()}},15000);
window.addEventListener('storage',e=>{if(e.key===key){try{cart=JSON.parse(e.newValue||'{}');save()}catch{}}});
// Filters compact matching original cards into the same 3-column grid.
if(page==='boxes'||page==='constructor'){
 const available=cards.slice().sort((a,b)=>Math.round(+a.dataset.y/10)-Math.round(+b.dataset.y/10)||+a.dataset.x-+b.dataset.x),slots=available.map(g=>[+g.dataset.x,+g.dataset.y]);let tag='Все',kind='Все',query='';
 const empty=labelAt(svg,720,page==='boxes'?550:720,'По этим параметрам ничего не найдено');empty.style.display='none';
 const demoNote=labelAt(svg,720,page==='boxes'?410:605,'Демо: часть категорий назначена временно, состав не подтверждён');demoNote.setAttribute('font-size','12');demoNote.setAttribute('fill','#777');
 const filters=[];function apply(){let i=0;for(const g of available){const p=P[g.dataset.card],ok=(tag==='Все'||tag==='До 3 Br'&&p.price<=3||(p.tags||[p.tag]).includes(tag)||p.demoMetadata&&p.demoTags?.includes(tag))&&(kind==='Все'||p.kind===kind||p.demoMetadata&&p.demoKinds?.includes(kind))&&p.name.toLowerCase().includes(query.toLowerCase().trim());g.style.display=ok?'':'none';if(ok){const [x,y]=slots[i++];g.setAttribute('transform',`translate(${x-g.dataset.x} ${y-g.dataset.y})`)}}
 empty.style.display=i?'none':'';for(const {b,group,value} of filters){const active=(group==='tag'?tag:kind)===value;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))}}
 function filterBar(x,y,w,h,values,group){const div=H('div',{class:'filter-bar'});for(const v of values){const b=button(v,()=>{if(group==='tag')tag=v;else kind=v;apply()});filters.push({b,group,value:v});div.append(b)}foreign(svg,x,y,w,h,div)}
 if(page==='boxes'){filterBar(150,352,776,40,['Все','Веган','Мясное','Рыбное','Детское','Фруктовое','Острое','До 3 Br'],'tag')}
 else{filterBar(292,314,856,40,['Все','Брускетты','Бургеры','Канапе','Бейглы','Нарезка'],'kind');filterBar(292,362,362,40,['Круассаны','Аппетайзеры'],'kind');filterBar(292,436,856,40,['Все','Веган','Мясное','Рыбное','Острое','Сладкое','Детское','Фруктовое','До 3 Br'],'tag');const inp=H('input',{class:'search',type:'search',placeholder:'⌕   Поиск по названию','aria-label':'Поиск по названию'});inp.addEventListener('input',()=>{query=inp.value;apply()});foreign(svg,256,548,928,42,inp)}apply();
}
// Request/checkout forms: success only after local server persistence.
function makeForm(type,order=false){const form=H('form',{class:order?'live-form order-form':'live-form'});form.innerHTML=`<div class="form-fields"><input name="name" placeholder="Ваше имя *" aria-label="Ваше имя" required minlength="2" maxlength="80" autocomplete="name"><input name="email" type="email" placeholder="E-mail" aria-label="E-mail" maxlength="150" autocomplete="email"><input name="phone" type="tel" placeholder="+375 (...) *" aria-label="Телефон" required maxlength="25" autocomplete="tel"><input name="comment" placeholder="Комментарий" aria-label="Комментарий" maxlength="1000"></div><label class="consent"><input type="checkbox" name="agreement" required> <span>Я принимаю пользовательское соглашение</span></label><label class="consent"><input type="checkbox" name="privacy" required> <span>Я согласен на обработку и хранение моих персональных данных</span></label><button type="submit">${order?'Отправить заказ':'Отправить'}</button><p class="form-status" role="status" aria-live="polite"></p>`;
 const phone=$('[name=phone]',form),name=$('[name=name]',form),status=$('.form-status',form),send=$('button[type=submit]',form);const validate=()=>{const digits=phone.value.replace(/\D/g,'');phone.setCustomValidity(digits.length>=9&&digits.length<=15&&/^[+\d\s()\-]+$/.test(phone.value)?'':'Укажите корректный номер телефона (9–15 цифр)');name.setCustomValidity(name.value.trim().length>=2?'':'Введите имя (минимум 2 символа)')};phone.addEventListener('input',validate);name.addEventListener('input',validate);
 form.addEventListener('submit',async e=>{e.preventDefault();validate();if(!form.reportValidity())return;if(order&&!openNow()){status.textContent='Заказы принимаются с 09:00 до 23:00 по Минску.';return}if(send.disabled)return;const data=Object.fromEntries(new FormData(form));data.agreement=data.agreement==='on';data.privacy=data.privacy==='on';if(order)data.items=Object.entries(cart).map(([id,qty])=>({id,qty}));send.disabled=true;submitting=order;status.textContent='Отправляем…';try{if(location.protocol==='file:')throw Error('Для отправки запустите сайт через npm start.');if(location.hostname.endsWith('github.io')){const lines=['Имя: '+data.name,'Телефон: '+data.phone,'E-mail: '+(data.email||'не указан'),'Комментарий: '+(data.comment||'нет')];if(order){lines.push('Заказ:');for(const item of data.items||[]){const product=P[item.id];if(product)lines.push(product.name+' × '+item.qty+' — '+money(product.price*item.qty))}lines.push('Итого: '+money(total()))}window.location.href='mailto:pochta@mail.ru?subject='+encodeURIComponent(order?'Заказ с сайта «Вкусный След»':'Заявка с сайта «Вкусный След»')+'&body='+encodeURIComponent(lines.join('\n'));status.textContent='Открылось письмо для отправки. Проверьте данные и нажмите «Отправить» в почтовом приложении.';send.disabled=false;submitting=false;return}const res=await fetch('/api/'+type,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await res.json();if(!res.ok)throw Error(result.error||'Не удалось отправить');status.textContent=order?'Заказ сохранён!':'Заявка сохранена!' ;form.reset();if(order){cart={};save();checkout=false;renderCart();notify('Заказ сохранён!')}}catch(err){status.textContent=err.message||'Ошибка отправки. Попробуйте снова.'}finally{submitting=false;send.disabled=order&&!openNow()}});return form}
const formPositions={home:[821,5237],boxes:[814,2264],constructor:[820,3731]};if(formPositions[page]){const name=findText('Ваше имя');let [x,y]=formPositions[page];if(name){const [tx,ty]=xy(name);x=tx-35;y=ty-29.82}const form=makeForm('request');form.id='live-request';foreign(svg,x,y,384,325,form)}
// Synchronized slide state and accessible dot controls.
const reduceMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateReveal(el,d=1){if(!reduceMotion()&&el.animate){el.animate([{opacity:.35},{opacity:1}],{duration:320,easing:'ease-out'})}}
function paintDots(dots,idx,photo=false){dots.forEach((d,i)=>{d.setAttribute('fill',i===idx?'#FF5800':photo?'white':'#D9D9D9');d.setAttribute('r',i===idx?(photo?5.8:7.8):(photo?3.6:5.2));d.setAttribute('aria-current',i===idx?'true':'false')})}
function wireRotation(groups,dots,next,prev,label){if(!groups.length)return;const positions=groups.map(g=>Number(g.dataset.slideX??g.dataset.x));let idx=0;const activeDots=dots.slice(0,groups.length);dots.slice(groups.length).forEach(d=>d.style.display='none');function move(target){idx=(target+groups.length)%groups.length;groups.forEach((g,i)=>{const x=positions[(i-idx+groups.length)%groups.length]-positions[i];g.classList.add('carousel-slide');g.style.transform=`translateX(${x}px)`});paintDots(activeDots,idx)}
 hit(svg,...next,61,61,()=>move(idx+1),'Следующие: '+label);hit(svg,...prev,61,61,()=>move(idx-1),'Предыдущие: '+label);activeDots.forEach((d,i)=>action(d,()=>move(i),label+' '+(i+1)));move(0)
}
// FAQ accordion, single open entry. Other answers limited to facts from supplied mockups.
if(page==='home'){
 const faqs=[['Какая сумма минимального заказа?','Минимальной суммы нет. Большинство позиций – от 5 порций, а часть закусок можно заказать от 1 порции: минимум показан в карточке. Точное количество в порции указано в карточке товара.'],['Сколько стоит доставка и где самовывоз?','Самовывоз: ул. Притыцкого 26. Стоимость доставки уточните у менеджера.'],['Как мне узнать состав блюд и КБЖУ?','Состав и характеристики указаны в карточке товара. За уточнениями обращайтесь к менеджеру.'],['Какие есть способы оплаты?','Доступные способы оплаты уточните у менеджера.'],['В каком виде приезжает заказ?','Фудбоксы упакованы в картонные боксы. В макете также указана герметичная эко-упаковка.']];
 $('[data-faq-original]',svg).forEach(e=>e.style.display='none');
 const panel=H('div',{class:'faq-panel'}), faqAnimations=new WeakMap(), faqExpanded=new WeakMap();
 function setFaqExpanded(d,expanded){
  if(faqExpanded.get(d)===expanded)return;
  faqExpanded.set(d,expanded);
  // Use layout heights, not viewport coordinates: the desktop SVG may be scaled.
  const start=d.offsetHeight, previous=faqAnimations.get(d);
  if(previous){previous.onfinish=null;previous.cancel();faqAnimations.delete(d)}
  d.open=expanded;
  const end=d.offsetHeight;
  if(reduceMotion()||typeof d.animate!=='function'||start===end){d.style.removeProperty('overflow');return}
  d.open=true;
  d.style.overflow='hidden';
  const animation=d.animate([{height:start+'px'},{height:end+'px'}],{duration:360,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
  faqAnimations.set(d,animation);
  animation.onfinish=()=>{
   if(faqAnimations.get(d)!==animation)return;
   d.open=expanded;
   animation.cancel();
   faqAnimations.delete(d);
   d.style.removeProperty('overflow');
  };
 }
 faqs.forEach(([q,a],i)=>{
  const d=H('details',i===0?{open:''}:{}), summary=H('summary',{},q);
  faqExpanded.set(d,i===0);
  d.append(summary,H('p',{},a));
  summary.addEventListener('click',event=>{
   event.preventDefault();
   const expanded=!faqExpanded.get(d);
   if(expanded)$('details',panel).filter(x=>x!==d).forEach(x=>setFaqExpanded(x,false));
   setFaqExpanded(d,expanded);
  });
  panel.append(d);
 });
 foreign(svg,804,7881,485,580,panel);
 // Group the four original benefit cards, keeping all vector elements.
 const advantages=$('#Advantages',svg);
 if(advantages){let group=null;for(const el of [...advantages.children]){if(el.tagName.toLowerCase()==='g'&&el.querySelector('rect')){group=S('g',{class:'benefit-card'});advantages.insertBefore(group,el);el.querySelector('rect').classList.add('benefit-bg')}if(group)group.append(el)}for(const card of [...advantages.children].filter(e=>e.classList.contains('benefit-card'))){const bg=card.querySelector('.benefit-bg'),outer=S('g',{class:'benefit-hover-zone'});advantages.insertBefore(outer,card);outer.append(card);const area=S('rect',{x:bg.getAttribute('x'),y:bg.getAttribute('y'),width:bg.getAttribute('width'),height:bg.getAttribute('height'),rx:bg.getAttribute('rx'),fill:'transparent','pointer-events':'all'});outer.insertBefore(area,card)}}
 // Home constructor: category selection uses the same catalog metadata as the full menu.
 const menu=$('#MenuConstructor',svg), menuCards=cards.filter(g=>g.dataset.kind==='Брускетты').sort((a,b)=>+a.dataset.y-+b.dataset.y||+a.dataset.x-+b.dataset.x);
 if(menu&&menuCards.length){const kinds=['Брускетты','Бургеры','Канапе','Бейглы','Нарезка','Аппетайзеры','Круассаны'];const slots=menuCards.map(g=>[+g.dataset.x,+g.dataset.y]);const original=$$('text',menu).filter(t=>kinds.includes(val(t))&&xy(t)[0]<350);original.forEach(t=>t.style.display='none');const originalPill=$$('rect',menu).find(r=>+r.getAttribute('x')===131&&+r.getAttribute('y')===4000);if(originalPill)originalPill.style.display='none';
 const side=H('div',{class:'home-menu-tabs'}),tabs=[];const empty=labelAt(menu,870,4150,'Позиции пока отсутствуют');empty.style.display='none';
 function selectKind(kind){let i=0;for(const g of menuCards){const p=P[g.dataset.card];const ok=p.kind===kind||p.demoMetadata&&(p.demoKinds||[]).includes(kind);g.style.display=ok?'':'none';if(ok){const [x,y]=slots[i++];g.setAttribute('transform',`translate(${x-g.dataset.x} ${y-g.dataset.y})`);animateReveal(g)}}empty.style.display=i?'none':'';tabs.forEach(([v,b])=>{b.classList.toggle('selected',v===kind);b.setAttribute('aria-pressed',String(v===kind))})}
 for(const v of kinds){const b=button(v,()=>selectKind(v));tabs.push([v,b]);side.append(b)}foreign(menu,131,3998,200,266,side);selectKind('Брускетты');hit(svg,131,4318,200,48,()=>location.href='constructor.html','Все позиции');}
 hit(svg,785,451,285,64,()=>location.href='boxes.html','Смотреть готовые');
 const reviews=$$('[data-slide=reviews]',svg);wireRotation(reviews,$$('#Reviews > circle',svg),[1303,7476],[60,7476],'Отзывы');
 const boxes=cards.filter(g=>g.dataset.kind==='Фудбоксы').sort((a,b)=>+a.dataset.x-+b.dataset.x);wireRotation(boxes,$$('#ReadyBoxesPagination circle',svg),[1310,3048],[63,3048],'Готовые наборы');
 const gallery=$$('[data-gallery]',svg), fills=gallery.map(g=>g.getAttribute('fill'));let gi=0;
 if(gallery.length){const gal=d=>{gi=(gi+d+gallery.length)%gallery.length;gallery.forEach((g,i)=>{g.setAttribute('fill',fills[(i+gi)%gallery.length]);animateReveal(g,d)})};hit(svg,1318,6084,61,61,()=>gal(1),'Следующая фотография');hit(svg,75,6084,61,61,()=>gal(-1),'Предыдущая фотография');}
 // link all main CTAs
 hit(svg,585,1648,305,50,()=>location.href='constructor.html','Собрать свой бокс');hit(svg,971,1648,305,50,()=>$('#live-request')?.scrollIntoView({behavior:'smooth',block:'center'}),'Оставить заявку');hit(svg,229,8165,347,64,()=>location.href='tel:+375441234567','Связаться с нами');
}
if(page==='product'){const rec=cards.filter(g=>g.dataset.card!=='festive').sort((a,b)=>+a.dataset.x-+b.dataset.x);wireRotation(rec,[],[1336,1159],[89,1159],'Рекомендации')}
// Photo pagination: only one real photograph per product is supplied. Show different crops of that same image, never another dish.
for(const [index,g] of cards.entries()){const dots=$$('circle',g).filter(d=>+d.getAttribute('r')<9);if(dots.length<2)continue;const picture=$$('rect',g).find(r=>r.getAttribute('fill')==='url(#'+g.dataset.pattern+')');const original=svg.querySelector('#'+g.dataset.pattern);if(!picture||!original)continue;const pattern=original.cloneNode(true);pattern.id='photo-view-'+index;svg.querySelector('defs').append(pattern);picture.setAttribute('fill','url(#'+pattern.id+')');const use=pattern.querySelector('use');if(!use)continue;const base=use.getAttribute('transform')||'';let current=0;const views=['','translate(-.10 -.10) scale(1.2) ','translate(-.26 -.08) scale(1.3) ','translate(-.08 -.26) scale(1.3) '];function show(i){current=(i+dots.length)%dots.length;use.setAttribute('transform',(views[current%views.length]||'')+base);animateReveal(picture);paintDots(dots,current,true)}
 dots.forEach((d,i)=>{const x=+d.getAttribute('cx'),y=+d.getAttribute('cy');hit(g,x-7,y-10,14,20,()=>show(i),'Вид фото '+(i+1))});
 const arrows=$$('text',g).filter(t=>['>','<'].includes(val(t)));for(const t of arrows){const b=t.getBBox(),left=Boolean(t.getAttribute('transform'))||val(t)==='<';let x=b.x,y=b.y;if(t.getAttribute('transform')){const m=t.transform.baseVal.consolidate()?.matrix;if(m){x=m.e-b.x-b.width;y=m.f+b.y}}hit(g,x-10,y-9,Math.max(42,b.width+20),Math.max(42,b.height+18),()=>show(current+(left?-1:1)),left?'Предыдущий вид фото':'Следующий вид фото')}
 if(arrows.length===1){const x=+picture.getAttribute('x'),y=+picture.getAttribute('y')+ +picture.getAttribute('height')/2;const back=S('g');back.append(S('circle',{cx:x+32,cy:y,r:21,fill:'white',opacity:.65}));const t=S('text',{x:x+32,y:y+8,'text-anchor':'middle',fill:'#393939','font-size':24});t.textContent='‹';back.append(t);g.append(back);hit(g,x+11,y-21,42,42,()=>show(current-1),'Предыдущий вид фото')}paintDots(dots,0,true)
}
// Header/footer actions and anchors, without inventing missing pages.
hit(svg,54,8,165,54,()=>location.href='preview.html','На главную');hit(svg,250,8,90,55,()=>location.href='constructor.html','Меню');hit(svg,350,8,153,55,()=>location.href='boxes.html','Готовые наборы');hit(svg,972,15,217,43,()=>location.href='tel:+375441234567','Позвонить нам');
if(page==='constructor')hit(svg,170,125,205,45,()=>location.href='preview.html','На главную');
if(page==='home'){for(const g of ['Partners','Gallery','Reviews','FAQ']){const el=svg.querySelector('#'+g);if(el)el.setAttribute('tabindex','-1')}}
for(const t of textAll()){const v=val(t),[x,y]=xy(t);if(!Number.isFinite(x)||!Number.isFinite(y))continue;let target=null;if(['Парнерам','Партнерам'].includes(v))target='Partners';else if(v==='Отзывы'&&y>8000||v==='Отзывы'&&page!=='home')target='Reviews';else if(v==='Галерея'&&y>8000||v==='Галерея'&&page!=='home')target='Gallery';else if(v==='Вопрос-ответ')target='FAQ';if(target)hit(svg,x-4,y-22,170,30,()=>{if(page==='home')svg.querySelector('#'+target)?.scrollIntoView({behavior:'smooth'});else location.href='preview.html#'+target},v)}
if(location.hash&&page==='home')requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());


// Product details modal used by desktop SVG cards and the mobile catalog.
const productModalShade=H('div',{class:'product-modal-backdrop',hidden:''});
document.body.append(productModalShade);
let productModalQty=1,productModalId=null,productModalReturnFocus=null;
function closeProductModal(){
 if(productModalShade.hidden)return;
 productModalShade.hidden=true;
 document.body.classList.remove('product-modal-open');
 productModalReturnFocus?.focus?.();
}
productModalShade.addEventListener('click',e=>{if(e.target===productModalShade)closeProductModal()});
function showProductModal(id){
 const p=P[id];if(!p)return;
 productModalId=id;productModalQty=p.min||1;productModalReturnFocus=document.activeElement;
 const card=cards.find(g=>g.dataset.card===id);
 const texts=card?$$('text',card).map(t=>t.textContent.replace(/\s+/g,' ').trim()).filter(Boolean):[];
 const weight=texts.find(t=>/^\d+(?:[.,]\d+)?\s*г$/i.test(t))||'';
 let composition=texts.find(t=>t.startsWith('Багет,'))||'';
 let nutrition='';
 if(id==='pork'){
  composition='Багет, томаты, свинина, укроп, соус-барбекю, крем-соус, лук-порей, шпинат, соль, перец, чеснок';
  nutrition='КБЖУ: 12/14/16 на 100г';
 }
 const dialog=H('section',{class:'product-modal',role:'dialog','aria-modal':'true','aria-labelledby':'product-modal-title'});
 const photo=H('div',{class:'product-modal-photo'});
 const image=H('img',{src:p.image,alt:p.name,loading:'eager'});
 photo.append(image);
 const info=H('div',{class:'product-modal-info'});
 const heading=H('div',{class:'product-modal-heading'});
 heading.append(H('h2',{id:'product-modal-title'},p.name));
 if(weight)heading.append(H('span',{class:'product-modal-weight'},weight));
 info.append(heading);
 if(nutrition)info.append(H('p',{class:'product-modal-nutrition'},nutrition));
 const ingredients=H('div',{class:'product-modal-ingredients'});
 ingredients.append(H('h3',{},'Состав:'));
 ingredients.append(H('p',{},composition||'Состав уточняйте у менеджера.'));
 info.append(ingredients);
 const controls=H('div',{class:'product-modal-controls'});
 const price=H('strong',{class:'product-modal-price'},money(p.price));
 const minus=H('button',{type:'button',class:'product-modal-step','aria-label':'Уменьшить количество'},'−');
 const qty=H('output',{class:'product-modal-qty','aria-live':'polite'},String(productModalQty));
 const plus=H('button',{type:'button',class:'product-modal-step','aria-label':'Увеличить количество'},'+');
 const cartButton=H('button',{type:'button',class:'product-modal-add','aria-label':'Добавить в корзину'});
 const icon=S('svg',{viewBox:'0 0 24 24',width:25,height:25,fill:'none',stroke:'currentColor','stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'});
 icon.append(S('path',{d:'M3 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6'}),S('circle',{cx:10,cy:20,r:1}),S('circle',{cx:18,cy:20,r:1}));
 cartButton.append(icon);
 function updateQty(){qty.textContent=String(productModalQty);minus.disabled=productModalQty<=(p.min||1);plus.disabled=productModalQty>=999}
 minus.addEventListener('click',()=>{productModalQty=Math.max(p.min||1,productModalQty-1);updateQty()});
 plus.addEventListener('click',()=>{productModalQty=Math.min(999,productModalQty+1);updateQty()});
 cartButton.addEventListener('click',()=>add(productModalId,productModalQty));
 controls.append(price,minus,qty,plus,cartButton);info.append(controls);
 dialog.append(photo,info);
 productModalShade.replaceChildren(dialog);
 productModalShade.hidden=false;
 document.body.classList.add('product-modal-open');
 updateQty();
 requestAnimationFrame(()=>cartButton.focus());
}
document.addEventListener('keydown',e=>{if(!productModalShade.hidden&&e.key==='Escape')closeProductModal()});
if(page==='constructor'){
 // Capture product-card clicks before SVG child hit areas can swallow them.
 svg.addEventListener('click',e=>{
  const target=e.target,card=target.closest?.('[data-card]');if(!card||!P[card.dataset.card])return;
  if(target.closest?.('[data-control]'))return;
  const hit=target.closest?.('.hit');
  if(hit&&/^(Увеличить|Уменьшить|В корзину)/.test(hit.getAttribute('aria-label')||''))return;
  e.preventDefault();e.stopPropagation();showProductModal(card.dataset.card);
 },true);
 for(const g of cards){
  const id=g.dataset.card;if(!P[id])continue;
  g.style.cursor='pointer';g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label','Подробнее: '+P[id].name);
  g.addEventListener('click',e=>{if(e.target.closest?.('.hit')||e.target.closest?.('[data-control]'))return;showProductModal(id)});
  g.addEventListener('keydown',e=>{if(e.target===g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showProductModal(id)}});
 }
}

window.PONE_UI={count,add,change,showCart,showProductModal,makeForm,openNow};
})();
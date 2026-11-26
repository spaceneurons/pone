(()=>{'use strict';
const svg=document.querySelector('svg[data-page]'),P=window.PONE_PRODUCTS,UI=window.PONE_UI;
if(!svg||!P||!UI)return;
const page=svg.dataset.page;
const root=document.createElement('div');root.className='mobile-site';root.setAttribute('aria-label','Мобильная версия сайта');
const $=(s,p=root)=>p.querySelector(s),$$=(s,p=root)=>[...p.querySelectorAll(s)];
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const btn=(txt,fn,cls)=>{const b=el('button',cls||'',txt);b.type='button';b.addEventListener('click',fn);return b};
const money=n=>Number(n).toLocaleString('ru-RU')+' Br';
const all=Object.entries(P).map(([id,p])=>({id,...p}));
const foods=all.filter(p=>p.kind!=='Фудбоксы'),boxes=all.filter(p=>p.kind==='Фудбоксы');
const kinds=['Все','Брускетты','Бургеры','Канапе','Бейглы','Нарезка','Аппетайзеры','Круассаны'];
const tags=['Все','Мясное','Рыбное','Веган','Острое','Фруктовое','Детское','Сладкое'];
let cartMenu=false,activeKind='Все',activeTag='Все',query='',sort='default',slideIndexes={};
const makeHeader=()=>{
 const h=el('header','m-header'),brand=el('a','m-brand','Вкусный След');brand.href='index.html';
 const right=el('div','m-header-actions'),cart=btn('▢','', 'm-cart');cart.setAttribute('aria-label','Открыть корзину');cart.innerHTML='<span class="m-cart-icon">🛒</span><b class="m-cart-count">'+UI.count()+'</b>';cart.addEventListener('click',()=>UI.showCart());
 const burger=btn('☰',()=>{cartMenu=!cartMenu;const nav=$('.m-nav');nav.hidden=!cartMenu;burger.setAttribute('aria-expanded',String(cartMenu))},'m-burger');burger.setAttribute('aria-label','Открыть меню');burger.setAttribute('aria-expanded','false');
 right.append(cart,burger);h.append(brand,right);
 const nav=el('nav','m-nav');nav.hidden=true;
 [['Меню','constructor.html'],['Готовые наборы','boxes.html'],['Партнерам','#partners'],['Доставка и оплата','#faq'],['Кафе','#contacts']].forEach(([t,u])=>{const a=el('a','',t);a.href=u;nav.append(a)});
 root.append(h,nav);
};
const makeFooter=()=>{
 const f=el('footer','m-footer'),logo=el('a','m-footer-brand','Вкусный След');logo.href='index.html';
 const contact=el('section','m-footer-col');contact.id='contacts';contact.append(el('h3','','Контакты'),el('a','','☎  +375 (44) 12-34-567'),el('a','','✉  pochta@mail.ru'),el('p','','⌖  Самовывоз: ул. Притыцкого 26'),el('p','','Прием заказов с 09:00 до 23:00\\nБез выходных'));
 const legal=el('small','m-legal','ООО «Вкусный след»\\nУНП 193870879, 220021, Республика Беларусь, г. Минск, переулок Бехтерева, д. 10/2\\n© 2026 ООО «Вкусный след»');
 f.append(logo,contact,legal);root.append(f);
};
const section=(title,sub)=>{const s=el('section','m-section');if(title)s.append(el('h2','m-section-title',title));if(sub)s.append(el('p','m-section-sub',sub));return s};
const card=(p,mode='food')=>{
 const c=el('article','m-card'),im=el('img','m-card-image');im.src=p.image;im.alt=p.name;im.loading='lazy';im.decoding='async';
 const body=el('div','m-card-body');
 if(p.tag)body.append(el('span','m-tag',p.tag));
 body.append(el('h3','m-card-name',p.name),el('p','m-card-meta',(p.min>1?'От '+p.min+' шт.':'От 1 шт.')+' · '+money(p.price)));
 const controls=el('div','m-card-controls'),q=el('span','m-qty',''+p.min);
 const minus=btn('−',()=>{let n=Number(q.textContent);q.textContent=String(Math.max(p.min,n-1))},'m-qty-btn');
 const plus=btn('+',()=>{let n=Number(q.textContent);q.textContent=String(Math.min(999,n+1))},'m-qty-btn');
 const add=btn('В корзину',()=>UI.add(p.id,Number(q.textContent)),'m-add');
 controls.append(minus,q,plus,add);body.append(controls);c.append(im,body);
 if(mode==='box'&&p.id==='fish'){c.classList.add('m-card-link');c.addEventListener('click',e=>{if(!e.target.closest('button'))location.href='product.html'})}
 return c;
};
const grid=(items,mode)=>{const g=el('div','m-grid');items.forEach(p=>g.append(card(p,mode)));return g};
const filtered=()=>{
 let items=(page==='boxes'?boxes:foods).filter(p=>{
  const kindsFor=[p.kind,...(p.demoKinds||[])];
  const tagFor=[p.tag,...(p.tags||[]),...(p.demoTags||[])];
  return (activeKind==='Все'||kindsFor.includes(activeKind))&&(activeTag==='Все'||tagFor.includes(activeTag)||activeTag==='До 3 Br'&&p.price<=3)&&(p.name||'').toLowerCase().includes(query.toLowerCase().trim());
 });
 if(activeTag==='До 3 Br')items=items.filter(p=>p.price<=3);
 if(sort==='cheap')items.sort((a,b)=>a.price-b.price);if(sort==='expensive')items.sort((a,b)=>b.price-a.price);if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
 return items;
};
const chips=(items,active,fn)=>{const wrap=el('div','m-chips');items.forEach(v=>{const b=btn(v,()=>fn(v),v===active?'m-chip active':'m-chip');b.setAttribute('aria-pressed',String(v===active));wrap.append(b)});return wrap};
const catalogControls=(withKinds)=>{
 const box=el('div','m-catalog-controls');
 if(withKinds)box.append(chips(kinds,activeKind,v=>{activeKind=v;refresh()}));
 const sortRow=el('div','m-sort-row'),sel=el('select','m-select');[['default','Сортировка: по умолчанию'],['cheap','Сначала дешевле'],['expensive','Сначала дороже'],['name','По названию']].forEach(([v,t])=>{const o=el('option','',t);o.value=v;sel.append(o)});sel.value=sort;sel.addEventListener('change',()=>{sort=sel.value;refresh()});sortRow.append(sel);
 const tag=el('select','m-select');tags.concat(['До 3 Br']).forEach(v=>{const o=el('option','',v==='Все'?'Все типы':v);o.value=v;tag.append(o)});tag.value=activeTag;tag.addEventListener('change',()=>{activeTag=tag.value;refresh()});
 sortRow.append(tag);box.append(sortRow);
 const search=el('input','m-search');search.type='search';search.placeholder='⌕  Поиск по названию';search.value=query;search.addEventListener('input',()=>{query=search.value;refresh()});box.append(search);
 return box;
};
let listNode=null,emptyNode=null;
function refresh(){if(!listNode)return;const items=filtered();listNode.replaceChildren();items.forEach(p=>listNode.append(card(p,page==='boxes'?'box':'food')));if(emptyNode)emptyNode.hidden=items.length>0}
const makeBack=()=>{const a=el('a','m-back','←  Назад');a.href='index.html';root.append(a)};
const makeFormSection=()=>{
 const s=el('section','m-request-section');s.append(el('h2','','Оставить заявку'),el('p','','Наш менеджер свяжется с вами и поможет с оформлением и подбором заказа в самое ближайшее время.'));
 const f=UI.makeForm('request');f.classList.add('m-request-form');s.append(f);return s;
};
const makeProductSection=(p)=>{const c=el('article','m-product-card'),im=el('img','m-product-image');im.src=p.image;im.alt=p.name;im.loading='eager';c.append(im);const info=el('div','m-product-info');info.append(el('div','m-product-heading',p.name),el('p','m-product-price',money(p.price)),el('p','','Вес: 720 г\\nВес упаковки: 750 г\\nУпаковка: картонный бокс\\nПорция: 35 шт.'),el('h3','','Состав:'));
 const composition=el('ul','m-composition');['Канапе с ветчиной и мягким сыром','Тартин с фуа-гра и вишнёвым компоте','Боссче с лососем','Боссче с цыплёнком карри','Канапе с вяленым черри и салями'].forEach(t=>composition.append(el('li','',t)));info.append(composition);
 const row=el('div','m-product-buy'),q=el('span','','1'),minus=btn('−',()=>q.textContent=String(Math.max(1,Number(q.textContent)-1)),'m-qty-btn'),plus=btn('+',()=>q.textContent=String(Math.min(999,Number(q.textContent)+1)),'m-qty-btn'),add=btn('В корзину',()=>UI.add(p.id,Number(q.textContent)),'m-add');row.append(el('span','','200 Br'),minus,q,plus,add);info.append(row);c.append(info);return c};
function makeSlider(title,items){const s=section(title),outer=el('div','m-slider');const track=el('div','m-slider-track');items.forEach(p=>track.append(card(p,'box')));outer.append(track);const controls=el('div','m-slider-controls'),prev=btn('‹',()=>track.scrollBy({left:-track.clientWidth*.85,behavior:'smooth'}),'m-arrow'),next=btn('›',()=>track.scrollBy({left:track.clientWidth*.85,behavior:'smooth'}),'m-arrow'),dots=el('div','m-dots');items.forEach((p,i)=>{const d=btn(' ',()=>track.children[i]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}),'m-dot');if(i===0)d.classList.add('active');dots.append(d)});track.addEventListener('scroll',()=>{const idx=Math.round(track.scrollLeft/Math.max(1,track.children[0]?.offsetWidth+12));$$('.m-dot',dots).forEach((d,i)=>d.classList.toggle('active',i===idx))},{passive:true});controls.append(prev,dots,next);s.append(outer,controls);return s}
makeHeader();
if(page!=='home')makeBack();
if(page==='home'){
 const hero=section();hero.classList.add('m-hero');hero.append(el('p','m-eyebrow','ФУДБОКСЫ • КОРПОРАТИВЫ • ФУРШЕТЫ'),el('h1','','ВКУСНЫЙ СЛЕД'),el('p','','Готовые фудбоксы и закуски для ваших событий'));const actions=el('div','m-hero-actions');actions.append(btn('Собрать фудбокс',()=>location.href='constructor.html','m-primary'),btn('Смотреть готовые',()=>location.href='boxes.html','m-secondary'));hero.append(actions);root.append(hero);
 const benefits=section('Свежие продукты, меню под вас','Всё для вкусного события');benefits.classList.add('m-benefits');[['Свежие продукты','Отбираем качественные ингредиенты'],['Меню под вас','Подберём набор под ваш повод'],['Срочные заказы','Поможем организовать быстро'],['Фикс-стоимость','Понятная цена до оформления']].forEach(([t,d])=>{const b=el('article','m-benefit');b.append(el('span','','✦'),el('h3','',t),el('p','',d));benefits.append(b)});root.append(benefits);
 root.append(makeSlider('Готовые наборы',boxes));
 const menu=section('Меню-конструктор','На нашли подходящий фудбокс? Соберите самостоятельно!');menu.append(grid(foods.slice(0,4),'food'),btn('Все позиции',()=>location.href='constructor.html','m-primary m-full'));root.append(menu);
 root.append(makeFormSection());
 const gallery=section('Галерея','Идеи для вашего события');const gal=el('div','m-gallery');[...boxes,...foods].slice(0,8).forEach(p=>{const im=el('img','');im.src=p.image;im.alt=p.name;im.loading='lazy';gal.append(im)});gallery.append(gal);root.append(gallery);
 const partner=section('Партнерам','Помогаем организовать фуршеты и корпоративные мероприятия.');partner.id='partners';partner.append(btn('Оставить заявку',()=>$('.m-request-section')?.scrollIntoView({behavior:'smooth'}),'m-primary'));root.append(partner);
 const reviews=section('Отзывы','');const reviewTrack=el('div','m-review-track');['Всё очень вкусно, красиво оформлено и доставлено вовремя!','Отличный выбор закусок для мероприятия.','Спасибо за оперативную работу и качество!'].forEach((t,i)=>{const r=el('article','m-review',t);r.append(el('b','','★★★★★'));reviewTrack.append(r)});reviews.append(reviewTrack);root.append(reviews);
 const faq=section('Часто задаваемые вопросы','');const qa=[['Какая сумма минимального заказа?','Минимальной суммы нет. Большинство позиций – от 5 порций, а часть закусок можно заказать от 1 порции: минимум показан в карточке. Точное количество в порции указано в карточке товара.'],['Сколько стоит доставка и где самовывоз?','Самовывоз: ул. Притыцкого 26. Стоимость доставки уточните у менеджера.'],['Как мне узнать состав блюд и КБЖУ?','Состав и характеристики указаны в карточке товара.'],['Какие есть способы оплаты?','Доступные способы оплаты уточните у менеджера.'],['В каком виде приезжает заказ?','Фудбоксы упакованы в картонные боксы.']];const panel=el('div','m-faq');qa.forEach(([q,a],i)=>{const d=el('details','m-faq-item');if(i===0)d.open=true;d.append(el('summary','',q),el('p','',a));d.addEventListener('toggle',()=>{if(d.open)$$('details',panel).forEach(x=>{if(x!==d)x.open=false})});panel.append(d)});faq.append(panel);root.append(faq);
}else if(page==='boxes'||page==='constructor'){
 const title=section(page==='boxes'?'Готовые фудбоксы':'Меню-конструктор',page==='boxes'?'Ничего не нужно придумывать: в боксе уже всё есть.':'На нашли подходящий фудбокс? Соберите самостоятельно!');title.classList.add('m-page-title');root.append(title);
 const controls=catalogControls(page==='constructor');root.append(controls);
 listNode=el('div','m-grid m-catalog-grid');emptyNode=el('p','m-empty','По этим параметрам ничего не найдено');emptyNode.hidden=true;root.append(listNode,emptyNode);refresh();
 if(page==='constructor'){const jump=el('div','m-jump');jump.append(btn('↑  Начало меню',()=>window.scrollTo({top:0,behavior:'smooth'}),'m-jump-btn'),btn('↓  Конец меню',()=>window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}),'m-jump-btn'));root.append(jump)}
 root.append(makeFormSection());
}else if(page==='product'){
 const p=P.festive||boxes.find(x=>x.id==='fish');const title=section();title.append(el('h1','','Бокс Праздничный'));root.append(title,makeProductSection(p),makeSlider('С этим товаром также покупают',boxes.filter(x=>x.id!==p.id).slice(0,6)));
}
makeFooter();document.querySelector('.page')?.append(root);
const mq=window.matchMedia('(max-width: 760px)');
function sync(){root.classList.toggle('m-active',mq.matches);document.body.classList.toggle('mobile-mode',mq.matches)}
sync();mq.addEventListener?.('change',sync);
})();
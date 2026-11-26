(() => {
  'use strict';
  const svg = document.querySelector('svg[data-page="product"]');
  const products = window.PONE_PRODUCTS;
  if (!svg || !products) return;

  const requestedId = new URLSearchParams(window.location.search).get('id') || 'festive';
  const selectedId = products[requestedId] && products[requestedId].kind === 'Фудбоксы'
    ? requestedId
    : 'festive';
  const product = products[selectedId];
  if (!product) return;

  const card = svg.querySelector('g[data-card="festive"]') || svg.querySelector('g[data-card]');
  if (!card) return;

  card.dataset.card = selectedId;
  card.dataset.tag = product.tag || '';
  card.setAttribute('aria-label', product.name);

  const texts = Array.from(card.querySelectorAll('text'));
  const setText = (node, value) => {
    if (!node) return;
    const span = node.querySelector('tspan');
    if (span) span.textContent = value;
    else node.textContent = value;
  };

  const title = texts.find(node => node.textContent.includes('Бокс Праздничный'));
  const price = texts.find(node => node.textContent.includes('200 Br'));
  const quantity = card.querySelector('[data-control="qty"]');
  setText(title, product.name);
  setText(price, Number(product.price).toLocaleString('ru-RU') + ' Br');
  setText(quantity, String(product.min || 1));

  if (selectedId !== 'festive') {
    const weight = texts.find(node => /^\\s*850\\s*г\\s*$/.test(node.textContent));
    const specifications = texts.find(node =>
      node.textContent.includes('Вес:') && node.textContent.includes('Упаковка:')
    );
    const nutrition = texts.find(node => node.textContent.includes('КБЖУ:'));
    const composition = texts.find(node => node.textContent.includes('Канапе с ветчиной'));
    if (weight) weight.style.display = 'none';
    if (specifications) specifications.style.display = 'none';
    if (nutrition) nutrition.style.display = 'none';
    if (composition) {
      const first = composition.querySelector('tspan');
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      line.setAttribute('x', first?.getAttribute('x') || '859');
      line.setAttribute('y', first?.getAttribute('y') || '628.32');
      line.textContent = 'Состав уточняйте у менеджера';
      composition.replaceChildren(line);
    }
  }

  const photo = svg.querySelector('#image0_238_949');
  if (photo && product.image) {
    photo.dataset.src = product.image;
    photo.removeAttribute('href');
    photo.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
  }

  document.title = 'Вкусный След — ' + product.name;
})();

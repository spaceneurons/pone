(() => {
  'use strict';
  const svg = document.querySelector('svg.design[data-page]');
  const products = window.PONE_PRODUCTS || {};
  if (!svg) return;

  const page = svg.dataset.page;
  const isControl = target => {
    if (!target || !target.closest) return false;
    if (target.closest('[data-control]')) return true;
    const hit = target.closest('.hit');
    return /^(Увеличить|Уменьшить|В корзину)/.test(hit?.getAttribute('aria-label') || '');
  };
  const cardFrom = (target, selector) => {
    if (!target || !target.closest) return null;
    const card = target.closest(selector);
    return card && svg.contains(card) ? card : null;
  };
  const setCardAccess = (card, role, label) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', role);
    card.setAttribute('aria-label', label);
    card.style.cursor = 'pointer';
  };
  const goToProduct = id => {
    if (!products[id] || products[id].kind !== 'Фудбоксы') return;
    window.location.href = 'product.html?id=' + encodeURIComponent(id);
  };
  const openFoodModal = id => {
    if (products[id] && window.PONE_UI && typeof window.PONE_UI.showProductModal === 'function') {
      window.PONE_UI.showProductModal(id);
    }
  };

  if (page === 'boxes') {
    svg.querySelectorAll('a[aria-label="Открыть карточку фудбокса"]').forEach(link => link.remove());
    svg.querySelectorAll('[data-card]').forEach(card => {
      const id = card.getAttribute('data-card');
      if (!products[id] || products[id].kind !== 'Фудбоксы') return;
      setCardAccess(card, 'link', 'Открыть ' + products[id].name);
      card.addEventListener('keydown', event => {
        if (event.target === card && event.key === 'Enter') {
          event.preventDefault();
          goToProduct(id);
        }
      });
    });
    document.addEventListener('click', event => {
      const card = cardFrom(event.target, 'svg[data-page="boxes"] [data-card]');
      if (!card || isControl(event.target)) return;
      const id = card.getAttribute('data-card');
      if (!products[id] || products[id].kind !== 'Фудбоксы') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      goToProduct(id);
    }, true);
  }

  // Ready boxes on the home page also open their own matching detail page.
  if (page === 'home') {
    const readySelector = 'svg[data-page="home"] #ReadyBoxes [data-card]';
    svg.querySelectorAll(readySelector).forEach(card => {
      const id = card.getAttribute('data-card');
      if (!products[id] || products[id].kind !== 'Фудбоксы') return;
      setCardAccess(card, 'link', 'Открыть ' + products[id].name);
      card.addEventListener('keydown', event => {
        if (event.target === card && event.key === 'Enter') {
          event.preventDefault();
          goToProduct(id);
        }
      });
    });
    document.addEventListener('click', event => {
      const card = cardFrom(event.target, readySelector);
      if (!card || isControl(event.target)) return;
      const id = card.getAttribute('data-card');
      if (!products[id] || products[id].kind !== 'Фудбоксы') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      goToProduct(id);
    }, true);
  }

  const modalSelector = page === 'constructor'
    ? 'svg[data-page="constructor"] [data-card]'
    : page === 'home'
      ? 'svg[data-page="home"] #MenuConstructor [data-card]'
      : null;

  if (modalSelector) {
    svg.querySelectorAll(modalSelector).forEach(card => {
      const id = card.getAttribute('data-card');
      if (!products[id] || products[id].kind === 'Фудбоксы') return;
      setCardAccess(card, 'button', 'Подробнее: ' + products[id].name);
      if (page === 'home') {
        card.addEventListener('keydown', event => {
          if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openFoodModal(id);
          }
        });
      }
    });
    document.addEventListener('click', event => {
      const card = cardFrom(event.target, modalSelector);
      if (!card || isControl(event.target)) return;
      const id = card.getAttribute('data-card');
      if (!products[id] || products[id].kind === 'Фудбоксы') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openFoodModal(id);
    }, true);
  }

  if (page === 'home') {
    const mobileMenu = Array.from(document.querySelectorAll('.mobile-site .m-section'))
      .find(section => section.querySelector('.m-section-title')?.textContent.includes('Меню-конструктор'));
    if (mobileMenu) {
      mobileMenu.querySelectorAll('.m-card[data-product]').forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Подробнее: ' + card.dataset.product);
      });
    }
  }

  if (!document.querySelector('.sticky-desktop-header')) {
    const source = svg.querySelector('#Header, [data-section="Header"], [data-section="CatalogHeader"]');
    if (source) {
      const NS = 'http://www.w3.org/2000/svg';
      const shell = document.createElement('div');
      shell.className = 'sticky-desktop-header';
      shell.setAttribute('aria-label', 'Закреплённая навигация');

      const fixedSvg = document.createElementNS(NS, 'svg');
      fixedSvg.setAttribute('viewBox', '0 0 1440 74');
      fixedSvg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
      fixedSvg.setAttribute('role', 'group');
      fixedSvg.setAttribute('aria-label', 'Навигация сайта');

      const clone = source.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-section');
      clone.classList.remove('site-scroll-reveal', 'is-visible');
      clone.style.removeProperty('opacity');
      clone.style.removeProperty('translate');
      clone.style.removeProperty('--scroll-delay');
      clone.querySelectorAll('.site-scroll-reveal, .is-visible').forEach(node => {
        node.classList.remove('site-scroll-reveal', 'is-visible');
        node.style.removeProperty('opacity');
        node.style.removeProperty('translate');
        node.style.removeProperty('--scroll-delay');
      });
      clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      clone.querySelectorAll('a').forEach(node => node.remove());
      fixedSvg.append(clone);

      const addLink = (x, y, width, height, href, label) => {
        const anchor = document.createElementNS(NS, 'a');
        anchor.setAttribute('href', href);
        anchor.setAttribute('aria-label', label);
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', 'transparent');
        rect.setAttribute('pointer-events', 'all');
        anchor.append(rect);
        fixedSvg.append(anchor);
      };

      addLink(54, 8, 165, 54, 'index.html', 'На главную');
      addLink(250, 8, 90, 55, 'constructor.html', 'Меню');
      addLink(350, 8, 153, 55, 'boxes.html', 'Готовые наборы');
      addLink(520, 8, 140, 55, 'index.html#Partners', 'Партнёрам');
      addLink(660, 8, 190, 55, 'index.html#FAQ', 'Доставка и оплата');
      addLink(850, 8, 105, 55, 'index.html#Gallery', 'Кафе');
      addLink(972, 15, 217, 43, 'tel:+375441234567', 'Позвонить нам');

      const cartHit = document.createElementNS(NS, 'rect');
      cartHit.setAttribute('x', '1208');
      cartHit.setAttribute('y', '15');
      cartHit.setAttribute('width', '165');
      cartHit.setAttribute('height', '43');
      cartHit.setAttribute('rx', '21.5');
      cartHit.setAttribute('fill', 'transparent');
      cartHit.setAttribute('pointer-events', 'all');
      cartHit.setAttribute('role', 'button');
      cartHit.setAttribute('tabindex', '0');
      cartHit.setAttribute('aria-label', 'Открыть корзину');
      const openCart = event => {
        event.preventDefault();
        event.stopPropagation();
        const label = clone.querySelector('text tspan');
        if (label && window.PONE_UI?.count) label.textContent = 'Корзина (' + window.PONE_UI.count() + ')';
        window.PONE_UI?.showCart?.();
      };
      cartHit.addEventListener('click', openCart);
      cartHit.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') openCart(event);
      });
      fixedSvg.append(cartHit);
      shell.append(fixedSvg);
      document.body.append(shell);
    } else {
      const bar = document.createElement('div');
      bar.className = 'sticky-html-header';
      const link = (label, href) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        return a;
      };
      bar.append(link('Вкусный След', 'index.html'));
      const nav = document.createElement('nav');
      nav.append(
        link('Меню', 'constructor.html'),
        link('Готовые наборы', 'boxes.html'),
        link('Партнёрам', 'index.html#Partners'),
        link('Доставка и оплата', 'index.html#FAQ'),
        link('Кафе', 'index.html#Gallery')
      );
      bar.append(nav);
      bar.append(link('Позвонить нам', 'tel:+375441234567'));
      const cart = document.createElement('button');
      cart.type = 'button';
      cart.className = 'sticky-html-cart';
      cart.textContent = 'Корзина (' + (window.PONE_UI?.count?.() ?? 0) + ')';
      cart.setAttribute('aria-label', 'Открыть корзину');
      cart.addEventListener('click', () => window.PONE_UI?.showCart?.());
      bar.append(cart);
      shell.append(bar);
      document.body.append(shell);
    }
  }
})();

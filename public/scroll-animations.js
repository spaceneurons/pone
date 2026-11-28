(() => {
  'use strict';
  try {
    const svg = document.querySelector('svg[data-page]');
    const desktop = window.matchMedia('(min-width: 761px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!svg || !desktop.matches || reduced.matches) return;

    const normalize = value => (value || '').replace(/\\s+/g, ' ').trim();
    const direct = (root, selector) => root ? Array.from(root.querySelectorAll(':scope > ' + selector)) : [];
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.035, rootMargin: '0px 0px -7% 0px' })
      : null;

    const reveal = (nodes, step = 65) => {
      let index = 0;
      nodes.filter(Boolean).forEach(node => {
        // Button labels must be visible together with their backgrounds.
        if (node.tagName.toLowerCase() === 'text') {
          const label = node.textContent.replace(/\s+/g, ' ').trim();
          const solutionLabel = node.hasAttribute('data-solution-card') &&
            Array.from(node.querySelectorAll('tspan')).some(span => Math.abs(Number(span.getAttribute('y')) - 1677.32) < 1);
          const buttonLabel = /^(Смотреть\s|Собрать\s|Все позиции|Отправить$|Позвонить нам$|Корзина\s*\(|Оформить заказ$|На главную$|В корзину$|Добавить в корзину$|Фильтр$)/i.test(label);
          const requestButton = label === 'Оставить заявку' && Number(node.getAttribute('font-size')) < 30;
          if (solutionLabel || buttonLabel || requestButton) return;
        }
        if (node.dataset.scrollRevealReady) return;
        node.dataset.scrollRevealReady = '1';
        node.classList.add('site-scroll-reveal');
        node.style.setProperty('--scroll-delay', Math.min(index++, 10) * step + 'ms');
        if (observer) observer.observe(node);
        else node.classList.add('is-visible');
      });
    };

    const home = svg.dataset.page === 'home';
    if (home) {
      const menu = svg.querySelector('#MenuConstructor');
      if (menu) {
        const texts = direct(menu, 'text');
        const findText = value => texts.find(node => normalize(node.textContent).includes(value));
        const categoryNames = ['Брускетты', 'Бургеры', 'Канапе', 'Круассаны', 'Бейглы', 'Боссче', 'Аппетайзеры', 'Все позиции'];
        const categories = categoryNames.map(findText);
        const cards = direct(menu, 'g[data-card]').sort((a, b) =>
          Number(a.getAttribute('data-y')) - Number(b.getAttribute('data-y')) ||
          Number(a.getAttribute('data-x')) - Number(b.getAttribute('data-x'))
        );
        const filterRect = direct(menu, 'rect').find(node => node.getAttribute('x') === '1166');
        const filterIcon = direct(menu, 'g[clip-path]');
        const activePill = direct(menu, 'rect').find(node => node.getAttribute('x') === '131' && node.getAttribute('y') === '4000');
        const ctaRect = direct(menu, 'rect').find(node => node.getAttribute('x') === '403' && node.getAttribute('y') === '4967');
        reveal([
          findText('Меню-конструктор'),
          findText('На нашли подходящий фудбокс'),
          filterRect,
          ...filterIcon,
          findText('Фильтр'),
          findText('Меню'),
          activePill,
          ...categories,
          ...cards,
          ctaRect,
          findText('Смотреть все позиции')
        ], 68);
      }

      const sectionIds = ['Header', 'Hero', 'Advantages', 'Solutions', 'ReadyBoxes', 'Reasons', 'Reviews', 'ReadyBoxesPagination', 'FAQ', 'Gallery', 'Partners', 'RequestForm'];
      sectionIds.forEach(id => {
        const section = svg.querySelector('#' + id);
        if (!section) return;
        const nodes = Array.from(section.children).filter(node => {
          const tag = node.tagName.toLowerCase();
          if (tag === 'mask' || tag === 'defs' || tag === 'clippath') return false;
          if (tag === 'path' && node.getAttribute('stroke')?.toUpperCase() === '#FF5800') return false;
          return tag === 'text' ||
            (tag === 'g' && (node.hasAttribute('filter') || node.hasAttribute('data-card'))) ||
            node.hasAttribute('data-card') ||
            node.hasAttribute('data-gallery') ||
            node.hasAttribute('data-faq-original') ||
            tag === 'image';
        });
        reveal(nodes, id === 'FAQ' ? 42 : 58);
      });

      // Start once when the section enters view; time, not scroll position, drives drawing.
      const reasons = svg.querySelector('#Reasons');
      const line = reasons && Array.from(reasons.children).find(node =>
        node.tagName.toLowerCase() === 'path' &&
        node.getAttribute('stroke')?.toUpperCase() === '#FF5800'
      );
      if (line && typeof line.getTotalLength === 'function') {
        const length = line.getTotalLength();
        if (length > 0 && typeof line.animate === 'function') {
          line.style.strokeDasharray = length + ' ' + length;
          line.style.strokeDashoffset = String(length);
          let started = false;
          const draw = () => {
            if (started) return;
            started = true;
            try {
              line.animate([{strokeDashoffset: String(length)}, {strokeDashoffset: '0'}],
                {duration: 2000, easing: 'ease-in-out'});
            } finally {
              line.style.strokeDashoffset = '0';
            }
          };
          if ('IntersectionObserver' in window) {
            const lineObserver = new IntersectionObserver(entries => {
              if (entries.some(entry => entry.isIntersecting)) {
                lineObserver.disconnect();
                draw();
              }
            }, {threshold: 0.05});
            lineObserver.observe(reasons);
          } else draw();
        }
      }
    } else {
      // Other desktop pages: reveal catalog cards in a gentle stagger.
      const cards = Array.from(svg.querySelectorAll('[data-card]')).sort((a, b) => {
        const ay = Number(a.getAttribute('data-y') || 0), by = Number(b.getAttribute('data-y') || 0);
        return ay - by || Number(a.getAttribute('data-x') || 0) - Number(b.getAttribute('data-x') || 0);
      });
      reveal(cards, 72);
      const headings = Array.from(svg.querySelectorAll('text')).filter(node => {
        const value = normalize(node.textContent);
        return value.length > 5 && value.length < 90 && /^(Меню|Готовые наборы|Фудбоксы|Конструктор|Состав|Оформить заказ)/i.test(value);
      });
      reveal(headings, 85);
    }
  } catch (error) {
    // Animation failures must never interrupt cart, navigation, or other site controls.
  }
})();

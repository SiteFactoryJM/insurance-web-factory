/** Customer page: navigation only. No form, tracking, contact payload, SDK or persistence. */
export const clientScript = String.raw`
(() => {
  const initializeCaseCarousels = () => {
    document.querySelectorAll('[data-cases-carousel]').forEach(root => {
      if (!(root instanceof HTMLElement) || root.dataset.carouselReady === 'true') return;
      root.dataset.carouselReady = 'true';
      const cards = [...root.querySelectorAll('[data-case-index]')];
      const previous = root.querySelector('[data-cases-prev]');
      const next = root.querySelector('[data-cases-next]');
      const live = root.querySelector('[data-cases-live]');
      if (!cards.length || !(previous instanceof HTMLButtonElement) || !(next instanceof HTMLButtonElement)) return;
      let current = 0;
      const classNames = ['is-prev','is-active','is-next','is-hidden-left','is-hidden-right'];
      const update = () => {
        cards.forEach((card, index) => {
          let offset = (index - current + cards.length) % cards.length;
          if (offset > Math.floor(cards.length / 2)) offset -= cards.length;
          card.classList.remove(...classNames);
          const state = offset === -1 ? 'is-prev' : offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : offset < -1 ? 'is-hidden-left' : 'is-hidden-right';
          card.classList.add(state);
          card.setAttribute('aria-hidden', Math.abs(offset) > 1 ? 'true' : 'false');
          if (offset === 0) card.setAttribute('aria-current', 'true');
          else card.removeAttribute('aria-current');
        });
        const title = cards[current].querySelector('h3')?.textContent?.trim() || '';
        if (live) live.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0') + ' ' + title;
      };
      const move = direction => {
        current = (current + direction + cards.length) % cards.length;
        update();
      };
      previous.addEventListener('click', () => move(-1));
      next.addEventListener('click', () => move(1));
      root.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      });
      update();
    });
  };
  // The advanced editor calls this hook after replacing preview sections.
  window.initializeConsultationDemo = initializeCaseCarousels;
  initializeCaseCarousels();
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a');
    // 제작 화면의 미리보기는 srcdoc 문서라 기준 주소가 제작 화면 자신입니다.
    // 그래서 '#상담분야' 같은 앵커도 같은 문서 안에서 움직이지 않고 새 주소로
    // 이동해 버리고, 그 주소는 frame-ancestors 'none' 때문에 거부되어 미리보기가
    // 오류 화면으로 바뀝니다. 미리보기 안에서는 모든 이동을 막고 앵커만 직접
    // 스크롤로 처리합니다.
    if (document.body.dataset.studioPreview === 'true' && link) {
      event.preventDefault();
      const href = String(link.getAttribute('href') || '');
      if (href.length > 1 && href.charAt(0) === '#') {
        const section = document.getElementById(href.slice(1));
        if (section) section.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      return;
    }
    const menuLink = target.closest('.mobile-menu a');
    if (menuLink) menuLink.closest('.mobile-menu').open = false;
  });
  document.addEventListener('keydown', event => {
    const menu = document.querySelector('.mobile-menu');
    if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
  });
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.src.endsWith('/assets/profile-placeholder.svg')) img.src = '/assets/profile-placeholder.svg';
  }, true);
  const cta = document.querySelector('[data-mobile-cta]');
  const targets = [document.querySelector('.hero-actions'), document.querySelector('#contact'), document.querySelector('.site-footer')].filter(Boolean);
  if (!cta || document.body.dataset.studioPreview === 'true') return;
  const visible = new Map(targets.map(target => [target, false]));
  const refresh = () => {
    const editing = document.activeElement?.matches('input,textarea,select');
    const keyboard = window.visualViewport && window.innerHeight - window.visualViewport.height > 120;
    cta.hidden = Boolean([...visible.values()].some(Boolean) || editing || keyboard);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visible.set(entry.target, entry.isIntersecting)); refresh();
    }, {threshold: 0});
    targets.forEach(target => observer.observe(target));
  }
  document.addEventListener('focusin', refresh);
  document.addEventListener('focusout', () => setTimeout(refresh, 0));
  window.visualViewport?.addEventListener('resize', refresh);
})();
`;

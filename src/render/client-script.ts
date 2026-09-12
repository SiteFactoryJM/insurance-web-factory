/** Customer page: navigation only. No form, tracking, contact payload, SDK or persistence. */
export const clientScript = String.raw`
(() => {
  // The advanced editor still calls this hook after replacing preview sections.
  window.initializeConsultationDemo = () => {};
  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a');
    if (document.body.dataset.studioPreview === 'true' && link &&
        !String(link.getAttribute('href') || '').startsWith('#')) {
      event.preventDefault(); return;
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

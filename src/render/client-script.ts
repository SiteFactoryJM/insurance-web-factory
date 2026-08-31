export const clientScript = String.raw`
(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open') ?? false;
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeNav(); });

  const phone = document.querySelector('input[name="phone"]');
  phone?.addEventListener('input', (event) => {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) input.value = digits;
    else if (digits.length <= 7) input.value = digits.replace(/(\d{3})(\d+)/, '$1-$2');
    else input.value = digits.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
  });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!(form instanceof HTMLFormElement)) return;
    const status = form.querySelector('[data-form-status]');
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    if (button instanceof HTMLButtonElement) button.disabled = true;
    if (status) { status.textContent = '신청 내용을 확인하고 있습니다.'; status.className = 'form-status'; }
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || '신청을 처리하지 못했습니다.');
      if (status) { status.textContent = result.message; status.className = 'form-status is-success'; }
      form.reset();
    } catch (error) {
      if (status) { status.textContent = error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'; status.className = 'form-status is-error'; }
    } finally {
      if (button instanceof HTMLButtonElement) button.disabled = false;
    }
  });

  const templateSelect = document.querySelector('[data-template-select]');
  templateSelect?.addEventListener('change', (event) => {
    const select = event.currentTarget;
    if (!(select instanceof HTMLSelectElement)) return;
    const url = new URL(window.location.href);
    url.searchParams.set('theme', select.value);
    window.location.href = url.toString();
  });
  document.querySelector('[data-switcher-close]')?.addEventListener('click', () => {
    document.querySelector('[data-demo-switcher]')?.remove();
  });
})();
`;

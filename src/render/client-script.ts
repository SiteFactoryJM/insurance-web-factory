export const clientScript = String.raw`
(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const closeNav = () => { if (!nav || !navToggle) return; nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); document.body.classList.remove('nav-open'); };
  navToggle?.addEventListener('click', () => { const open = nav?.classList.toggle('is-open') ?? false; navToggle.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('nav-open', open); });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth >= 860) closeNav(); });

  document.querySelectorAll('[data-faq-tabs]').forEach((tabset) => {
    const tabs = Array.from(tabset.querySelectorAll('[data-faq-tab]'));
    const panels = Array.from(tabset.querySelectorAll('[data-faq-panel]'));
    const activate = (index, focus = false) => {
      tabs.forEach((tab, i) => { const selected = i === index; tab.setAttribute('aria-selected', String(selected)); tab.setAttribute('tabindex', selected ? '0' : '-1'); if (selected && focus) tab.focus(); });
      panels.forEach((panel, i) => { panel.hidden = i !== index; });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => { if (!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key)) return; event.preventDefault(); let next = index; if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length; if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; activate(next, true); });
    });
  });

  const phone = document.querySelector('input[name="phone"]');
  phone?.addEventListener('input', (event) => { const input = event.currentTarget; if (!(input instanceof HTMLInputElement)) return; const digits = input.value.replace(/\D/g,'').slice(0,11); if (digits.length <= 3) input.value = digits; else if (digits.length <= 7) input.value = digits.replace(/(\d{3})(\d+)/,'$1-$2'); else input.value = digits.replace(/(\d{3})(\d{4})(\d+)/,'$1-$2-$3'); });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault(); if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;
    const status = form.querySelector('[data-form-status]'); const button = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form).entries()); const mode = form.dataset.submissionMode || 'store'; const recipient = form.dataset.formEmail || '';
    if (mode === 'mailto' && recipient) {
      const subject = '[홈페이지 상담 문의] ' + String(payload.name || '고객');
      const body = ['이름: ' + String(payload.name || ''), '연락처: ' + String(payload.phone || ''), '', '상담 희망 내용', String(payload.message || '(작성 내용 없음)')].join('\n');
      window.location.href = 'mailto:' + encodeURIComponent(recipient) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (status) { status.textContent = '이메일 앱을 열었습니다. 내용을 확인한 뒤 전송해 주세요.'; status.className = 'form-status is-success'; } return;
    }
    if (button instanceof HTMLButtonElement) button.disabled = true;
    if (status) { status.textContent = '신청 내용을 확인하고 있습니다.'; status.className = 'form-status'; }
    try { const response = await fetch('/api/consultations',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); const result = await response.json(); if (!response.ok) throw new Error(result.message || '신청을 처리하지 못했습니다.'); if (status) { status.textContent = result.message; status.className = 'form-status is-success'; } form.reset(); }
    catch (error) { if (status) { status.textContent = error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'; status.className = 'form-status is-error'; } }
    finally { if (button instanceof HTMLButtonElement) button.disabled = false; }
  });

  const templateSelect = document.querySelector('[data-template-select]');
  templateSelect?.addEventListener('change', (event) => { const select = event.currentTarget; if (!(select instanceof HTMLSelectElement)) return; const url = new URL(window.location.href); url.pathname='/'; url.searchParams.set('theme',select.value); window.location.href=url.toString(); });
  document.querySelector('[data-switcher-close]')?.addEventListener('click', () => document.querySelector('[data-demo-switcher]')?.remove());
})();
`;

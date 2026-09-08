/** Demo-only interaction. Intentionally contains no fetch, mailto, SDK or browser storage. */
export const clientScript = String.raw`
(() => {
  const menu = document.querySelector('.mobile-menu');
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.open = false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
  });
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
    if (!img.src.endsWith('/assets/profile-placeholder.svg')) img.src = '/assets/profile-placeholder.svg';
  }, { once: true }));

  const form = document.querySelector('[data-contact-form]');
  if (form instanceof HTMLFormElement) {
    const steps = [...form.querySelectorAll('[data-step]')];
    const indicators = [...form.querySelectorAll('[data-step-indicator]')];
    const previous = form.querySelector('[data-prev]');
    const next = form.querySelector('[data-next]');
    const submit = form.querySelector('[data-submit]');
    const actions = form.querySelector('[data-form-actions]');
    const error = form.querySelector('[data-form-error]');
    const result = form.querySelector('[data-demo-result]');
    const review = form.querySelector('[data-review-summary]');
    const progress = form.querySelector('[data-step-status]');
    const phone = form.elements.namedItem('phone');
    const message = form.elements.namedItem('message');
    const labels = ['분야 선택','상황 작성','연락 정보','최종 확인'];
    let current = 0;
    let complete = false;
    const value = name => String(form.elements.namedItem(name)?.value || '').trim();
    const clearError = () => { error.textContent = ''; form.querySelectorAll('[aria-invalid]').forEach(el => { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-errormessage'); }); };
    const invalid = (text, field) => { error.textContent = text; if(field){field.setAttribute('aria-invalid','true');field.setAttribute('aria-errormessage','consult-error');field.focus();}else error.focus();return false; };
    error.id = 'consult-error';
    const validate = () => {
      clearError();
      if(current === 0 && !value('topic')) return invalid('상담 분야를 하나 선택해 주세요.', form.querySelector('[name="topic"]'));
      if(current === 2 && !/^01[016789][0-9]{7,8}$/.test(value('phone').replace(/\D/g,''))) return invalid('휴대전화 번호를 확인해 주세요. 예: 010-0000-0000', phone);
      if(current === 3 && !form.elements.namedItem('privacyConsent').checked) return invalid('샘플 개인정보 안내 확인에 체크해 주세요.', form.elements.namedItem('privacyConsent'));
      return true;
    };
    const buildReview = () => {
      review.replaceChildren();
      const digits = value('phone').replace(/\D/g,'');
      const maskedPhone = digits ? digits.slice(0,3) + '-****-' + digits.slice(-4) : '';
      [['상담 분야',value('topic')],['궁금한 내용',value('message') || '상담 때 말씀드릴게요'],['이름 / 호칭',value('name') || '작성하지 않음'],['연락처',maskedPhone],['연락 방법',value('contactMethod')],['희망 시간',value('contactTime')]].forEach(([key,text]) => {
        const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = key; dd.textContent = text; row.append(dt,dd); review.append(row);
      });
    };
    const show = (step, focus = true) => {
      current = step; clearError(); complete = false;
      steps.forEach((el,i) => {el.hidden = i !== step; el.disabled = i !== step;});
      indicators.forEach((el,i) => {if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
      progress.textContent = (step + 1) + ' / 4단계 · ' + labels[step];
      previous.hidden = step === 0; next.hidden = step === 3; submit.hidden = step !== 3;
      next.disabled = false; submit.disabled = false; actions.hidden = false; result.hidden = true;
      if(step === 3) buildReview();
      if(focus) steps[step].querySelector('[data-step-title]')?.focus();
    };
    const count = () => { form.querySelector('[data-character-count]').textContent = message.value.length + ' / 300자'; };
    message.addEventListener('input', count);
    // Format on blur, never move the caret while someone edits the middle of a number.
    phone.addEventListener('blur', () => {
      const digits = phone.value.replace(/\D/g,'');
      if(/^01[016789][0-9]{7,8}$/.test(digits)) phone.value = digits.slice(0,3) + '-' + digits.slice(3,-4) + '-' + digits.slice(-4);
    });
    next.addEventListener('click', () => {if(validate())show(Math.min(current + 1,3));});
    previous.addEventListener('click', () => show(Math.max(current - 1,0)));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if(complete || !validate()) return;
      if(current < 3){show(current + 1);return;}
      // Local state transition only. Never POST the demo, even to a discard endpoint.
      complete = true; form.reset(); review.replaceChildren(); count();
      steps.forEach(el => {el.hidden = true;el.disabled = true;}); actions.hidden = true;
      progress.textContent = '화면 체험 완료 · 실제 접수 아님'; result.hidden = false;
      form.querySelector('#result-title').focus();
    });
    const reset = (focus = false) => {form.reset();review.replaceChildren();count();show(0,focus);};
    form.querySelector('[data-restart]').addEventListener('click', () => reset(true));
    document.querySelectorAll('[data-start-topic]').forEach(link => link.addEventListener('click', () => {
      show(0,false); const choice = [...form.querySelectorAll('[name="topic"]')].find(el => el.value === link.dataset.startTopic); if(choice)choice.checked = true;
    }));
    window.addEventListener('pagehide', () => reset(false));
    window.addEventListener('pageshow', event => {if(event.persisted)reset(false);});
    show(0,false);
  }
  const cta = document.querySelector('[data-mobile-cta]');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contact');
  const footer = document.querySelector('.site-footer');
  if(cta && hero && contact && footer && 'IntersectionObserver' in window) {
    const visible = new Map([[hero,true],[contact,false],[footer,false]]);
    const refresh = () => {
      const editing = document.activeElement?.matches('input,textarea,select');
      const keyboard = window.visualViewport && window.innerHeight - window.visualViewport.height > 120;
      cta.hidden = Boolean(visible.get(hero) || visible.get(contact) || visible.get(footer) || editing || keyboard);
    };
    const observer = new IntersectionObserver(entries => {entries.forEach(entry => visible.set(entry.target,entry.isIntersecting));refresh();}, {threshold:0});
    [hero,contact,footer].forEach(el => observer.observe(el));
    document.addEventListener('focusin',refresh); document.addEventListener('focusout', () => setTimeout(refresh,0));
    window.visualViewport?.addEventListener('resize',refresh);
  }
})();
`;

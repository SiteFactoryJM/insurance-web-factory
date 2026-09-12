import type { SiteConfig, PaletteId, HeadingFont } from '../types.js';
import { COPY_LIBRARY as library } from '../content/copy-library.js';
import { PALETTES, TEMPLATE_META } from '../render/design-system.js';
import { renderSitePage } from '../render/page.js';
import { escapeHtml as e } from '../utils/html.js';
import { createProject, parseProject, validateImageSource, MAX_IMAGE_BYTES, MAX_PROJECT_BYTES } from './project.js';
import { applyCopy, applyPurpose, blankGuidedSite, guidedIssues, resetPublication, type CopyGroup } from './guided-model.js';

const bootstrap = document.getElementById('guided-bootstrap');
if (!bootstrap?.textContent) throw new Error('제작 도구의 기본 정보를 찾을 수 없습니다.');
const example = JSON.parse(bootstrap.textContent) as SiteConfig;
let site = blankGuidedSite(example);
let stage = 0, purpose = library.presets[0].id, group: CopyGroup = 'heroes';
let dirty = false, remember = false, stored = false, previewTimer = 0, storageTimer = 0;
let device: 'desktop' | 'mobile' = 'desktop';
let scopeConfirmed = false, linksConfirmed = false, assetsConfirmed = false;
const STORAGE_KEY = 'atelier-guided-draft-v1';
const panel = document.getElementById('guided-panel')!;
const frame = document.getElementById('guided-preview') as HTMLIFrameElement;
const status = document.getElementById('guided-status')!;
const errorBox = document.getElementById('guided-errors')!;
const groups: Record<CopyGroup, string> = { heroes: '첫 화면 · 24개', intros: '담당자 소개 · 16개', services: '상담 분야 · 24개', processes: '상담 과정 · 8세트', faqs: 'FAQ · 30개', footers: '하단 안내 · 12개' };
const ids = (kind: CopyGroup): string[] => {
  switch (kind) {
    case 'heroes': return library.heroes.filter(h => h.headline === site.hero.headline && h.subheadline === site.hero.subheadline).map(h => h.id);
    case 'intros': return library.intros.filter(h => h.title === site.intro.title && h.body === site.intro.body).map(h => h.id);
    case 'services': return library.services.filter(h => site.specialties.some(s => s.title === h.title && s.body === h.body)).map(h => h.id);
    case 'processes': return library.processes.filter(h => JSON.stringify(h.items) === JSON.stringify(site.process)).map(h => h.id);
    case 'faqs': return library.faqs.filter(h => site.faqs.some(f => f.question === h.question && f.answer === h.answer)).map(h => h.id);
    case 'footers': return library.footers.filter(h => h.text === site.footer?.note).map(h => h.id);
  }
};
let pendingIds = ids(group);
function message(text: string): void { status.textContent = text; }
function showError(error: unknown): void {
  errorBox.textContent = error instanceof Error ? error.message : String(error);
  errorBox.focus();
}
function clearError(): void { errorBox.textContent = ''; }
function fitPreview(): void {
  const mat = document.querySelector('.g-mat') as HTMLElement;
  const canvas = document.querySelector('.g-canvas') as HTMLElement;
  const width = device === 'desktop' ? 1440 : 390;
  const scale = Math.min(1, Math.max(1, mat.clientWidth) / width);
  canvas.style.width = `${width * scale}px`;
  frame.style.width = `${width}px`;
  frame.style.height = `${Math.max(400, mat.clientHeight / scale)}px`;
  frame.style.transform = `scale(${scale})`;
}
function preview(section?: string): void {
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => {
    const scroll = frame.contentWindow?.scrollY || 0;
    frame.onload = () => {
      fitPreview();
      const target = section ? frame.contentDocument?.getElementById(section) : null;
      if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
      else frame.contentWindow?.scrollTo(0, scroll);
    };
    frame.srcdoc = renderSitePage(site, new Request(`${location.origin}/`), {studioPreview: true});
  }, 160);
}
function changed(section?: string): void {
  resetPublication(site);
  dirty = true; stored = false; scopeConfirmed = linksConfirmed = assetsConfirmed = false;
  panel.querySelectorAll<HTMLInputElement>('[data-confirm]').forEach(input => { input.checked = false; });
  clearError(); preview(section);
  if (remember) { window.clearTimeout(storageTimer); storageTimer = window.setTimeout(saveDraft, 500); }
}
function textField(label: string, name: string, value: string | undefined, max: number, placeholder = '', type = 'text'): string {
  return `<label class="g-field"><span>${e(label)}</span><input name="${name}" type="${type}" value="${e(value || '')}" maxlength="${max}" placeholder="${e(placeholder)}" autocomplete="off"></label>`;
}
function renderPanel(): void {
  clearError();
  document.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stage) === stage)));
  const previous = document.querySelector<HTMLButtonElement>('[data-action=previous]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-action=next]')!;
  previous.hidden = stage === 0; next.hidden = stage === 2;
  next.textContent = stage === 0 ? '문구 선택으로' : '정보 확인으로';
  if (stage === 0) {
    panel.innerHTML = `<h2 tabindex="-1">어떤 고객에게 보여줄 페이지인가요?</h2><p class="g-muted">목적을 고르면 제목·소개·분야·FAQ와 기본 배치가 함께 준비됩니다. 색상은 따로 바꿀 수 있습니다.</p><div class="g-purpose-grid">${library.presets.map(p => `<button type="button" class="g-purpose" data-purpose="${p.id}" aria-pressed="${purpose === p.id}"><strong>${e(p.label)}</strong><span>${e(p.audience)}</span></button>`).join('')}</div><div class="g-row"><label class="g-field"><span>색상</span><select id="guided-palette">${Object.entries(PALETTES).map(([id,p]) => `<option value="${id}"${site.palette === id ? ' selected' : ''}>${e(p.name)}</option>`).join('')}</select></label><label class="g-field"><span>제목 서체</span><select id="guided-font"><option value="noto-serif-kr"${site.headingFont === 'noto-serif-kr' ? ' selected' : ''}>차분한 명조</option><option value="pretendard"${site.headingFont === 'pretendard' ? ' selected' : ''}>단정한 고딕</option>${!['pretendard','noto-serif-kr'].includes(site.headingFont) ? `<option value="${e(site.headingFont)}" selected>불러온 서체 유지</option>` : ''}</select></label></div><p class="g-note">추천 구성은 검토 전 초안입니다. 실제 취급 범위와 조직 기준에 맞는 문구만 사용하세요. 허위 경력·수치·고객 후기는 제공하지 않습니다.</p><details class="g-advanced-note"><summary>배치와 순서를 직접 바꾸고 싶어요</summary><p>기존 자유 편집기는 유지됩니다. 제작 파일을 저장한 뒤 자유 편집에서 불러오면 선택한 원고를 이어서 편집할 수 있습니다.</p><a href="/studio/advanced">자유 편집 열기</a></details>`;
  } else if (stage === 1) {
    pendingIds = ids(group);
    panel.innerHTML = `<h2 tabindex="-1">작성 대신 선택하세요.</h2><p class="g-muted">추천 문구가 이미 적용되어 있습니다. 필요한 묶음만 골라 바꾸세요. 가져온 사용자 원고는 선택을 적용하기 전까지 유지됩니다.</p><div class="g-copy-search"><label class="g-field"><span>바꿀 문구 묶음</span><select id="copy-group">${Object.entries(groups).map(([id,label]) => `<option value="${id}"${id === group ? ' selected' : ''}>${e(label)}</option>`).join('')}</select></label><label class="g-field"><span>문구 검색</span><input id="copy-search" type="search" placeholder="예: 가족, 갱신, 상담 시간"></label><p id="choice-help" class="g-muted"></p></div><div id="copy-options" class="g-choice-list"></div><button type="button" class="g-btn g-btn-primary" data-action="apply-copies"${['services','faqs'].includes(group) ? '' : ' hidden'}>선택한 묶음 적용</button>`;
    renderOptions('');
  } else {
    panel.innerHTML = `<h2 tabindex="-1">실제 정보만 확인해 주세요.</h2><p class="g-muted">문구는 준비됐습니다. 소속·연락처·사진 사용권은 실제 정보를 확인해야 합니다.</p><button class="g-btn" type="button" data-action="example-profile">데모 담당자 정보로 확인하기</button><div class="g-row">${textField('담당자 이름','name',site.agent.name,60,'홍길동')}${textField('직함','title',site.agent.title,80,'보험설계사')}</div>${textField('소속','company',site.agent.company,120,'실제 보험사·GA·지사명')}<div class="g-row">${textField('전화번호','phone',site.contact.phone,32,'010-0000-0000','tel')}${textField('상담 시간','hours',site.contact.availableHours,100,'평일 09:00–18:00')}</div>${textField('카카오톡 오픈채팅 주소','kakao',site.contact.kakaoUrl,2048,'https://open.kakao.com/o/초대코드','url')}<p class="g-muted">카카오 개발자 설정이나 API 키는 필요하지 않습니다. 오픈채팅의 공유용 초대 주소를 입력하세요.</p><label class="g-field"><span>프로필 사진</span><input id="guided-photo" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG·PNG·WebP, 3MB 이하. 직접 촬영했거나 게시 권한을 가진 사진만 사용하세요.</small></label><details class="g-advanced-note"><summary>추가 정보 · 등록번호·주소·지사</summary>${textField('지사명 (소속에 이미 포함했다면 생략)','branch',site.agent.branch,120)}${textField('설계사 등록번호 (확인된 경우만)','registration',site.agent.registrationNumber,80)}${textField('사무실 주소 (선택)','address',site.contact.officeAddress,240)}</details><dl class="g-summary"><dt>페이지 구성</dt><dd>${e(TEMPLATE_META[site.template].purpose)} · ${e(PALETTES[site.palette || 'navy'].name)}</dd><dt>선택한 제목</dt><dd>${e(site.hero.headline)}</dd><dt>포함 문구</dt><dd>상담 분야 ${site.specialties.length}개 · 상담 과정 ${site.process.length}단계 · FAQ ${site.faqs.length}개</dd><dt>게시 상태</dt><dd>검토용 초안 · 검색 비노출 · 자동 게시 없음</dd></dl><label class="g-check"><input type="checkbox" data-confirm="scope"${scopeConfirmed ? ' checked' : ''}><span>선택한 문구가 실제 상담 범위와 맞는지 확인했습니다.</span></label><label class="g-check"><input type="checkbox" data-confirm="links"${linksConfirmed ? ' checked' : ''}><span>전화번호와 오픈채팅 주소의 소유자·연결 대상을 확인했습니다.</span></label><label class="g-check"><input type="checkbox" data-confirm="assets"${assetsConfirmed ? ' checked' : ''}><span>사진·로고의 게시 권한을 확인했습니다. 미사용 시에도 확인합니다.</span></label><p class="g-note">이 확인은 광고심의나 조직 승인이 아닙니다. 파일을 받은 제작 담당자가 게시 전 별도 검토를 진행해야 합니다.</p>`;
  }
}
function choiceBody(item: {id:string}): string {
  if (group === 'heroes') return library.heroes.find(h => h.id === item.id)!.subheadline;
  if (group === 'intros') return library.intros.find(h => h.id === item.id)!.body;
  if (group === 'services') return library.services.find(h => h.id === item.id)!.body;
  if (group === 'faqs') return library.faqs.find(h => h.id === item.id)!.answer;
  if (group === 'processes') return library.processes.find(h => h.id === item.id)!.items.map(h => h.title).join(' → ');
  return library.footers.find(h => h.id === item.id)!.text;
}
function renderOptions(search: string): void {
  const list = document.getElementById('copy-options')!;
  const multi = group === 'services' || group === 'faqs';
  const rows = library[group].filter(item => `${item.label} ${choiceBody(item)}`.includes(search.trim()));
  const recommended = library.presets.find(p => p.id === purpose);
  const recommendation = recommended ? group === 'heroes' ? [recommended.heroId] : group === 'intros' ? [recommended.introId] : group === 'services' ? recommended.serviceIds : group === 'processes' ? [recommended.processId] : group === 'faqs' ? recommended.faqIds : [recommended.footerId] : [];
  document.getElementById('choice-help')!.textContent = `${rows.length}개 표시 · ${multi ? `${group === 'services' ? '3~6' : '2~8'}개 선택 후 적용 · 현재 ${pendingIds.length}개 선택` : '하나를 고르면 바로 적용됩니다.'}`;
  list.innerHTML = rows.length ? rows.map(item => `<label class="g-choice"><input type="${multi ? 'checkbox' : 'radio'}" name="copy-choice" value="${e(item.id)}"${pendingIds.includes(item.id) ? ' checked' : ''}><span>${recommendation.includes(item.id) ? '<span class="g-tag">목적별 추천</span>' : ''}<strong>${e(item.label)}</strong><p>${e(choiceBody(item))}</p></span></label>`).join('') : '<p>일치하는 문구가 없습니다. 다른 검색어로 찾아보세요.</p>';
}
function storageProject(): string {
  const copy = structuredClone(site);
  const emptyFields: string[] = [];
  for (const [key,fallback] of [['name','미입력'],['company','미입력']] as const) if (!copy.agent[key]) { emptyFields.push(key); copy.agent[key] = fallback; }
  if (!copy.contact.phone) { emptyFields.push('phone'); copy.contact.phone = '010-0000-0000'; }
  if (!copy.contact.availableHours) { emptyFields.push('hours'); copy.contact.availableHours = '미입력'; }
  return JSON.stringify({ format: 'atelier-guided-local-v1', emptyFields, project: createProject(copy) });
}
function saveDraft(): void {
  try { localStorage.setItem(STORAGE_KEY, storageProject()); stored = true; message('이 브라우저에 초안을 보관했습니다. 공개나 서버 전송은 이루어지지 않습니다.'); }
  catch { stored = false; message('초안을 보관하지 못했습니다. 입력 형식이나 저장 용량을 확인하고 제작 파일을 저장해 주세요.'); }
}
function restoreDraft(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) throw new Error('이 기기에 보관한 초안이 없습니다.');
  if (new TextEncoder().encode(raw).byteLength > MAX_PROJECT_BYTES + 2048) throw new Error('보관한 초안이 크기 제한을 초과합니다.');
  const data = JSON.parse(raw);
  if (data.format !== 'atelier-guided-local-v1' || !Array.isArray(data.emptyFields) || !data.emptyFields.every((v:unknown) => typeof v === 'string' && ['name','company','phone','hours'].includes(v))) throw new Error('초안 형식이 올바르지 않습니다.');
  const restored = parseProject(data.project).site;
  if (data.emptyFields.includes('name')) restored.agent.name = '';
  if (data.emptyFields.includes('company')) restored.agent.company = '';
  if (data.emptyFields.includes('phone')) restored.contact.phone = '';
  if (data.emptyFields.includes('hours')) restored.contact.availableHours = '';
  site = resetPublication(restored); purpose = ''; pendingIds = ids(group);
  scopeConfirmed = linksConfirmed = assetsConfirmed = false; dirty = true;
  renderPanel(); preview(); message('보관한 초안을 복원했습니다. 기존 문구와 연락처를 확인한 뒤 사용하세요.');
}
function download(): void {
  const issues = guidedIssues(site);
  if (!scopeConfirmed || !linksConfirmed || !assetsConfirmed) issues.push('정보·검토 단계의 세 가지 확인란을 확인해 주세요.');
  if (issues.length) { stage = 2; renderPanel(); throw new Error(issues.join('\n')); }
  const project = createProject(site);
  const blob = new Blob([JSON.stringify(project, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url;
  anchor.download = `${site.agent.name.replace(/[\\/:*?"<>|]/g,'-')}-상담페이지.json`;
  document.body.append(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  dirty = false; message('제작 파일을 저장했습니다. 검토 전 초안이며 자동 게시되지 않습니다.');
}
function printReview(): void {
  document.getElementById('guided-print')?.remove();
  const printFrame = document.createElement('iframe'); printFrame.id = 'guided-print';
  printFrame.title = '제작 검토본 인쇄'; printFrame.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;border:0';
  printFrame.onload = async () => {
    await printFrame.contentDocument?.fonts.ready;
    printFrame.contentWindow?.focus(); printFrame.contentWindow?.print();
  };
  printFrame.srcdoc = renderSitePage(site, new Request(`${location.origin}/`), {studioPreview:true});
  document.body.append(printFrame);
}

document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('button,[data-action]') : null;
  if (!target) return;
  try {
    if (target.dataset.stage !== undefined) { stage = Number(target.dataset.stage); renderPanel(); panel.querySelector<HTMLElement>('h2')?.focus(); }
    if (target.dataset.purpose) {
      if (dirty && !window.confirm('현재 이름·연락처는 유지하고 문구와 배치를 추천 구성으로 바꿀까요?')) return;
      const preset = library.presets.find(p => p.id === target.dataset.purpose)!;
      site = applyPurpose(site,preset); purpose = preset.id; changed('home'); renderPanel();
      message(`${preset.label} 구성을 적용했습니다. 이름·소속·연락처는 변경하지 않았습니다.`);
    }
    if (target.dataset.device) { device = target.dataset.device as 'desktop'|'mobile'; document.querySelectorAll<HTMLElement>('[data-device]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.device === device))); fitPreview(); }
    if (target.dataset.view) { document.getElementById('guided-layout')!.dataset.view = target.dataset.view; document.querySelectorAll<HTMLElement>('[data-view]:not(#guided-layout)').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.view === target.dataset.view))); fitPreview(); }
    switch (target.dataset.action) {
      case 'next': stage = Math.min(stage+1,2); renderPanel(); panel.querySelector<HTMLElement>('h2')?.focus(); break;
      case 'previous': stage = Math.max(stage-1,0); renderPanel(); break;
      case 'apply-copies': site = applyCopy(site,group,pendingIds); changed(group === 'services' ? 'specialties' : 'faq'); message('선택한 문구 묶음을 적용했습니다.'); break;
      case 'download': download(); break;
      case 'import': (document.getElementById('guided-file') as HTMLInputElement).click(); break;
      case 'print': printReview(); break;
      case 'restore': if (!dirty || window.confirm('현재 편집 내용을 보관한 초안으로 바꿀까요?')) restoreDraft(); break;
      case 'clear': localStorage.removeItem(STORAGE_KEY); remember = stored = false; window.clearTimeout(storageTimer); (document.getElementById('remember-draft') as HTMLInputElement).checked = false; message('이 기기에 보관한 초안을 삭제했습니다. 현재 편집 화면은 유지됩니다.'); break;
      case 'example-profile':
        if (!window.confirm('데모에 등록된 실제 담당자 정보입니다. 현재 프로필·연락처를 바꾸고 디자인을 확인할까요?')) return;
        site.agent = structuredClone(example.agent); site.contact = structuredClone(example.contact); changed(); renderPanel(); message('데모 담당자 정보를 가져왔습니다. 미리보기에서는 연락 버튼이 연결되지 않습니다.'); break;
    }
  } catch(error) { showError(error); }
});
document.addEventListener('input', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.id === 'copy-search') { renderOptions(input.value); return; }
  const setters: Record<string,(value:string)=>void> = {
    name: value => { site.agent.name = value; }, title: value => { site.agent.title = value; }, company: value => { site.agent.company = value; },
    phone: value => { site.contact.phone = value; }, kakao: value => { site.contact.kakaoUrl = value; }, hours: value => { site.contact.availableHours = value; },
    branch: value => { site.agent.branch = value; }, registration: value => { site.agent.registrationNumber = value; }, address: value => { site.contact.officeAddress = value; site.sections.location = Boolean(value.trim()); },
  };
  if (Object.hasOwn(setters,input.name)) { setters[input.name](input.value); changed(); }
});
document.addEventListener('change', async event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement)) return;
  try {
    if (input.id === 'copy-group') { group = input.value as CopyGroup; renderPanel(); }
    if (input.id === 'guided-palette') { site.palette = input.value as PaletteId; changed(); }
    if (input.id === 'guided-font') { site.headingFont = input.value as HeadingFont; changed(); }
    if (input instanceof HTMLInputElement && input.name === 'copy-choice') {
      if (['services','faqs'].includes(group)) { pendingIds = input.checked ? [...pendingIds.filter(id => id !== input.value),input.value] : pendingIds.filter(id => id !== input.value); document.getElementById('choice-help')!.textContent = `${pendingIds.length}개 선택 · 선택한 묶음 적용을 눌러 주세요.`; }
      else { site = applyCopy(site,group,[input.value]); pendingIds = [input.value]; changed(group === 'heroes' ? 'home' : group === 'intros' ? 'about' : group === 'processes' ? 'process' : 'footer'); message('선택한 문구를 적용했습니다.'); }
    }
    if (input instanceof HTMLInputElement && input.dataset.confirm) {
      if (input.dataset.confirm === 'scope') scopeConfirmed = input.checked;
      if (input.dataset.confirm === 'links') linksConfirmed = input.checked;
      if (input.dataset.confirm === 'assets') assetsConfirmed = input.checked;
    }
    if (input instanceof HTMLInputElement && input.id === 'remember-draft') {
      remember = input.checked; window.clearTimeout(storageTimer);
      if (remember) saveDraft(); else { localStorage.removeItem(STORAGE_KEY); stored = false; message('기기 내 초안 보관을 중지하고 저장된 초안을 삭제했습니다.'); }
    }
    if (input instanceof HTMLInputElement && input.id === 'guided-file' && input.files?.[0]) {
      const file = input.files[0]; input.value = '';
      if (file.size > MAX_PROJECT_BYTES) throw new Error('제작 파일은 8MB 이하여야 합니다.');
      const imported = parseProject(await file.text()).site;
      if (dirty && !window.confirm('현재 편집 내용을 선택한 파일로 바꿀까요?')) return;
      site = resetPublication(imported); purpose = ''; changed(); renderPanel(); message('제작 파일을 불러왔습니다. 사용자 문구는 그대로 유지됩니다.');
    }
    if (input instanceof HTMLInputElement && input.id === 'guided-photo' && input.files?.[0]) {
      const file = input.files[0]; input.value = '';
      if (file.size > MAX_IMAGE_BYTES || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('JPG·PNG·WebP, 3MB 이하 사진을 선택해 주세요.');
      const data = await new Promise<string>((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('사진을 읽지 못했습니다.')); reader.readAsDataURL(file); });
      const invalid = validateImageSource(data); if (invalid) throw new Error(invalid);
      site.agent.profileImage = data; changed('home'); message('사진을 적용했습니다. 서버에는 업로드하지 않습니다.');
    }
  } catch(error) { showError(error); }
});
window.addEventListener('beforeunload', event => { if (dirty && !(remember && stored)) { event.preventDefault(); event.returnValue = ''; } });
new ResizeObserver(fitPreview).observe(document.querySelector('.g-mat')!);
renderPanel(); preview();

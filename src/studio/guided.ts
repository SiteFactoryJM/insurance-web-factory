import { TEMPLATE_IDS, type SiteConfig, type PaletteId, type HeadingFont, type TemplateId } from '../types.js';
import { COPY_LIBRARY as library } from '../content/copy-library.js';
import { PALETTES, TEMPLATE_META } from '../render/design-system.js';
import { renderSitePage } from '../render/page.js';
import { escapeHtml as e } from '../utils/html.js';
import { createProject, parseProject, validateImageSource, MAX_IMAGE_BYTES, MAX_PROJECT_BYTES } from './project.js';
import type { DraftArchiveResult, ExportPhase } from './export/types.js';
import { applyCopy, applyPurpose, blankGuidedSite, guidedIssues, resetPublication, type CopyGroup } from './guided-model.js';

const bootstrap = document.getElementById('guided-bootstrap');
if (!bootstrap?.textContent) throw new Error('화면을 여는 데 필요한 정보를 찾지 못했습니다. 새로고침해 주세요.');
const example = JSON.parse(bootstrap.textContent) as SiteConfig;
let site = blankGuidedSite(example);
/** 0 디자인과 문구 · 1 실제 정보 · 2 확인하고 저장 */
const LAST_STAGE = 2;
let stage = 0, purpose = library.presets[0].id, group: CopyGroup = 'heroes', copySearch = '';
let dirty = false, remember = false, stored = false, previewTimer = 0, storageTimer = 0, revision = 0;
let device: 'desktop' | 'mobile' = 'desktop';
let scopeConfirmed = false, linksConfirmed = false, assetsConfirmed = false;
let requestedDomain = '', exporting = false, lastArchive: DraftArchiveResult | null = null, lastArchiveUrl = '', lastArchiveRevision = -1;
let projectSource: 'new'|'demo'|'imported' = 'new';
const STORAGE_KEY = 'atelier-guided-draft-v1';
const panel = document.getElementById('guided-panel')!;
const frame = document.getElementById('guided-preview') as HTMLIFrameElement;
const status = document.getElementById('guided-status')!;
const errorBox = document.getElementById('guided-errors')!;
const groups: Record<CopyGroup, string> = { heroes: '첫 화면 · 24개', intros: '담당자 소개 · 16개', services: '상담 분야 · 24개', processes: '상담 과정 · 8묶음', faqs: '자주 묻는 질문 · 30개', footers: '맨 아래 안내 · 12개' };
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
/**
 * 큰 화면 미리보기. 어느 단계에서든 열 수 있고, 닫기(✕) 또는 Esc로 빠져나옵니다.
 * 닫으면 직전에 보던 단계 화면이 그대로 남습니다.
 */
function setPreviewExpanded(expanded: boolean): void {
  const previewArea = document.querySelector<HTMLElement>('.g-preview')!;
  previewArea.dataset.expanded = String(expanded);
  document.body.classList.toggle('g-preview-open', expanded);
  document.querySelectorAll<HTMLElement>('[data-action="expand-preview"]').forEach(button => {
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? '편집으로 돌아가기' : '크게 보기';
  });
  if (expanded) document.querySelector<HTMLButtonElement>('[data-action="close-preview"]')!.focus();
  window.requestAnimationFrame(fitPreview);
}
function closePreview(): void {
  if (document.querySelector<HTMLElement>('.g-preview')!.dataset.expanded !== 'true') return;
  setPreviewExpanded(false);
  document.querySelector<HTMLButtonElement>('.g-steps [data-action="expand-preview"]')?.focus();
}
/**
 * 미리보기가 어떤 이유로든 다른 주소로 넘어가면 그 문서는 다른 출처가 되어
 * 읽는 순간 SecurityError가 납니다. 그대로 두면 제작 화면 전체가 멈추므로
 * 접근은 모두 감싸고, 실패하면 처음부터 다시 그립니다.
 */
function readScroll(): number {
  try { return frame.contentWindow?.scrollY || 0; } catch { return 0; }
}
function settlePreview(section: string | undefined, scroll: number): void {
  fitPreview();
  try {
    const target = section ? frame.contentDocument?.getElementById(section) : null;
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    else frame.contentWindow?.scrollTo(0, scroll);
  } catch { /* 다른 출처 문서면 위치만 포기하고 화면은 유지합니다. */ }
}
/**
 * 첫 미리보기만 srcdoc으로 로드합니다. 이후에는 같은 Document 안에서 head/body를
 * 교체합니다. 편집할 때마다 iframe navigation을 반복하면 빠른 레이아웃 비교 중
 * 접근성 도구와 브라우저가 이전 execution context를 붙잡을 수 있기 때문입니다.
 * Document 자체를 유지하면 기존 preview용 document event listener도 그대로 살아 있습니다.
 */
function patchPreviewDocument(html: string, section: string | undefined, scroll: number): boolean {
  try {
    const current = frame.contentDocument;
    if (!current?.body || current.body.dataset.studioPreview !== 'true') return false;
    const next = new DOMParser().parseFromString(html, 'text/html');
    next.body.querySelectorAll('script').forEach(script => script.remove());
    const nextHead = Array.from(next.head.childNodes).map(node => current.importNode(node, true));
    current.head.replaceChildren(...nextHead);
    current.body.replaceWith(current.importNode(next.body, true));
    current.documentElement.lang = next.documentElement.lang || 'ko';
    const nextStyle = next.documentElement.getAttribute('style');
    if (nextStyle) current.documentElement.setAttribute('style', nextStyle);
    else current.documentElement.removeAttribute('style');
    settlePreview(section, scroll);
    return true;
  } catch {
    return false;
  }
}
function preview(section?: string): void {
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => {
    const scroll = readScroll();
    const html = renderSitePage(site, new Request(`${location.origin}/`), {studioPreview: true});
    if (patchPreviewDocument(html, section, scroll)) return;
    frame.onload = () => settlePreview(section, scroll);
    frame.srcdoc = html;
  }, 160);
}
function changed(section?: string): void {
  resetPublication(site);
  revision += 1; dirty = true; stored = false; scopeConfirmed = linksConfirmed = assetsConfirmed = false;
  panel.querySelectorAll<HTMLInputElement>('[data-confirm]').forEach(input => { input.checked = false; });
  clearError(); preview(section);
  if (remember) { window.clearTimeout(storageTimer); storageTimer = window.setTimeout(saveDraft, 500); }
}
function textField(label: string, name: string, value: string | undefined, max: number, placeholder = '', type = 'text'): string {
  return `<label class="g-field"><span>${e(label)}</span><input name="${name}" type="${type}" value="${e(value || '')}" maxlength="${max}" placeholder="${e(placeholder)}" autocomplete="off"></label>`;
}
function renderPanel(): void {
  clearError();
  document.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(button => {
    const current = Number(button.dataset.stage) === stage;
    button.setAttribute('aria-pressed', String(current));
    if (current) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');
  });
  const previous = document.querySelector<HTMLButtonElement>('[data-action=previous]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-action=next]')!;
  previous.hidden = stage === 0; next.hidden = stage === LAST_STAGE;
  next.textContent = stage === 0 ? '다음: 실제 정보' : '다음: 확인하고 저장';
  if (stage === 0) {
    pendingIds = ids(group);
    panel.innerHTML = `<p class="g-kicker">01 · 배치와 색상</p><h2 tabindex="-1">배치와 색상을 비교하세요.</h2><p class="g-muted">담당자 정보와 고른 문구는 그대로 두고, 읽는 순서와 분위기만 바꿉니다. 오른쪽 고객 화면에서 바로 비교할 수 있습니다.</p><h3>01 · 색상 6가지</h3><div class="g-palette-grid">${Object.entries(PALETTES).map(([id,p]) => `<button type="button" class="g-palette-choice" data-palette="${id}" aria-pressed="${site.palette === id}"><span class="g-palette-swatch" style="background:${p.accent}" aria-hidden="true"></span><span>${e(p.name)}</span></button>`).join('')}</div><h3>02 · 화면 구성 5가지</h3><div class="g-layout-grid">${TEMPLATE_IDS.map(id => `<button type="button" class="g-layout-choice" data-template="${id}" aria-pressed="${site.template === id}"><span class="g-layout-diagram g-layout-${id}" aria-hidden="true"><i></i><i></i><i></i></span><strong>${e(TEMPLATE_META[id].name)}</strong><small>${e(TEMPLATE_META[id].description)}</small></button>`).join('')}</div><label class="g-field"><span>제목 글꼴</span><select id="guided-font"><option value="noto-sans-kr"${site.headingFont === 'noto-sans-kr' ? ' selected' : ''}>기본 고딕</option><option value="noto-serif-kr"${site.headingFont === 'noto-serif-kr' ? ' selected' : ''}>차분한 명조</option><option value="pretendard"${site.headingFont === 'pretendard' ? ' selected' : ''}>단정한 고딕</option>${!['pretendard','noto-serif-kr','noto-sans-kr'].includes(site.headingFont) ? `<option value="${e(site.headingFont)}" selected>불러온 글꼴 그대로</option>` : ''}</select></label><details class="g-advanced-note"><summary>상담 목적에 맞춘 추천으로 한 번에 채우기</summary><p>추천을 고르면 구성·색상과 여러 문구가 한꺼번에 바뀝니다. 이름·연락처는 바뀌지 않습니다.</p><div class="g-purpose-grid">${library.presets.map(p => `<button type="button" class="g-purpose" data-purpose="${p.id}" aria-pressed="${purpose === p.id}"><strong>${e(p.label)}</strong><span>${e(p.audience)}</span></button>`).join('')}</div></details><div class="g-section"><h3>문구 고르기</h3><p class="g-muted">첫 화면부터 맨 아래 안내까지 ${Object.values(groups).length}개 묶음의 문장을 그대로 보고 고릅니다. 고른 문구는 구성이나 색상을 바꿔도 남습니다.</p><div class="g-copy-search"><label class="g-field"><span>바꿀 부분</span><select id="copy-group">${Object.entries(groups).map(([id,label]) => `<option value="${id}"${id === group ? ' selected' : ''}>${e(label)}</option>`).join('')}</select></label><label class="g-field"><span>문구 찾기</span><input id="copy-search" type="search" value="${e(copySearch)}" placeholder="예: 가족, 갱신, 상담 시간"></label><p id="choice-help" class="g-muted"></p></div><div id="copy-options" class="g-choice-list"></div><button type="button" class="g-btn g-btn-primary" data-action="apply-copies"${['services','faqs'].includes(group) ? '' : ' hidden'}>고른 문구 적용</button></div><p class="g-note">추천 문구는 그대로 쓰라는 뜻이 아닙니다. 실제로 상담하는 범위와 소속 기준에 맞는 문장만 남겨 주세요.</p>`;
    renderOptions(copySearch);
  } else if (stage === 1) {
    panel.innerHTML = `<p class="g-kicker">02 · 실제 정보</p><h2 tabindex="-1">실제 정보를 확인해 주세요.</h2><p class="g-muted">고객에게 보이는 정보만 입력합니다. 새로 시작할 때 예시 담당자 정보가 저절로 들어가지는 않습니다.</p><button class="g-btn" type="button" data-action="example-profile">예시 담당자 정보로 채워 보기</button><div class="g-row">${textField('담당자 이름','name',site.agent.name,60,'홍길동')}${textField('직함','title',site.agent.title,80,'보험설계사')}</div>${textField('소속','company',site.agent.company,120,'실제 보험사·GA·지사명')}<div class="g-row">${textField('전화번호','phone',site.contact.phone,32,'010-0000-0000','tel')}${textField('상담 시간','hours',site.contact.availableHours,100,'평일 09:00–18:00')}</div><div class="g-row">${textField('이메일 · 선택','email',site.contact.email,254,'name@example.com','email')}${textField('팩스 · 선택','fax',site.contact.fax,32,'02-0000-0000','tel')}</div>${textField('카카오톡 오픈채팅 주소','kakao',site.contact.kakaoUrl,2048,'https://open.kakao.com/o/초대코드','url')}${textField('쓰고 싶은 주소 · 선택','requestedDomain',requestedDomain,253,'agent.example.com')}<p class="g-muted">쓰고 싶은 주소는 적어 두는 칸입니다. 여기에 적는다고 주소가 만들어지지는 않습니다.</p><label class="g-field"><span>프로필 사진</span><input id="guided-photo" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG·PNG·WebP, 3MB 이하. 직접 찍었거나 사용해도 되는 사진만 올려 주세요.</small></label><details class="g-advanced-note"><summary>더 적을 내용 · 등록번호·주소·지사</summary>${textField('지사명','branch',site.agent.branch,120)}${textField('설계사 등록번호','registration',site.agent.registrationNumber,80)}${textField('사무실 주소','address',site.contact.officeAddress,240)}</details>`;
  } else {
    const stale = lastArchive && revision !== lastArchiveRevision;
    const optionalContactSummary = `${site.contact.email ? `<br>이메일 ${e(site.contact.email)}` : ''}${site.contact.fax ? `<br>팩스 ${e(site.contact.fax)}` : ''}`;
    panel.innerHTML = `<p class="g-kicker">03 · 확인하고 저장</p><h2 tabindex="-1">내보내기 전에 한 번 더 확인하세요.</h2><dl class="g-summary"><dt>화면 구성</dt><dd>${e(TEMPLATE_META[site.template].name)} · ${e(PALETTES[site.palette || 'navy'].name)}</dd><dt>담당자와 연락</dt><dd>${e(site.agent.name || '아직 비어 있음')} · ${e(site.agent.company || '아직 비어 있음')}<br>${e(site.contact.phone || '아직 비어 있음')} · ${e(site.contact.availableHours || '아직 비어 있음')}${optionalContactSummary}</dd><dt>고른 문구</dt><dd>상담 분야 ${site.specialties.length}개 · 상담 과정 ${site.process.length}단계 · 자주 묻는 질문 ${site.faqs.length}개</dd><dt>지금 상태</dt><dd>아직 공개되지 않은 작업본입니다. 저절로 공개되거나 전송되지 않습니다.</dd></dl><section class="g-handoff"><h3>먼저 저장하고, 완성된 화면으로 확인해 보세요.</h3><p>지금까지 입력한 이름·연락처·사진이 그대로 들어간 실제 크기 화면이 열립니다. 고객이 보게 될 모습 그대로입니다.</p><button type="button" class="g-btn g-btn-primary" data-action="save-demo">초안 저장 및 시연</button></section><label class="g-check"><input type="checkbox" data-confirm="scope"${scopeConfirmed ? ' checked' : ''}><span>고른 문구가 실제로 상담하는 범위와 맞는지 확인했습니다.</span></label><label class="g-check"><input type="checkbox" data-confirm="links"${linksConfirmed ? ' checked' : ''}><span>전화번호와 카카오톡 주소가 어디로 연결되는지 확인했습니다.</span></label><label class="g-check"><input type="checkbox" data-confirm="assets"${assetsConfirmed ? ' checked' : ''}><span>사진과 로고를 써도 되는지 확인했습니다.</span></label><section class="g-handoff"><h3>마지막으로 파일로 내보내기</h3><p>세 가지 확인을 마치면 압축 파일(ZIP) 하나가 내려받아집니다. 안에는 인쇄해서 볼 수 있는 화면과, 나중에 이어서 고칠 수 있는 작업 파일이 들어 있습니다.</p><p><strong>내보내도 페이지가 공개되거나 누군가에게 전송되지 않습니다.</strong> 실제로 올리기 전에는 소속 조직의 확인이 필요합니다.</p><p>파일에는 이름·연락처·사진이 들어 있습니다. 전달할 사람에게만 보내 주세요.</p><button type="button" class="g-btn g-btn-primary g-save" data-action="save-zip"${exporting ? ' disabled' : ''}>${exporting ? '파일 만드는 중…' : '파일로 내보내기'}</button></section>${lastArchive ? `<section class="g-result"><p class="g-kicker">파일이 준비되었습니다.</p><h3>내려받기 폴더를 확인해 주세요.</h3><p>압축을 풀지 말고 그대로 전달하시면 됩니다. 안에는 인쇄해서 볼 수 있는 화면과, 나중에 이어서 고칠 수 있는 작업 파일이 들어 있습니다.</p>${stale ? '<p class="g-warning">파일을 만든 뒤에 내용을 고쳤습니다. 지금 내용으로 다시 내보내 주세요.</p>' : ''}<button type="button" class="g-btn" data-action="redownload">다시 내려받기</button></section>` : ''}<p class="g-note">여기의 확인란은 작성자 본인의 점검 기록입니다. 승인 절차를 대신하지 않습니다.</p>`;
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
  document.getElementById('choice-help')!.textContent = `${rows.length}개 보임 · ${multi ? `${group === 'services' ? '3~6' : '2~8'}개를 고른 뒤 적용 · 지금 ${pendingIds.length}개 고름` : '하나를 고르면 바로 반영됩니다.'}`;
  list.innerHTML = rows.length ? rows.map(item => `<label class="g-choice"><input type="${multi ? 'checkbox' : 'radio'}" name="copy-choice" value="${e(item.id)}"${pendingIds.includes(item.id) ? ' checked' : ''}><span>${recommendation.includes(item.id) ? '<span class="g-tag">추천</span>' : ''}<strong>${e(item.label)}</strong><p>${e(choiceBody(item))}</p></span></label>`).join('') : '<p>찾는 문구가 없습니다. 다른 낱말로 찾아보세요.</p>';
}
function storageProject(): string {
  const copy = structuredClone(site);
  const emptyFields: string[] = [];
  for (const [key,fallback] of [['name','미입력'],['company','미입력']] as const) if (!copy.agent[key]) { emptyFields.push(key); copy.agent[key] = fallback; }
  if (!copy.contact.phone) { emptyFields.push('phone'); copy.contact.phone = '010-0000-0000'; }
  if (!copy.contact.availableHours) { emptyFields.push('hours'); copy.contact.availableHours = '미입력'; }
  return JSON.stringify({ format: 'atelier-guided-local-v1', emptyFields, project: createProject(copy,{purposeId:purpose || null,requestedDomain:requestedDomain || null,source:projectSource}) });
}
function saveDraft(): void {
  try { localStorage.setItem(STORAGE_KEY, storageProject()); stored = true; message('이 컴퓨터에 지금까지 만든 내용을 보관했습니다. 공개되거나 어디로 전송되지 않습니다.'); }
  catch { stored = false; message('보관하지 못했습니다. 저장 공간이 부족할 수 있으니 파일로 내보내기를 먼저 해 주세요.'); }
}
function restoreDraft(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) throw new Error('이 컴퓨터에 보관해 둔 내용이 없습니다.');
  if (new TextEncoder().encode(raw).byteLength > MAX_PROJECT_BYTES + 2048) throw new Error('보관해 둔 내용이 너무 큽니다. 사진 크기를 줄여 주세요.');
  const data = JSON.parse(raw);
  if (data.format !== 'atelier-guided-local-v1' || !Array.isArray(data.emptyFields) || !data.emptyFields.every((v:unknown) => typeof v === 'string' && ['name','company','phone','hours'].includes(v))) throw new Error('보관해 둔 내용을 읽을 수 없습니다.');
  const restoredProject = parseProject(data.project);
  const restored = restoredProject.site;
  if (data.emptyFields.includes('name')) restored.agent.name = '';
  if (data.emptyFields.includes('company')) restored.agent.company = '';
  if (data.emptyFields.includes('phone')) restored.contact.phone = '';
  if (data.emptyFields.includes('hours')) restored.contact.availableHours = '';
  site = resetPublication(restored); purpose = restoredProject.editor.purposeId || ''; requestedDomain = restoredProject.handoff.requestedDomain || ''; projectSource = restoredProject.editor.source; pendingIds = ids(group);
  scopeConfirmed = linksConfirmed = assetsConfirmed = false; dirty = true;
  renderPanel(); preview(); message('보관해 둔 내용을 되돌렸습니다. 문구와 연락처를 한 번 확인해 주세요.');
}
const phaseMessages: Record<ExportPhase,string> = {
  validating:'입력한 내용을 확인하고 있습니다.', 'preparing-assets':'사진과 글꼴을 준비하고 있습니다.',
  'rendering-pdf':'PC와 휴대폰 화면을 인쇄용으로 만들고 있습니다.', packaging:'파일 하나로 묶고 있습니다.',
  ready:'파일이 준비되었습니다.', failed:'파일을 만들지 못했습니다. 지금까지 만든 내용은 그대로 남아 있습니다.',
};
function triggerArchiveDownload(): void {
  if (!lastArchive) return;
  if (!lastArchiveUrl) lastArchiveUrl = URL.createObjectURL(lastArchive.blob);
  const anchor = document.createElement('a'); anchor.href = lastArchiveUrl; anchor.download = lastArchive.fileName;
  document.body.append(anchor); anchor.click(); anchor.remove();
  message('내려받기를 시작했습니다. 브라우저의 다운로드 목록에서 파일을 확인해 주세요.');
}
/**
 * 초안 저장 및 시연. 지금까지 입력한 값 그대로 큰 화면을 열어 보여 주고,
 * 이 컴퓨터에 작업 내용을 남겨 둡니다. 빠진 항목이 있으면 함께 알려 줍니다.
 */
function saveAndDemo(): void {
  remember = true;
  const toggle = document.getElementById('remember-draft') as HTMLInputElement | null;
  if (toggle) toggle.checked = true;
  saveDraft();
  preview('home');
  setPreviewExpanded(true);
  const issues = guidedIssues(site);
  if (issues.length) { errorBox.textContent = `아래 내용이 아직 비어 있습니다. 큰 화면에서 어떻게 보이는지 확인한 뒤 채워 주세요.\n${issues.join('\n')}`; return; }
  clearError();
  message('지금 입력한 내용 그대로 큰 화면에 띄웠습니다. 닫으려면 오른쪽 위 ✕를 누르세요.');
}
async function saveArchive(): Promise<void> {
  if (exporting) return;
  const issues = guidedIssues(site);
  if (!scopeConfirmed || !linksConfirmed || !assetsConfirmed) issues.push('마지막 단계의 확인란 세 개를 모두 확인해 주세요.');
  if (['services','faqs'].includes(group) && JSON.stringify(pendingIds) !== JSON.stringify(ids(group))) issues.push('아직 적용하지 않은 문구 선택이 있습니다. 적용하거나 되돌린 뒤 내보내 주세요.');
  if (issues.length) { stage = LAST_STAGE; renderPanel(); throw new Error(issues.join('\n')); }
  const startRevision = revision;
  exporting = true; renderPanel();
  try {
    const { createDraftArchive } = await import('./export/archive.js');
    const result = await createDraftArchive(site, { purposeId:purpose || null, requestedDomain:requestedDomain || null, source:projectSource, onPhase:phase => message(phaseMessages[phase]) });
    if (lastArchiveUrl) URL.revokeObjectURL(lastArchiveUrl);
    lastArchive = result; lastArchiveUrl = ''; lastArchiveRevision = startRevision;
    if (revision === startRevision) dirty = false;
    triggerArchiveDownload();
  } catch (error) {
    message(phaseMessages.failed);
    throw error;
  } finally {
    exporting = false; renderPanel();
  }
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

document.addEventListener('click', async event => {
  const target = event.target instanceof Element ? event.target.closest<HTMLElement>('button,[data-action]') : null;
  if (!target) return;
  try {
    if (target.dataset.stage !== undefined) { stage = Number(target.dataset.stage); renderPanel(); panel.querySelector<HTMLElement>('h2')?.focus(); }
    if (target.dataset.purpose) {
      if (dirty && !window.confirm('이름·연락처는 그대로 두고, 문구와 화면 구성을 추천대로 바꿀까요?')) return;
      const preset = library.presets.find(p => p.id === target.dataset.purpose)!;
      site = applyPurpose(site,preset); purpose = preset.id; changed('home'); renderPanel();
      message(`${preset.label} 구성을 적용했습니다. 이름·소속·연락처는 변경하지 않았습니다.`);
    }
    if (target.dataset.template) {
      site.template = target.dataset.template as TemplateId;
      delete site.design; // Resolve the new layout's hero, patterns and section order instead of retaining the previous preset.
      delete site.templateContent;
      purpose = '';
      changed('home'); renderPanel();
      message(`${TEMPLATE_META[site.template].name} 구성으로 바꿨습니다. 첫 화면·순서·보여 주는 방식이 바뀌고 고른 문구·색상·담당자 정보는 그대로입니다.`);
    }
    if (target.dataset.palette) { site.palette = target.dataset.palette as PaletteId; purpose = ''; changed('home'); renderPanel(); message('색상을 바꿨습니다. 화면 구성과 고른 문구, 담당자 정보는 그대로입니다.'); }
    if (target.dataset.device) { device = target.dataset.device as 'desktop'|'mobile'; document.querySelectorAll<HTMLElement>('[data-device]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.device === device))); fitPreview(); }
    if (target.dataset.view) { document.getElementById('guided-layout')!.dataset.view = target.dataset.view; document.querySelectorAll<HTMLElement>('[data-view]:not(#guided-layout)').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.view === target.dataset.view))); fitPreview(); }
    switch (target.dataset.action) {
      case 'expand-preview': setPreviewExpanded(document.querySelector<HTMLElement>('.g-preview')!.dataset.expanded !== 'true'); break;
      case 'close-preview': closePreview(); break;
      case 'next': stage = Math.min(stage+1,LAST_STAGE); renderPanel(); panel.querySelector<HTMLElement>('h2')?.focus(); break;
      case 'previous': stage = Math.max(stage-1,0); renderPanel(); break;
      case 'apply-copies': site = applyCopy(site,group,pendingIds); changed(group === 'services' ? 'specialties' : 'faq'); message('고른 문구를 반영했습니다.'); break;
      case 'save-demo': saveAndDemo(); break;
      case 'save-zip': await saveArchive(); break;
      case 'redownload': triggerArchiveDownload(); break;
      case 'import': (document.getElementById('guided-file') as HTMLInputElement).click(); break;
      case 'print': printReview(); break;
      case 'restore': if (!dirty || window.confirm('지금 만들던 내용을 보관해 둔 내용으로 바꿀까요?')) restoreDraft(); break;
      case 'clear': localStorage.removeItem(STORAGE_KEY); remember = stored = false; window.clearTimeout(storageTimer); (document.getElementById('remember-draft') as HTMLInputElement).checked = false; message('이 컴퓨터에 보관해 둔 내용을 지웠습니다. 지금 화면은 그대로입니다.'); break;
      case 'example-profile':
        if (!window.confirm('예시 담당자의 실제 정보입니다. 지금 입력한 이름·연락처를 이 정보로 바꿀까요?')) return;
        site.agent = structuredClone(example.agent); site.contact = structuredClone(example.contact); projectSource = 'demo'; changed(); renderPanel(); message('예시 담당자 정보를 넣었습니다. 미리보기에서는 연락 버튼이 열리지 않습니다.'); break;
    }
  } catch(error) { showError(error); }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closePreview(); });
document.addEventListener('input', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.id === 'copy-search') { copySearch = input.value; renderOptions(copySearch); return; }
  const setters: Record<string,(value:string)=>void> = {
    name: value => { site.agent.name = value; }, title: value => { site.agent.title = value; }, company: value => { site.agent.company = value; },
    phone: value => { site.contact.phone = value; }, email: value => { site.contact.email = value; }, fax: value => { site.contact.fax = value; }, kakao: value => { site.contact.kakaoUrl = value; }, hours: value => { site.contact.availableHours = value; },
    branch: value => { site.agent.branch = value; }, registration: value => { site.agent.registrationNumber = value; }, address: value => { site.contact.officeAddress = value; site.sections.location = Boolean(value.trim()); },
    requestedDomain: value => { requestedDomain = value; },
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
      if (['services','faqs'].includes(group)) { pendingIds = input.checked ? [...pendingIds.filter(id => id !== input.value),input.value] : pendingIds.filter(id => id !== input.value); document.getElementById('choice-help')!.textContent = `${pendingIds.length}개 골랐습니다. 아래 \'고른 문구 적용\'을 눌러 주세요.`; }
      else { site = applyCopy(site,group,[input.value]); pendingIds = [input.value]; changed(group === 'heroes' ? 'home' : group === 'intros' ? 'about' : group === 'processes' ? 'process' : 'footer'); message('선택한 문구를 적용했습니다.'); }
    }
    if (input instanceof HTMLInputElement && input.dataset.confirm) {
      if (input.dataset.confirm === 'scope') scopeConfirmed = input.checked;
      if (input.dataset.confirm === 'links') linksConfirmed = input.checked;
      if (input.dataset.confirm === 'assets') assetsConfirmed = input.checked;
    }
    if (input instanceof HTMLInputElement && input.id === 'remember-draft') {
      remember = input.checked; window.clearTimeout(storageTimer);
      if (remember) saveDraft(); else { localStorage.removeItem(STORAGE_KEY); stored = false; message('이 컴퓨터에 보관하지 않도록 바꾸고, 보관해 둔 내용을 지웠습니다.'); }
    }
    if (input instanceof HTMLInputElement && input.id === 'guided-file' && input.files?.[0]) {
      const file = input.files[0]; input.value = '';
      if (file.size > MAX_PROJECT_BYTES) throw new Error('작업 파일은 8MB 이하여야 합니다.');
      const importedProject = parseProject(await file.text());
      const imported = importedProject.site;
      if (dirty && !window.confirm('현재 편집 내용을 선택한 파일로 바꿀까요?')) return;
      site = resetPublication(imported); purpose = importedProject.editor.purposeId || ''; requestedDomain = importedProject.handoff.requestedDomain || ''; projectSource = 'imported'; changed(); renderPanel(); message('저장해 둔 작업을 불러왔습니다. 문구·사진·구성·색상이 그대로 돌아왔습니다.');
    }
    if (input instanceof HTMLInputElement && input.id === 'guided-photo' && input.files?.[0]) {
      const file = input.files[0]; input.value = '';
      if (file.size > MAX_IMAGE_BYTES || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('JPG·PNG·WebP, 3MB 이하 사진을 선택해 주세요.');
      const data = await new Promise<string>((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('사진을 읽지 못했습니다.')); reader.readAsDataURL(file); });
      const invalid = validateImageSource(data); if (invalid) throw new Error(invalid);
      site.agent.profileImage = data; changed('home'); message('사진을 넣었습니다. 이 사진은 어디로도 올라가지 않습니다.');
    }
  } catch(error) { showError(error); }
});
window.addEventListener('beforeunload', event => { if (dirty && !(remember && stored)) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('pagehide', () => { if (lastArchiveUrl) URL.revokeObjectURL(lastArchiveUrl); });
new ResizeObserver(fitPreview).observe(document.querySelector('.g-mat')!);
// 미리보기가 다른 주소로 넘어간 흔적이 보이면 지금 내용으로 다시 그립니다.
frame.addEventListener('load', () => {
  if (!frame.srcdoc) return; // 아직 한 번도 그리지 않은 빈 프레임.
  let ours = false;
  try { ours = frame.contentDocument?.body?.dataset.studioPreview === 'true'; } catch { ours = false; }
  if (!ours) { preview(); message('미리보기를 다시 불러왔습니다. 미리보기 안에서는 링크가 열리지 않습니다.'); }
});
renderPanel(); preview();

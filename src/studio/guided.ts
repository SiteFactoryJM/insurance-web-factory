import { TEMPLATE_IDS, type SiteConfig, type PaletteId, type HeadingFont, type TemplateId } from '../types.js';
import { COPY_LIBRARY as library } from '../content/copy-library.js';
import { PALETTES, TEMPLATE_META } from '../render/design-system.js';
import { renderSitePage } from '../render/page.js';
import { escapeHtml as e } from '../utils/html.js';
import { createProject, parseProject, validateImageSource, MAX_IMAGE_BYTES, MAX_PROJECT_BYTES } from './project.js';
import type { DraftArchiveResult, ExportPhase } from './export/types.js';
import { applyCopy, applyPurpose, blankGuidedSite, guidedIssues, resetPublication, type CopyGroup } from './guided-model.js';

const bootstrap = document.getElementById('guided-bootstrap');
if (!bootstrap?.textContent) throw new Error('제작 도구의 기본 정보를 찾을 수 없습니다.');
const example = JSON.parse(bootstrap.textContent) as SiteConfig;
let site = blankGuidedSite(example);
let stage = 0, purpose = library.presets[0].id, group: CopyGroup = 'heroes';
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
function setPreviewExpanded(expanded: boolean): void {
  const previewArea = document.querySelector<HTMLElement>('.g-preview')!;
  const button = document.querySelector<HTMLButtonElement>('[data-action="expand-preview"]')!;
  previewArea.dataset.expanded = String(expanded);
  document.body.classList.toggle('g-preview-open', expanded);
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? '편집으로 돌아가기' : '크게 보기';
  window.requestAnimationFrame(fitPreview);
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
  previous.hidden = stage === 0; next.hidden = stage === 3;
  next.textContent = stage === 0 ? '다음: 문구 선택' : stage === 1 ? '다음: 실제 정보' : '다음: 검토·저장';
  if (stage === 0) {
    panel.innerHTML = `<p class="g-kicker">01 · 배치와 색상</p><h2 tabindex="-1">배치와 색상을 비교하세요.</h2><p class="g-muted">배치와 색상은 독립적으로 선택됩니다. 추천 구성은 문구까지 함께 바꾸지만 실제 담당자 정보는 유지합니다.</p><h3>배치 5종</h3><div class="g-layout-grid">${TEMPLATE_IDS.map(id => `<button type="button" class="g-layout-choice" data-template="${id}" aria-pressed="${site.template === id}"><span class="g-layout-diagram g-layout-${id}" aria-hidden="true"><i></i><i></i><i></i></span><strong>${e(TEMPLATE_META[id].name)}</strong><small>${e(TEMPLATE_META[id].description)}</small></button>`).join('')}</div><h3>색상 6종</h3><div class="g-palette-grid">${Object.entries(PALETTES).map(([id,p]) => `<button type="button" class="g-palette-choice" data-palette="${id}" aria-pressed="${site.palette === id}"><span class="g-palette-swatch" style="background:${p.accent}" aria-hidden="true"></span><span>${e(p.name)}</span></button>`).join('')}</div><details class="g-advanced-note"><summary>목적별 추천 구성으로 시작</summary><p>추천 구성을 적용하면 배치·색상과 여러 문구 묶음이 함께 바뀝니다.</p><div class="g-purpose-grid">${library.presets.map(p => `<button type="button" class="g-purpose" data-purpose="${p.id}" aria-pressed="${purpose === p.id}"><strong>${e(p.label)}</strong><span>${e(p.audience)}</span></button>`).join('')}</div></details><label class="g-field"><span>제목 서체</span><select id="guided-font"><option value="noto-sans-kr"${site.headingFont === 'noto-sans-kr' ? ' selected' : ''}>Noto Sans KR · 기본</option><option value="noto-serif-kr"${site.headingFont === 'noto-serif-kr' ? ' selected' : ''}>차분한 명조</option><option value="pretendard"${site.headingFont === 'pretendard' ? ' selected' : ''}>단정한 고딕</option>${!['pretendard','noto-serif-kr','noto-sans-kr'].includes(site.headingFont) ? `<option value="${e(site.headingFont)}" selected>불러온 서체 유지</option>` : ''}</select></label><p class="g-note">추천 구성은 검토 전 초안입니다. 실제 취급 범위와 조직 기준에 맞는 문구만 사용하세요.</p>`;
  } else if (stage === 1) {
    pendingIds = ids(group);
    panel.innerHTML = `<p class="g-kicker">02 · 문구 선택</p><h2 tabindex="-1">작성 대신 선택하세요.</h2><p class="g-muted">첫 화면부터 하단 안내까지 ${Object.values(groups).length}개 그룹의 전체 문장을 확인하고 선택할 수 있습니다.</p><div class="g-copy-search"><label class="g-field"><span>바꿀 문구 묶음</span><select id="copy-group">${Object.entries(groups).map(([id,label]) => `<option value="${id}"${id === group ? ' selected' : ''}>${e(label)}</option>`).join('')}</select></label><label class="g-field"><span>문구 검색</span><input id="copy-search" type="search" placeholder="예: 가족, 갱신, 상담 시간"></label><p id="choice-help" class="g-muted"></p></div><div id="copy-options" class="g-choice-list"></div><button type="button" class="g-btn g-btn-primary" data-action="apply-copies"${['services','faqs'].includes(group) ? '' : ' hidden'}>선택한 문구 적용</button>`;
    renderOptions('');
  } else if (stage === 2) {
    panel.innerHTML = `<p class="g-kicker">03 · 실제 정보</p><h2 tabindex="-1">실제 정보를 확인해 주세요.</h2><p class="g-muted">고객에게 표시될 정보만 입력합니다. 새 프로젝트에는 데모 담당자 정보가 자동으로 들어가지 않습니다.</p><button class="g-btn" type="button" data-action="example-profile">데모 담당자 정보로 확인하기</button><div class="g-row">${textField('담당자 이름','name',site.agent.name,60,'홍길동')}${textField('직함','title',site.agent.title,80,'보험설계사')}</div>${textField('소속','company',site.agent.company,120,'실제 보험사·GA·지사명')}<div class="g-row">${textField('전화번호','phone',site.contact.phone,32,'010-0000-0000','tel')}${textField('상담 시간','hours',site.contact.availableHours,100,'평일 09:00–18:00')}</div>${textField('카카오톡 오픈채팅 주소','kakao',site.contact.kakaoUrl,2048,'https://open.kakao.com/o/초대코드','url')}${textField('희망 도메인 · 선택','requestedDomain',requestedDomain,253,'agent.example.com')}<p class="g-muted">희망 도메인은 구매·연결 여부를 확인하지 않으며 실제 공개 주소에 자동 반영되지 않습니다.</p><label class="g-field"><span>프로필 사진</span><input id="guided-photo" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG·PNG·WebP, 3MB 이하. 직접 촬영했거나 게시 권한을 가진 사진만 사용하세요.</small></label><details class="g-advanced-note"><summary>추가 정보 · 등록번호·주소·지사</summary>${textField('지사명','branch',site.agent.branch,120)}${textField('설계사 등록번호','registration',site.agent.registrationNumber,80)}${textField('사무실 주소','address',site.contact.officeAddress,240)}</details>`;
  } else {
    const stale = lastArchive && revision !== lastArchiveRevision;
    panel.innerHTML = `<p class="g-kicker">04 · 검토·초안 저장</p><h2 tabindex="-1">공개 전에 한 번 더 확인하세요.</h2><dl class="g-summary"><dt>페이지 구성</dt><dd>${e(TEMPLATE_META[site.template].name)} · ${e(PALETTES[site.palette || 'navy'].name)}</dd><dt>담당자와 연락</dt><dd>${e(site.agent.name || '미입력')} · ${e(site.agent.company || '미입력')}<br>${e(site.contact.phone || '미입력')} · ${e(site.contact.availableHours || '미입력')}</dd><dt>포함 문구</dt><dd>상담 분야 ${site.specialties.length}개 · 상담 과정 ${site.process.length}단계 · FAQ ${site.faqs.length}개</dd><dt>상태</dt><dd>검토용 초안 · 검색 비노출 · 자동 게시/전송 없음</dd></dl><label class="g-check"><input type="checkbox" data-confirm="scope"${scopeConfirmed ? ' checked' : ''}><span>선택한 문구가 실제 상담 범위와 맞는지 확인했습니다.</span></label><label class="g-check"><input type="checkbox" data-confirm="links"${linksConfirmed ? ' checked' : ''}><span>전화번호와 오픈채팅 주소의 연결 대상을 확인했습니다.</span></label><label class="g-check"><input type="checkbox" data-confirm="assets"${assetsConfirmed ? ' checked' : ''}><span>사진·로고의 사용 권한을 확인했습니다.</span></label><section class="g-handoff"><h3>초안을 저장한 뒤 제작 담당자에게 전달해 주세요.</h3><p>초안을 저장하면 검토용 PDF와 수정·제작용 JSON이 하나의 ZIP 파일로 다운로드됩니다. 다운로드한 ZIP 파일을 압축을 풀지 말고 제작 담당자에게 전달해 주세요.</p><p><strong>저장만으로 담당자에게 전송되거나 사이트가 공개되지는 않습니다.</strong> 실제 게시 전에는 내용과 사진 사용 권한, 소속 조직의 검토가 필요합니다.</p><p>파일에는 이름·연락처·사진 등 입력한 정보가 포함될 수 있습니다. 지정된 제작 담당자에게만 전달해 주세요.</p><button type="button" class="g-btn g-btn-primary g-save" data-action="save-zip"${exporting ? ' disabled' : ''}>${exporting ? '초안 ZIP 만드는 중…' : '초안 저장 · ZIP'}</button></section>${lastArchive ? `<section class="g-result"><p class="g-kicker">전달용 초안 ZIP이 준비되었습니다.</p><h3>${e(lastArchive.fileName)}</h3><p>ZIP 안에는 디자인과 문구를 확인할 PDF, 내용을 다시 불러와 수정할 JSON이 들어 있습니다. ZIP 파일 그대로 제작 담당자에게 전달해 주세요.</p><dl><dt>생성 시각</dt><dd>${e(new Date(lastArchive.project.savedAt).toLocaleString('ko-KR'))}</dd><dt>파일 구성</dt><dd>${e(lastArchive.pdfName)}<br>${e(lastArchive.jsonName)}</dd></dl>${stale ? '<p class="g-warning">생성 후 편집 내용이 바뀌었습니다. 현재 내용으로 새 ZIP을 저장해 주세요.</p>' : ''}<button type="button" class="g-btn" data-action="redownload">다시 다운로드</button></section>` : ''}<p class="g-note">이 확인은 광고심의나 조직 승인이 아닙니다. 제작 담당자가 게시 전 별도 검토를 진행해야 합니다.</p>`;
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
  return JSON.stringify({ format: 'atelier-guided-local-v1', emptyFields, project: createProject(copy,{purposeId:purpose || null,requestedDomain:requestedDomain || null,source:projectSource}) });
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
  const restoredProject = parseProject(data.project);
  const restored = restoredProject.site;
  if (data.emptyFields.includes('name')) restored.agent.name = '';
  if (data.emptyFields.includes('company')) restored.agent.company = '';
  if (data.emptyFields.includes('phone')) restored.contact.phone = '';
  if (data.emptyFields.includes('hours')) restored.contact.availableHours = '';
  site = resetPublication(restored); purpose = restoredProject.editor.purposeId || ''; requestedDomain = restoredProject.handoff.requestedDomain || ''; projectSource = restoredProject.editor.source; pendingIds = ids(group);
  scopeConfirmed = linksConfirmed = assetsConfirmed = false; dirty = true;
  renderPanel(); preview(); message('보관한 초안을 복원했습니다. 기존 문구와 연락처를 확인한 뒤 사용하세요.');
}
const phaseMessages: Record<ExportPhase,string> = {
  validating:'입력한 내용을 확인하고 있습니다.', 'preparing-assets':'사진과 글꼴을 준비하고 있습니다.',
  'rendering-pdf':'PC·모바일 디자인과 검토용 PDF를 만들고 있습니다.', packaging:'PDF와 JSON을 ZIP으로 묶고 있습니다.',
  ready:'전달용 초안 ZIP이 준비되었습니다.', failed:'초안 ZIP을 만들지 못했습니다. 입력 내용은 유지됩니다.',
};
function triggerArchiveDownload(): void {
  if (!lastArchive) return;
  if (!lastArchiveUrl) lastArchiveUrl = URL.createObjectURL(lastArchive.blob);
  const anchor = document.createElement('a'); anchor.href = lastArchiveUrl; anchor.download = lastArchive.fileName;
  document.body.append(anchor); anchor.click(); anchor.remove();
  message('다운로드를 시작했습니다. 브라우저의 다운로드 목록에서 파일을 확인해 주세요.');
}
async function saveArchive(): Promise<void> {
  if (exporting) return;
  const issues = guidedIssues(site);
  if (!scopeConfirmed || !linksConfirmed || !assetsConfirmed) issues.push('정보·검토 단계의 세 가지 확인란을 확인해 주세요.');
  if (['services','faqs'].includes(group) && JSON.stringify(pendingIds) !== JSON.stringify(ids(group))) issues.push('적용하지 않은 문구 선택이 있습니다. 적용하거나 되돌린 뒤 저장해 주세요.');
  if (issues.length) { stage = 3; renderPanel(); throw new Error(issues.join('\n')); }
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
      if (dirty && !window.confirm('현재 이름·연락처는 유지하고 문구와 배치를 추천 구성으로 바꿀까요?')) return;
      const preset = library.presets.find(p => p.id === target.dataset.purpose)!;
      site = applyPurpose(site,preset); purpose = preset.id; changed('home'); renderPanel();
      message(`${preset.label} 구성을 적용했습니다. 이름·소속·연락처는 변경하지 않았습니다.`);
    }
    if (target.dataset.template) { site.template = target.dataset.template as TemplateId; delete site.templateContent; purpose = ''; changed('home'); renderPanel(); message('배치를 변경했습니다. 문구·색상·실제 정보는 유지했습니다.'); }
    if (target.dataset.palette) { site.palette = target.dataset.palette as PaletteId; purpose = ''; changed('home'); renderPanel(); message('색상을 변경했습니다. 배치·문구·실제 정보는 유지했습니다.'); }
    if (target.dataset.device) { device = target.dataset.device as 'desktop'|'mobile'; document.querySelectorAll<HTMLElement>('[data-device]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.device === device))); fitPreview(); }
    if (target.dataset.view) { document.getElementById('guided-layout')!.dataset.view = target.dataset.view; document.querySelectorAll<HTMLElement>('[data-view]:not(#guided-layout)').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.view === target.dataset.view))); fitPreview(); }
    switch (target.dataset.action) {
      case 'expand-preview': setPreviewExpanded(document.querySelector<HTMLElement>('.g-preview')!.dataset.expanded !== 'true'); break;
      case 'next': stage = Math.min(stage+1,3); renderPanel(); panel.querySelector<HTMLElement>('h2')?.focus(); break;
      case 'previous': stage = Math.max(stage-1,0); renderPanel(); break;
      case 'apply-copies': site = applyCopy(site,group,pendingIds); changed(group === 'services' ? 'specialties' : 'faq'); message('선택한 문구 묶음을 적용했습니다.'); break;
      case 'save-zip': await saveArchive(); break;
      case 'redownload': triggerArchiveDownload(); break;
      case 'import': (document.getElementById('guided-file') as HTMLInputElement).click(); break;
      case 'print': printReview(); break;
      case 'restore': if (!dirty || window.confirm('현재 편집 내용을 보관한 초안으로 바꿀까요?')) restoreDraft(); break;
      case 'clear': localStorage.removeItem(STORAGE_KEY); remember = stored = false; window.clearTimeout(storageTimer); (document.getElementById('remember-draft') as HTMLInputElement).checked = false; message('이 기기에 보관한 초안을 삭제했습니다. 현재 편집 화면은 유지됩니다.'); break;
      case 'example-profile':
        if (!window.confirm('데모에 등록된 실제 담당자 정보입니다. 현재 프로필·연락처를 바꾸고 디자인을 확인할까요?')) return;
        site.agent = structuredClone(example.agent); site.contact = structuredClone(example.contact); projectSource = 'demo'; changed(); renderPanel(); message('데모 담당자 정보를 가져왔습니다. 미리보기에서는 연락 버튼이 연결되지 않습니다.'); break;
    }
  } catch(error) { showError(error); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.querySelector<HTMLElement>('.g-preview')!.dataset.expanded === 'true') {
    setPreviewExpanded(false);
    document.querySelector<HTMLButtonElement>('[data-action="expand-preview"]')!.focus();
  }
});
document.addEventListener('input', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.id === 'copy-search') { renderOptions(input.value); return; }
  const setters: Record<string,(value:string)=>void> = {
    name: value => { site.agent.name = value; }, title: value => { site.agent.title = value; }, company: value => { site.agent.company = value; },
    phone: value => { site.contact.phone = value; }, kakao: value => { site.contact.kakaoUrl = value; }, hours: value => { site.contact.availableHours = value; },
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
      const importedProject = parseProject(await file.text());
      const imported = importedProject.site;
      if (dirty && !window.confirm('현재 편집 내용을 선택한 파일로 바꿀까요?')) return;
      site = resetPublication(imported); purpose = importedProject.editor.purposeId || ''; requestedDomain = importedProject.handoff.requestedDomain || ''; projectSource = 'imported'; changed(); renderPanel(); message('제작 파일을 불러왔습니다. 사용자 문구·사진·배치·색상을 그대로 유지했습니다.');
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
window.addEventListener('pagehide', () => { if (lastArchiveUrl) URL.revokeObjectURL(lastArchiveUrl); });
new ResizeObserver(fitPreview).observe(document.querySelector('.g-mat')!);
renderPanel(); preview();

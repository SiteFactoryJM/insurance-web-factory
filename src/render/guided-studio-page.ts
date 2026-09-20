import type { SiteConfig } from '../types.js';
import { jsonForHtml } from '../utils/html.js';
import { fontStylesheetLinks } from './fonts.js';
import { COPY_CHOICE_COUNT } from '../content/copy-library.js';

/**
 * Figma S01 제작 화면을 기준으로 한 Studio shell.
 * 로직과 data-* hook은 유지하고, 1440px에서 200 / 664 / 416의 세 영역이
 * 정확히 나뉘도록 구성합니다. 768px 아래에서는 기존 안전 경계를 유지합니다.
 */
export const guidedStyles = `
:root{
  font-family:'Noto Sans KR','Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
  color:#172a3d;background:#f8f7f3;font-size:16px;line-height:1.625;
  --brand:#2d4864;--brand-hover:#1d3249;--ink:#172a3d;--muted:#526170;--canvas:#f8f7f3;
  --soft:#e8edf3;--line:#cdd6e0;--control:#788696;--surface:#fff;--danger:#ac2537;
  --radius:8px;
}
*{box-sizing:border-box}html,body{margin:0;min-height:100%}body.g-preview-open{overflow:hidden}
button,input,select{font:inherit}button,a,input,select,summary{touch-action:manipulation}
a{color:inherit;text-underline-offset:4px}button{cursor:pointer;color:inherit}button:disabled{cursor:not-allowed;opacity:.6}
button,input,select{min-height:48px}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid var(--brand);outline-offset:3px}
[hidden]{display:none!important}h1,h2,h3,p{margin-top:0}h1,h2,h3{letter-spacing:-.025em;word-break:keep-all;overflow-wrap:anywhere}
h1{font-size:2.25rem;line-height:1.39}h2{font-size:2.25rem;line-height:1.39}h3{font-size:1.375rem;line-height:1.55}
p{overflow-wrap:anywhere}.g-skip{position:absolute;left:16px;top:-100px;z-index:300;background:#fff;padding:12px 16px}.g-skip:focus{top:8px}

/* 88px Figma header */
.g-app{min-height:100vh;display:flex;flex-direction:column}
.g-top{height:88px;flex:0 0 88px;display:flex;align-items:center;justify-content:space-between;gap:32px;padding:0 48px;background:var(--surface);border-bottom:1px solid var(--line)}
.g-logo{font-size:1.375rem;line-height:34px;font-weight:700;text-decoration:none;white-space:nowrap}
.g-top-actions{display:flex;align-items:center;gap:24px;min-width:0}
.g-scope{font-size:1rem;line-height:26px;color:var(--muted);white-space:nowrap}
.g-top nav{display:flex;align-items:center;gap:16px}.g-top nav a{font-size:.9375rem}
.g-exit{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:1px solid var(--control);border-radius:var(--radius);text-decoration:none;font-weight:500}

/* 820px body; 48px sides + 200/664/416 + 32px gaps = 1440. */
.g-layout{
  width:100%;height:820px;flex:0 0 820px;display:grid;grid-template-columns:200px minmax(0,664px) minmax(0,416px);
  gap:32px;align-items:start;padding:32px 48px;background:var(--canvas);overflow:hidden
}
.g-steps{height:756px;display:flex;flex-direction:column;gap:16px;min-width:0}
.g-step-label{margin:0 0 0;font-size:1rem;line-height:24px;color:var(--muted);font-weight:500}
.g-steps button{
  width:100%;min-height:56px;padding:0 18px;border:1px solid var(--control);background:var(--surface);
  border-radius:var(--radius);text-align:left;font-size:1.0625rem;font-weight:700
}
.g-steps [aria-pressed=true]{background:var(--brand);color:#fff;border-color:var(--brand)}
.g-steps .g-bigview{margin-top:0;background:transparent;border-style:dashed;font-weight:500}
.g-step-safety{margin:0;font-size:1rem;line-height:26px;color:var(--muted)}
.g-editor{
  height:756px;min-width:0;overflow-y:auto;overscroll-behavior:contain;padding:0 10px 24px 0;scrollbar-gutter:stable;
}
.g-status{margin:0 0 20px;padding:12px 16px;border-left:3px solid var(--brand);background:var(--soft);font-size:1rem;line-height:26px;white-space:pre-line}
#guided-panel>.g-kicker{margin-top:0}
.g-kicker{font-size:1rem;line-height:24px;color:var(--brand);font-weight:600;margin:0 0 10px}
#guided-panel>h2{margin:0 0 16px}
.g-muted{color:var(--muted);font-size:1rem;line-height:26px}
#guided-panel>p.g-muted{margin-bottom:24px}
#guided-panel>h3{margin:28px 0 14px;font-size:1rem;line-height:24px;font-weight:600}
.g-error{border-left:3px solid var(--danger);background:#fff1f2;padding:14px 16px;white-space:pre-line;color:#8a1e2e;margin:18px 0}.g-error:empty{display:none}

/* Figma fields and buttons */
.g-field{display:block;margin:16px 0}.g-field>span{display:block;margin-bottom:8px;font-size:1rem;line-height:26px;font-weight:500}
.g-field input,.g-field select{
  width:100%;min-height:56px;padding:0 16px;border:1px solid var(--control);border-radius:var(--radius);background:#fff;color:var(--ink);font-size:1.125rem;line-height:30px
}
.g-field input:focus,.g-field select:focus{border:2px solid var(--brand);outline:0}
.g-field small{display:block;margin-top:8px;color:var(--muted);font-size:1rem;line-height:26px}
.g-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.g-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:56px;padding:0 24px;border:1px solid var(--control);border-radius:var(--radius);background:#fff;text-decoration:none;font-size:1.125rem;line-height:28px;font-weight:700}
.g-btn-primary{background:var(--brand);border-color:var(--brand);color:#fff}.g-btn-primary:hover{background:var(--brand-hover);border-color:var(--brand-hover)}
.g-tools{display:flex;flex-wrap:wrap;gap:12px}
.g-check{display:flex;align-items:flex-start;gap:10px;margin:16px 0}.g-check input{width:24px;height:24px;min-width:24px;min-height:24px;flex:0 0 24px;margin-top:1px;accent-color:var(--brand)}
.g-check small{display:block;color:var(--muted);font-size:.9375rem;line-height:1.6}

/* Palette = 3x2 Figma buttons. Layout = five stacked options. */
.g-palette-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:24px}
.g-palette-choice{
  display:flex;align-items:center;justify-content:flex-start;gap:10px;min-height:56px;padding:0 14px;
  border:1px solid var(--line);border-radius:var(--radius);background:#fff;text-align:left;font-weight:700
}
.g-palette-choice[aria-pressed=true]{border:2px solid var(--brand);background:var(--soft);padding:0 13px}
.g-palette-swatch{width:22px;height:22px;flex:0 0 22px;border-radius:50%;box-shadow:inset 0 0 0 1px rgb(0 0 0 / .08)}
.g-layout-grid{display:grid;gap:12px;margin-bottom:24px}
.g-layout-choice{
  display:grid;grid-template-columns:112px minmax(0,1fr);grid-template-rows:auto auto;gap:4px 16px;align-items:center;
  min-height:114px;padding:18px 20px;border:1px solid var(--line);background:#fff;text-align:left
}
.g-layout-choice strong{grid-column:2;font-size:1.25rem;line-height:1.5}.g-layout-choice small{grid-column:2;color:var(--muted);font-size:1rem;line-height:1.6}
.g-layout-choice[aria-pressed=true]{border:2px solid var(--brand);background:var(--soft);padding:17px 19px}
.g-layout-diagram{grid-row:1/3;display:grid;grid-template-columns:2fr 1fr;gap:4px;height:64px;padding:6px;background:var(--canvas)}
.g-layout-diagram i{display:block;background:var(--line)}.g-layout-diagram i:first-child{grid-row:1/3;background:var(--brand)}
.g-layout-warm-care{grid-template-columns:1fr 2fr}.g-layout-premium-navy{grid-template-columns:1fr 1fr}
.g-layout-clean-minimal{display:flex;flex-direction:column}.g-layout-local-friendly i:first-child{grid-column:1/3;grid-row:auto}

/* Copy and optional controls */
.g-section{margin-top:32px;padding-top:24px;border-top:1px solid var(--line)}
.g-copy-search{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:end;margin-bottom:12px}
.g-copy-search .g-field{margin:0}.g-copy-search #choice-help{grid-column:1/-1;margin:0}
.g-choice-list{display:grid;gap:10px;max-height:460px;overflow:auto;overscroll-behavior:contain;padding:4px}
.g-choice{display:flex;gap:12px;align-items:flex-start;padding:16px;border:1px solid var(--line);background:#fff;cursor:pointer}
.g-choice input{width:24px;height:24px;min-width:24px;min-height:24px;flex:0 0 24px;margin-top:1px;accent-color:var(--brand)}
.g-choice strong{display:block;margin-bottom:5px;white-space:pre-line}.g-choice p{margin:0;color:var(--muted);font-size:1rem;line-height:26px;white-space:pre-line}
.g-choice:has(input:checked){background:var(--soft);border-color:var(--brand)}
.g-tag{display:inline-block;margin-bottom:6px;padding:1px 7px;border:1px solid var(--control);color:var(--brand);font-size:.875rem}
.g-purpose-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.g-purpose{display:block;width:100%;padding:16px;border:1px solid var(--line);background:#fff;text-align:left}
.g-purpose strong{display:block;margin-bottom:4px}.g-purpose span{display:block;color:var(--muted);font-size:.9375rem;line-height:1.55}
.g-purpose[aria-pressed=true]{border:2px solid var(--brand);background:var(--soft);padding:15px}
.g-advanced-note{margin-top:20px;padding:16px;border:1px solid var(--line);border-radius:var(--radius);background:#fff}
.g-advanced-note summary{cursor:pointer;font-weight:600}.g-note{margin-top:20px;padding:14px 16px;border-left:3px solid var(--brand);background:var(--soft);font-size:1rem;line-height:26px}
.g-save-options{margin-top:20px;padding-top:16px;border-top:1px solid var(--line)}

/* Review/save cards */
.g-summary{display:grid;grid-template-columns:140px minmax(0,1fr);margin:20px 0 0;border-top:1px solid var(--line)}
.g-summary dt,.g-summary dd{margin:0;padding:14px 0;border-bottom:1px solid var(--line)}
.g-summary dt{color:var(--muted);font-size:1rem}.g-summary dd{overflow-wrap:anywhere}
.g-handoff,.g-result{margin-top:22px;padding:20px;border:1px solid var(--line);background:#fff}
.g-handoff h3,.g-result h3{margin-bottom:8px}.g-handoff p,.g-result p{font-size:1rem;line-height:26px}
.g-handoff .g-btn{width:100%;margin-top:6px}.g-result{border-color:var(--brand)}.g-warning{color:#8a1e2e;font-weight:700}

/* Right customer preview = 416 wide, 24px inset, 368 viewport. */
.g-preview{
  position:relative;width:416px;height:756px;min-width:0;padding:24px;display:flex;flex-direction:column;gap:20px;background:var(--surface);overflow:hidden
}
.g-preview[data-expanded=true]{position:fixed;inset:0;z-index:250;width:100%;height:100dvh;padding:20px 28px;background:#e5e9ed}
.g-preview-tools{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:34px}
.g-preview-tools>p{margin:0;font-size:1.375rem;line-height:34px;font-weight:700}
.g-preview-controls{display:flex;align-items:center;gap:8px}.g-preview-expand,.g-device button{min-height:40px;padding:0 10px;border:1px solid var(--control);border-radius:var(--radius);background:#fff;font-size:.875rem}
.g-device{display:flex;gap:5px}.g-device [aria-pressed=true]{background:var(--brand);border-color:var(--brand);color:#fff}
.g-close{display:none;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;border:1px solid var(--control);border-radius:var(--radius);background:#fff;font-size:1.25rem}
.g-preview[data-expanded=true] .g-close{display:inline-flex}.g-preview[data-expanded=true] .g-preview-expand{display:none}
.g-mat{flex:1;min-height:0;width:100%;overflow:hidden;display:flex;align-items:flex-start;justify-content:center;background:var(--canvas)}
.g-canvas{position:relative;flex-shrink:0;height:100%;background:#fff;box-shadow:0 6px 20px rgb(35 51 67 / .08)}
.g-frame{position:absolute;left:0;top:0;border:0;transform-origin:top left;background:#fff}
.g-preview-note{margin:0;color:var(--muted);font-size:1rem;line-height:26px}

/* 92px Figma footer */
.g-footer{height:92px;flex:0 0 92px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 48px;background:#fff;border-top:1px solid var(--line)}
.g-footer-note{margin:0;color:var(--muted);font-size:1rem;line-height:26px}
.g-nav{display:flex;align-items:center;justify-content:flex-end;gap:12px;min-width:360px}
.g-nav .g-btn{min-width:140px}
.g-mobile-toggle{display:none}.g-noscript{padding:2rem;background:#fff1f2;color:#8a1e2e}
.g-small-screen{display:none;max-width:34rem;margin:auto;padding:3rem 1.25rem;text-align:left}.g-small-screen p{color:var(--muted)}.g-small-screen .g-btn{width:100%;margin-top:1.5rem}

/* Tablet: one work surface at a time, while keeping all hooks and full preview. */
@media(max-width:1179px){
  .g-top{padding-inline:24px}.g-top nav{display:none}.g-scope{white-space:normal;text-align:right}
  .g-layout{height:auto;min-height:calc(100vh - 180px);flex:0 0 auto;display:block;padding:16px 24px 24px;overflow:visible}
  .g-steps{position:sticky;top:0;z-index:40;height:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:10px 0;background:var(--canvas)}
  .g-step-label,.g-step-safety{grid-column:1/-1}.g-steps .g-bigview{grid-column:1/-1}
  .g-steps button{text-align:center;padding:0 10px}
  .g-editor{height:auto;max-width:760px;margin:0 auto;padding:18px 0 24px;overflow:visible}
  .g-preview{position:relative;width:min(100%,760px);height:80vh;margin:0 auto}
  .g-preview[data-expanded=true]{position:fixed;width:100%;height:100dvh;margin:0}
  .g-mobile-toggle{display:flex;gap:10px;padding:12px 24px;background:var(--canvas)}.g-mobile-toggle button{flex:1}
  .g-layout[data-view=editor] .g-preview{display:none}.g-layout[data-view=editor] .g-preview[data-expanded=true]{display:flex}
  .g-layout[data-view=preview] .g-steps,.g-layout[data-view=preview] .g-editor{display:none}
  .g-footer{height:auto;min-height:92px;padding:16px 24px;flex-wrap:wrap}.g-nav{min-width:0;margin-left:auto}
}
@media(max-width:820px){
  .g-top-actions .g-scope{display:none}.g-row,.g-copy-search{grid-template-columns:1fr}.g-copy-search #choice-help{grid-column:auto}
  .g-palette-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.g-purpose-grid{grid-template-columns:1fr}
  .g-layout-choice{grid-template-columns:90px minmax(0,1fr)}.g-nav{width:100%}.g-nav .g-btn{flex:1}
}
@media(max-width:767px){.g-app{display:none!important}.g-small-screen{display:block}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
@media print{.g-top,.g-steps,.g-footer,.g-preview-tools,.g-preview-note,.g-mobile-toggle,.g-status{display:none}.g-layout{display:block;padding:0}.g-editor{display:none}.g-preview{display:block!important;width:100%;height:auto;padding:0}.g-mat{display:block;overflow:visible}}
`;

export function renderGuidedStudioPage(site: SiteConfig): string {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>보험 페이지 스튜디오</title>${fontStylesheetLinks(['noto-sans-kr','pretendard','noto-serif-kr'])}<style>${guidedStyles}</style></head><body><a class="g-skip" href="#guided-editor">제작 영역으로 바로가기</a><section class="g-small-screen" aria-label="화면 크기 안내"><p class="g-kicker">화면이 좁습니다</p><h1>이 작업은 태블릿이나 PC에서 해 주세요.</h1><p>페이지를 만들면서 완성된 화면을 옆에 띄워 두고 비교해야 합니다. 휴대폰 화면에서는 두 가지를 같이 보기 어려워 실수가 생기기 쉽습니다.</p><p>가로 768px 이상 화면에서 열면 바로 이어서 작업할 수 있습니다.</p><a class="g-btn g-btn-primary" href="/">메인으로 돌아가기</a></section><div class="g-app"><header class="g-top"><a class="g-logo" href="/">보험 페이지 스튜디오</a><div class="g-top-actions"><span class="g-scope">제작자용 · 디자인 시연 / 미게시</span><nav aria-label="바로가기"><a href="/templates">디자인 비교</a><a class="g-exit" href="/" data-exit-home>나가기</a></nav></div></header><div class="g-mobile-toggle" aria-label="작업 화면"><button class="g-btn" type="button" data-view="editor" aria-pressed="true">편집</button><button class="g-btn" type="button" data-view="preview" aria-pressed="false">미리보기</button></div><main class="g-layout" id="guided-layout" data-view="editor"><nav class="g-steps" aria-label="제작 단계"><p class="g-step-label">제작 순서</p><button type="button" data-stage="0" aria-pressed="true" aria-current="step">01 배치·색상</button><button type="button" data-stage="1" aria-pressed="false">02 실제 정보</button><button type="button" data-stage="2" aria-pressed="false">03 검토·저장</button><button type="button" class="g-bigview" data-action="expand-preview">크게 보기</button><p class="g-step-safety">제작자 전용 화면입니다.<br>고객 화면과 분리됩니다.</p></nav><section class="g-editor" id="guided-editor" aria-label="페이지 만들기"><div id="guided-status" class="g-status" role="status" aria-live="polite">고른 내용은 이 화면에서만 바뀝니다. 미리보기의 연락 버튼은 눌러도 연결되지 않습니다.</div><div id="guided-panel"></div><div id="guided-errors" class="g-error" role="alert" tabindex="-1"></div><div class="g-save-options"><details class="g-advanced-note"><summary>저장한 작업 이어서 하기</summary><p class="g-muted">내보낸 ZIP 안의 JSON 작업 파일을 불러오면 만들던 내용이 돌아옵니다.</p><div class="g-tools"><button type="button" class="g-btn" data-action="import">작업 파일 불러오기</button><button type="button" class="g-btn" data-action="print">인쇄해서 보기</button></div><label class="g-check"><input id="remember-draft" type="checkbox"><span>이 컴퓨터에 작업 내용 임시 보관 <small>여러 사람이 쓰는 컴퓨터에서는 켜지 마세요. 이름·연락처·사진이 이 브라우저에 남습니다.</small></span></label><div class="g-tools"><button type="button" class="g-btn" data-action="restore">보관한 내용 되돌리기</button><button type="button" class="g-btn" data-action="clear">보관한 내용 지우기</button></div></details></div></section><section class="g-preview" data-expanded="false" aria-label="만들고 있는 페이지 미리보기"><div class="g-preview-tools"><p>고객 화면 · 크게 보기</p><div class="g-preview-controls"><button type="button" class="g-preview-expand" data-action="expand-preview" aria-expanded="false" aria-controls="guided-preview">크게</button><div class="g-device" aria-label="미리보기 크기"><button type="button" data-device="desktop" aria-pressed="true">PC</button><button type="button" data-device="mobile" aria-pressed="false">모바일</button></div><button type="button" class="g-close" data-action="close-preview" aria-label="큰 화면 닫기">✕</button></div></div><div class="g-mat"><div class="g-canvas"><iframe id="guided-preview" class="g-frame" title="만들고 있는 페이지" sandbox="allow-scripts allow-same-origin"></iframe></div></div><p class="g-preview-note">실제 고객 화면을 그대로 축소합니다. 미리보기에서는 전화·카카오톡이 실행되지 않습니다.</p></section></main><footer class="g-footer"><p class="g-footer-note">저장하는 파일은 초안입니다. 검토 전에는 공개하지 않습니다. · 문구 선택지 ${COPY_CHOICE_COUNT}개</p><div class="g-nav"><button type="button" class="g-btn" data-action="previous">이전</button><button type="button" class="g-btn g-btn-primary" data-action="next">다음: 실제 정보</button></div></footer></div><input id="guided-file" type="file" accept=".json,application/json" hidden><noscript><p class="g-noscript">이 화면을 쓰려면 브라우저에서 자바스크립트를 켜 주세요. <a href="/templates">디자인 예시 보기</a></p></noscript><script id="guided-bootstrap" type="application/json">${jsonForHtml(site)}</script><script type="module" src="/assets/guided-studio.js"></script></body></html>`;
}

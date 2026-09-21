import type { SiteConfig } from '../types.js';
import { jsonForHtml } from '../utils/html.js';
import { fontStylesheetLinks } from './fonts.js';
import { COPY_CHOICE_COUNT } from '../content/copy-library.js';

/**
 * 제작 화면 스타일. 입력란·버튼 수치는 Figma `CH2/Navy/Field`와 `CH2/Navy/Button`을
 * 따릅니다. 화면은 태블릿(768px) 이상에서만 열리며, 그보다 좁으면 안내만 보입니다.
 */
export const guidedStyles = `
:root{font-family:'Noto Sans KR','Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#172a3d;background:#f8f7f3;font-size:16px;line-height:1.65}*{box-sizing:border-box}body{margin:0}body.g-preview-open{overflow:hidden}button,input,select{font:inherit}button,a,input,select,summary{touch-action:manipulation}a{color:inherit;text-underline-offset:4px}button{cursor:pointer;color:inherit}button:disabled{cursor:not-allowed;opacity:.65}button,input,select{min-height:48px}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #2d4864;outline-offset:3px}[hidden]{display:none!important}h1,h2,h3,p{margin-top:0}h1,h2,h3{line-height:1.4;letter-spacing:-.025em}h1{font-size:1.65rem}h2{font-size:clamp(1.6rem,2.5vw,2.25rem)}h3{font-size:1.1rem}button,a{overflow-wrap:anywhere}
.g-skip{position:absolute;left:16px;top:-90px;background:white;padding:12px;z-index:100}.g-skip:focus{top:8px}
.g-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;padding:1.1rem 2rem;border-bottom:1px solid #cdd6e0;background:#fff}
.g-logo{flex-shrink:0;white-space:nowrap;font-weight:700;letter-spacing:-.02em;font-size:1.1rem;text-decoration:none}
.g-top nav{display:flex;gap:1rem;flex-wrap:wrap;align-items:center}.g-top nav a{font-size:1rem}
.g-exit{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid #788696;border-radius:8px;text-decoration:none;font-weight:500}
.g-intro{padding:1.25rem 1.5rem .75rem;max-width:1120px;margin:auto}.g-kicker{font-size:.9rem;color:#526170;margin:0 0 .5rem}.g-intro>p:last-child{max-width:800px;color:#526170}
.g-layout{display:grid;grid-template-columns:minmax(620px,760px) minmax(480px,1fr);max-width:1320px;margin:auto;border-top:1px solid #cdd6e0}
.g-editor{min-width:0;padding:1.5rem 1.75rem;display:grid;grid-template-columns:176px minmax(0,1fr);column-gap:24px;align-content:start;background:#f8f7f3}
.g-steps{grid-column:1;grid-row:1/6;display:flex;flex-direction:column;gap:10px;position:sticky;top:20px;align-self:start}
.g-steps button{width:100%;padding:.7rem;border:1px solid #788696;background:transparent;text-align:left;border-radius:8px}
.g-steps [aria-pressed=true]{background:#2d4864;color:#fff;border-color:#2d4864}
.g-steps .g-bigview{margin-top:8px;border-style:dashed}
.g-editor>#guided-panel,.g-editor>.g-error,.g-editor>.g-nav,.g-editor>.g-save-options{grid-column:2}
.g-muted{color:#526170}
.g-purpose-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.g-purpose{display:block;text-align:left;width:100%;border:1px solid #cdd6e0;border-radius:8px;padding:1rem;background:white}
.g-purpose strong{display:block;margin-bottom:.4rem}.g-purpose span{font-size:.95rem;color:#526170;line-height:1.55;display:block}
.g-purpose[aria-pressed=true]{border:2px solid #2d4864;background:#e8edf3;padding:calc(1rem - 1px)}
.g-field{display:block;margin:1rem 0}.g-field>span{display:block;margin-bottom:.5rem;font-weight:500}
.g-field input,.g-field select{width:100%;border:1px solid #788696;padding:0 16px;min-height:56px;border-radius:8px;background:#fff;color:#172a3d;font-size:1.125rem}
.g-field input:focus,.g-field select:focus{border:2px solid #2d4864}
.g-field small{display:block;color:#526170;font-size:1rem;margin-top:.5rem}
.g-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.g-check{display:flex;align-items:flex-start;gap:.7rem;margin:1rem 0}
.g-check input{min-height:0;width:20px;height:20px;flex-shrink:0;margin-top:4px;accent-color:#2d4864}
.g-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:1px solid #788696;background:#fff;padding:0 24px;border-radius:8px;min-height:56px;text-decoration:none;font-weight:700;font-size:1.125rem}
.g-btn-primary{background:#2d4864;color:#fff;border-color:#2d4864}.g-btn-primary:hover{background:#1d3249;border-color:#1d3249}
.g-nav{display:flex;gap:.75rem;justify-content:space-between;margin-top:1.5rem;border-top:1px solid #cdd6e0;padding-top:1.25rem;flex-wrap:wrap}
.g-tools{display:flex;gap:.75rem;flex-wrap:wrap}
.g-section{margin-top:1.5rem;padding-top:1.1rem;border-top:1px solid #cdd6e0}
.g-copy-search{padding:0 0 1rem}
.g-choice-list{display:grid;gap:.65rem;max-height:460px;overflow:auto;overscroll-behavior:contain;padding:.25rem}
.g-choice{display:flex;gap:.75rem;align-items:flex-start;border:1px solid #cdd6e0;padding:1rem;border-radius:8px;background:white;cursor:pointer}
.g-choice input{min-height:0;width:19px;height:19px;flex-shrink:0;margin-top:4px;accent-color:#2d4864}
.g-choice strong{display:block;margin-bottom:.4rem;white-space:pre-line}
.g-choice p{font-size:1rem;color:#526170;margin:0;white-space:pre-line}
.g-choice:has(input:checked){background:#e8edf3;border-color:#2d4864}
.g-tag{font-size:.9rem;display:inline-block;border:1px solid #788696;padding:1px 7px;margin-bottom:.5rem;color:#2d4864}
.g-note{padding:1rem 1.1rem;border-left:3px solid #2d4864;background:#e8edf3;font-size:1rem}
.g-status{padding:.8rem 2rem;color:#172a3d;background:#e8edf3;white-space:pre-line}
.g-error{border-left:3px solid #ac2537;background:#fff1f2;padding:1rem;white-space:pre-line;color:#8a1e2e;margin:1rem 0}.g-error:empty{display:none}
.g-preview{position:sticky;top:0;height:100vh;min-width:0;background:#e5e9ed;padding:1.4rem;display:flex;flex-direction:column}
.g-preview[data-expanded=true]{position:fixed;inset:0;width:100%;height:100dvh;z-index:200;padding:1rem 1.4rem;background:#e5e9ed}
.g-preview-tools{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem;margin-bottom:1rem}
.g-preview-tools p{margin:0;font-weight:700}
.g-preview-controls{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap}
.g-preview-expand,.g-device button{border:1px solid #768390;background:#fff;padding:.45rem .8rem;border-radius:8px}
.g-device{display:flex;gap:.4rem}.g-device [aria-pressed=true]{background:#2d4864;color:white;border-color:#2d4864}
.g-close{display:none;align-items:center;justify-content:center;width:48px;min-width:48px;height:48px;border:1px solid #768390;background:#fff;border-radius:8px;font-size:1.4rem;line-height:1}
.g-preview[data-expanded=true] .g-close{display:inline-flex}
.g-preview[data-expanded=true] .g-preview-expand{display:none}
.g-mat{flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;align-items:flex-start}
.g-canvas{position:relative;flex-shrink:0;background:white;height:100%;box-shadow:0 6px 20px #23334314}
.g-frame{border:0;position:absolute;top:0;left:0;transform-origin:top left;background:#fff}
.g-preview-note{font-size:.9rem;margin:1rem 0 0;color:#526170}
.g-summary{margin:1.2rem 0;border:1px solid #cdd6e0;padding:1rem;background:white;border-radius:8px}
.g-summary dt{font-size:.9rem;color:#526170}.g-summary dd{margin:0 0 .75rem;overflow-wrap:anywhere}
.g-mobile-toggle{display:none}
.g-advanced-note{padding:1.1rem;border:1px solid #cdd6e0;margin-top:1.3rem;background:#fff;border-radius:8px}
.g-advanced-note summary{cursor:pointer}
.g-save-options{margin-top:1.25rem;padding-top:1rem;border-top:1px solid #cdd6e0}
.g-noscript{padding:2rem;background:#fff1f2;color:#8a1e2e}
.g-layout-grid{display:grid;gap:10px}
.g-layout-choice{display:grid;grid-template-columns:110px 1fr;text-align:left;gap:4px 16px;padding:14px;border:1px solid #cdd6e0;background:#fff;border-radius:8px}
.g-layout-choice strong,.g-layout-choice small{grid-column:2}.g-layout-choice small{color:#526170}
.g-layout-choice[aria-pressed=true]{border:2px solid #2d4864;background:#e8edf3;padding:13px}
.g-layout-diagram{grid-row:1/3;display:grid;grid-template-columns:2fr 1fr;gap:4px;height:60px;background:#f8f7f3;padding:6px}
.g-layout-diagram i{display:block;background:#cdd6e0}.g-layout-diagram i:first-child{grid-row:1/3;background:#2d4864}
.g-layout-warm-care{grid-template-columns:1fr 2fr}.g-layout-premium-navy{grid-template-columns:1fr 1fr}
.g-layout-clean-minimal{display:flex;flex-direction:column}.g-layout-local-friendly i:first-child{grid-column:1/3;grid-row:auto}
.g-brand-section{margin-top:1.6rem;padding-top:1.35rem;border-top:1px solid #cdd6e0}
.g-brand-section>h3{margin-bottom:.35rem}
.g-brand-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:1rem 0 1.25rem}
.g-brand-choice{display:flex;flex-direction:column;align-items:stretch;gap:7px;min-width:0;padding:11px;border:1px solid #cdd6e0;background:#fff;border-radius:8px;text-align:left}
.g-brand-choice>strong{font-size:.98rem;line-height:1.4}.g-brand-choice>small{color:#526170;font-size:.84rem;line-height:1.45}
.g-brand-choice[aria-pressed=true]{border:2px solid #2d4864;background:#e8edf3;padding:10px}
.g-brand-diagram{position:relative;display:grid;align-content:center;justify-items:center;width:100%;min-height:96px;overflow:hidden;border-radius:6px;background:#fffaf1;border:1px solid #eadcc3;color:#8f621e}
.g-brand-diagram b{font-size:1rem;letter-spacing:.18em}.g-brand-diagram em{font-size:.58rem;line-height:1.35;font-style:normal;text-align:center;color:#65594e;padding:0 8px}.g-brand-diagram i{display:block;width:32px;height:1px;margin:7px 0;background:#c9a66d}
.g-brand-soft-panel::after{content:"";position:absolute;right:-25px;bottom:-35px;width:76px;height:76px;border:12px solid #ead7b83f;border-radius:50%}
.g-brand-gold-wave{border-color:#d4ab66}.g-brand-gold-wave::after{content:"";position:absolute;left:-10%;right:-10%;bottom:-24px;height:42px;border-top:2px solid #d3a75e80;border-radius:50%}
.g-brand-watermark{background:linear-gradient(120deg,#fffdf8,#f8f0e1)}.g-brand-watermark b{font-size:1.3rem;opacity:1;transform:scale(1.35)}.g-brand-watermark i{width:66px;opacity:.55}.g-brand-watermark em{letter-spacing:.16em;color:#805c26}
.g-palette-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.25rem}
.g-palette-choice{display:flex;align-items:center;gap:8px;border:1px solid #cdd6e0;background:#fff;padding:10px;border-radius:8px;text-align:left}
.g-palette-choice[aria-pressed=true]{border:2px solid #2d4864;background:#e8edf3;padding:9px}
.g-palette-swatch{width:24px;height:24px;flex:0 0 24px}
.g-handoff,.g-result{border:1px solid #cdd6e0;background:#fff;padding:1.25rem;margin-top:1.5rem;border-radius:8px}
.g-handoff .g-btn{width:100%;margin-top:.5rem}
.g-result{border-color:#2d4864}.g-result dl{display:grid;grid-template-columns:120px 1fr}
.g-result dt{color:#526170}.g-result dd{margin:0 0 .6rem;overflow-wrap:anywhere}
.g-warning{color:#8a1e2e;font-weight:700}
.g-palette{display:inline-block;width:14px;height:14px;vertical-align:middle}
.g-small-screen{display:none;padding:3rem 1.25rem;max-width:34rem;margin:auto;text-align:left}
.g-small-screen h1{margin-bottom:1rem}.g-small-screen p{color:#526170}
.g-small-screen .g-btn{margin-top:1.5rem;width:100%}
@media(max-width:1080px){
 .g-top{padding:1rem;align-items:flex-start}.g-top nav{gap:.65rem}.g-intro{padding:1.25rem 1rem}
 .g-layout{display:block}.g-editor{display:block;padding:0 1rem 2rem}
 .g-editor>#guided-panel,.g-editor>.g-error,.g-editor>.g-nav,.g-editor>.g-save-options{grid-column:auto}
 .g-steps{position:sticky;top:0;z-index:5;display:grid;grid-template-columns:repeat(3,1fr);padding:10px 0;background:#f8f7f3}
 .g-steps .g-bigview{grid-column:1/-1;margin-top:0}
 .g-steps button{text-align:center}
 .g-preview{position:relative;height:80vh}.g-preview[data-expanded=true]{position:fixed;height:100dvh}
 .g-mobile-toggle{display:flex;gap:.7rem;padding:0 1rem 1rem}.g-mobile-toggle button{flex:1}
 .g-layout[data-view=editor] .g-preview{display:none}
 .g-layout[data-view=editor] .g-preview[data-expanded=true]{display:flex}
 .g-layout[data-view=preview] .g-editor{display:none}
 .g-purpose-grid{grid-template-columns:1fr 1fr}.g-choice-list{max-height:none}.g-status{padding:1rem}
 .g-brand-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:860px){
 .g-brand-grid{grid-template-columns:1fr}
}
@media(max-width:767px){
 .g-app{display:none!important}
 .g-small-screen{display:block}
}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
@media print{.g-top,.g-intro,.g-editor,.g-preview-tools,.g-preview-note,.g-mobile-toggle,.g-status{display:none}.g-layout{display:block}.g-preview{position:static;height:auto;padding:0}.g-mat{display:block;overflow:visible}}
`;

export function renderGuidedStudioPage(site: SiteConfig): string {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>내 보험 상담 페이지 만들기</title>${fontStylesheetLinks(['noto-sans-kr'])}<style>${guidedStyles}</style></head><body><a class="g-skip" href="#guided-editor">제작 영역으로 바로가기</a><section class="g-small-screen" aria-label="화면 크기 안내"><p class="g-kicker">화면이 좁습니다</p><h1>이 작업은 태블릿이나 PC에서 해 주세요.</h1><p>페이지를 만들면서 완성된 화면을 옆에 띄워 두고 비교해야 합니다. 휴대폰 화면에서는 두 가지를 같이 보기 어려워 실수가 생기기 쉽습니다.</p><p class="g-muted">가로 768px 이상 화면에서 열면 바로 이어서 작업할 수 있습니다.</p><a class="g-btn g-btn-primary" href="/">메인으로 돌아가기</a></section><div class="g-app"><header class="g-top"><a class="g-logo" href="/">내 보험 상담 페이지 만들기</a><nav aria-label="바로가기"><a href="/templates">디자인 한눈에 비교</a><a class="g-exit" href="/" data-exit-home>나가기 · 메인으로</a></nav></header><div class="g-intro"><p class="g-kicker">고르기만 하면 되는 제작 화면</p><h1>빈칸부터 쓰지 말고,<br>맞는 문구부터 고르세요.</h1><p>6가지 색상과 5가지 화면 구성, 3가지 메인 로고 연출, ${COPY_CHOICE_COUNT}개 문구 중에서 고릅니다. 고른 문구와 로고 연출은 다른 설정을 바꿔도 그대로 남습니다.</p></div><div id="guided-status" class="g-status" role="status" aria-live="polite">고른 내용은 이 화면에서만 바뀝니다. 미리보기의 연락 버튼은 눌러도 연결되지 않습니다.</div><div class="g-mobile-toggle" aria-label="작업 화면"><button class="g-btn" type="button" data-view="editor" aria-pressed="true">고르기</button><button class="g-btn" type="button" data-view="preview" aria-pressed="false">미리보기</button></div><main class="g-layout" id="guided-layout" data-view="editor"><section class="g-editor" id="guided-editor" aria-label="페이지 만들기"><nav class="g-steps" aria-label="제작 단계"><button type="button" data-stage="0" aria-pressed="true" aria-current="step">01 디자인과 문구</button><button type="button" data-stage="1" aria-pressed="false">02 실제 정보</button><button type="button" data-stage="2" aria-pressed="false">03 확인하고 저장</button><button type="button" class="g-bigview" data-action="expand-preview">크게 보기</button></nav><div id="guided-panel"></div><div id="guided-errors" class="g-error" role="alert" tabindex="-1"></div><div class="g-nav"><button type="button" class="g-btn" data-action="previous">이전</button><button type="button" class="g-btn g-btn-primary" data-action="next">다음: 실제 정보</button></div><div class="g-save-options"><details class="g-advanced-note"><summary>저장해 둔 작업 이어서 하기</summary><p class="g-muted">지난번에 내보낸 파일을 압축 해제하면 안에 작업 파일이 들어 있습니다. 그 파일을 불러오면 만들던 내용이 그대로 돌아옵니다.</p><div class="g-tools"><button type="button" class="g-btn" data-action="import">저장한 작업 불러오기</button><button type="button" class="g-btn" data-action="print">인쇄해서 보기</button></div><label class="g-check"><input id="remember-draft" type="checkbox"><span>이 컴퓨터에 작업 내용 임시 보관 <small>여러 사람이 쓰는 컴퓨터에서는 켜지 마세요. 이름·연락처·사진이 이 브라우저에 남습니다.</small></span></label><div class="g-tools"><button type="button" class="g-btn" data-action="restore">보관한 내용 되돌리기</button><button type="button" class="g-btn" data-action="clear">보관한 내용 지우기</button></div></details><p class="g-muted">저장한다고 해서 페이지가 공개되거나 누군가에게 전송되지 않습니다.</p></div></section><section class="g-preview" data-expanded="false" aria-label="만들고 있는 페이지 미리보기"><div class="g-preview-tools"><p>고객이 보게 될 화면</p><div class="g-preview-controls"><button type="button" class="g-preview-expand" data-action="expand-preview" aria-expanded="false" aria-controls="guided-preview">크게 보기</button><div class="g-device" aria-label="미리보기 크기"><button type="button" data-device="desktop" aria-pressed="true">PC</button><button type="button" data-device="mobile" aria-pressed="false">모바일</button></div><button type="button" class="g-close" data-action="close-preview" aria-label="큰 화면 닫기">✕</button></div></div><div class="g-mat"><div class="g-canvas"><iframe id="guided-preview" class="g-frame" title="만들고 있는 페이지" sandbox="allow-scripts allow-same-origin"></iframe></div></div><p class="g-preview-note">고른 문구와 사진·로고가 실제 페이지와 똑같이 보입니다. 미리보기에서는 연락 버튼이 외부 앱으로 연결되지 않습니다.</p></section></main></div><input id="guided-file" type="file" accept=".json,application/json" hidden><noscript><p class="g-noscript">이 화면을 쓰려면 브라우저에서 자바스크립트를 켜 주세요. <a href="/templates">디자인 예시 보기</a></p></noscript><script id="guided-bootstrap" type="application/json">${jsonForHtml(site)}</script><script type="module" src="/assets/guided-studio.js"></script></body></html>`;
}

/**
 * Clear Human 정본 스타일.
 *
 * Figma `보험설계 2026 · Clear Human`의 컴포넌트 페이지(`CH2/Navy/*`)에서 읽은
 * 수치를 그대로 옮긴 마지막 레이어입니다. 색상은 팔레트 토큰으로 바꿔 여섯 가지
 * 색상이 같은 구조를 공유합니다.
 *
 * 대응표
 * - CH2/Navy/Agent Details → `.adviser-card`
 * - CH2/Navy/Button        → `.button`, `.button-secondary`
 * - CH2/Navy/Contact Button→ `.direct-contact-actions .button`
 * - CH2/Navy/Topic Row     → `.services-list .service-card`
 * - CH2/Navy/Topic Card    → `.services-cards .service-card`, `.services-split .service-card`
 * - CH2/Navy/Accordion     → `.faq-list details`
 * - CH2/Navy/Portrait      → `.portrait-figure img`, 3:4 비율 유지
 */
export const clearHumanStyles = `
.premium-page{
 --ch-font:'Noto Sans KR','Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
 --ch-display:clamp(2.5rem,5vw,3.75rem);--ch-display-lh:1.33;
 --ch-h2:clamp(1.75rem,3vw,2.5rem);--ch-h2-lh:1.4;
 --ch-h3:clamp(1.375rem,1.8vw,1.625rem);--ch-h3-lh:1.54;
 --ch-card:1.375rem;--ch-card-lh:1.55;
 --ch-body:1.125rem;--ch-body-lh:1.667;
 --ch-small:1rem;--ch-small-lh:1.625;
 font-family:var(--ch-font);
}
.premium-page body,.premium-page{font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page h1,.premium-page h2,.premium-page h3{font-family:var(--heading-family,var(--ch-font));font-weight:700;letter-spacing:-.03em;color:var(--ink)}
.premium-page h1{font-size:var(--ch-display);line-height:var(--ch-display-lh)}
.premium-page h2{font-size:var(--ch-h2);line-height:var(--ch-h2-lh)}
.premium-page h3{font-size:var(--ch-h3);line-height:var(--ch-h3-lh)}
.premium-page p{font-size:var(--ch-body);line-height:var(--ch-body-lh);color:var(--muted)}
.premium-page .eyebrow{font-size:var(--ch-small);line-height:var(--ch-small-lh);font-weight:500;color:var(--accent);letter-spacing:.01em}
.premium-page .support-note,.premium-page .hero-note,.premium-page .palette-caption{font-size:var(--ch-small);line-height:var(--ch-small-lh)}

/* CH2/Navy/Button — 높이 56, 좌우 24, 모서리 8, 18px Bold, 줄높이 28 */
.premium-page .button{
 display:inline-flex;align-items:center;justify-content:center;gap:.625rem;
 min-height:56px;padding:0 24px;border-radius:var(--radius-control);
 font-size:1.125rem;line-height:1.556;font-weight:700;letter-spacing:-.01em;
 background:var(--accent);color:var(--on-brand);border:1px solid var(--accent);text-decoration:none;
}
.premium-page .button:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.premium-page .button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.premium-page .button[aria-disabled=true],.premium-page .button:disabled{background:var(--tint);border-color:var(--tint);color:var(--muted)}
.premium-page .button-secondary{background:var(--surface);color:var(--ink);border:1px solid var(--input)}
.premium-page .button-secondary:hover{background:var(--tint);border-color:var(--input);color:var(--ink)}
.premium-page .button-small{min-height:44px;padding:0 16px;font-size:var(--ch-small)}

/* CH2/Navy/Contact Button — 채널 색. 일반 버튼 규칙 뒤에 두어야 이깁니다. */
.premium-page .direct-phone{background:var(--accent);color:var(--on-brand);border:1px solid var(--accent)}
.premium-page .direct-phone:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.premium-page .direct-kakao{background:var(--kakao);color:var(--kakao-ink);border:1px solid var(--kakao-line)}
.premium-page .direct-kakao:hover{background:var(--kakao-hover);color:var(--kakao-ink);border-color:var(--kakao-line)}
.premium-page .site-footer .direct-phone{border:1px solid #B9C4CE;background:transparent;color:#fff}
.premium-page .site-footer .direct-phone:hover{background:#243347;border-color:#B9C4CE}

/* CH2/Navy/Agent Details — 416×408, 안쪽 여백 40, 항목 간격 20 */
.premium-page .adviser-card{
 display:flex;justify-content:center;align-items:center;text-align:center;
 padding:40px;background:var(--ink);color:var(--on-brand);max-width:416px;
}
.premium-page .adviser-card .adviser-details{
 display:flex;flex-direction:column;gap:20px;width:max-content;max-width:100%;min-width:0;
}
.premium-page .adviser-card p,.premium-page .adviser-card span{color:var(--detail)}
.premium-page .adviser-card .adviser-role{font-size:var(--ch-small);line-height:var(--ch-small-lh);font-weight:400}
.premium-page .adviser-card .adviser-name{font-size:var(--ch-display);line-height:var(--ch-display-lh);font-weight:700;letter-spacing:-.03em;color:var(--on-brand)}
.premium-page .adviser-card .adviser-org{font-size:1.25rem;line-height:1.7;font-weight:400}
.premium-page .adviser-card .adviser-phone{font-size:1.625rem;line-height:1.538;font-weight:700;text-decoration:none;color:var(--on-brand)}
.premium-page .adviser-card .adviser-phone:hover{text-decoration:underline}
.premium-page .adviser-card .adviser-hours{font-size:var(--ch-small);line-height:var(--ch-small-lh);font-weight:400}

/* 고객 첫 화면 — 좌측 원고 · 우측 인물 + 담당자 정보 */
/* 사진과 담당자 카드는 Figma 폭(사진 432, 카드 416)에서 멈춥니다. 남는 자리를
   카드가 삼키면 글자 오른쪽에 빈 공간만 길게 남습니다. */
.premium-page .premium-hero:not(.hero-statement){grid-template-columns:minmax(0,1fr) minmax(22rem,27rem);gap:clamp(3rem,6vw,6.5rem)}
.premium-page .hero-visual{display:flex;flex-direction:column;align-items:stretch;gap:0;padding-bottom:0;min-width:0;width:100%;max-width:27rem;justify-self:end}
.premium-page .hero-visual .adviser-card{width:calc(100% - 1rem);max-width:26rem;align-self:flex-end}
.premium-page .hero-visual .portrait-figure{max-width:27rem;justify-self:auto;border-bottom:0;padding-bottom:0}
.premium-page .hero-visual .portrait-figure>img{aspect-ratio:3/4;object-position:50% 15%}
.premium-page .hero-visual .hero-scene img{aspect-ratio:3/2;object-fit:cover}
/* 담당자 정보 카드가 바로 아래 오므로 설명은 겹치지 않게 흐름 안에 둡니다. */
.premium-page .hero-visual .hero-scene{position:static}
.premium-page .hero-visual .hero-scene figcaption{position:static;margin:.75rem 0 1.25rem;text-align:right;color:var(--muted)}
.premium-page .hero-statement-person{display:flex;flex-direction:row;flex-wrap:wrap;align-items:stretch;gap:0;text-align:left;justify-content:center;width:100%;max-width:45rem;margin-inline:auto;justify-self:stretch}
.premium-page .hero-statement-person>img{flex:0 1 18rem;width:18rem;height:auto;aspect-ratio:3/4}
.premium-page .hero-statement-person .adviser-card{flex:1 1 18rem;width:auto;max-width:26rem}
.premium-page .hero-statement .hero-visual{text-align:left}
.premium-page .section-heading,.premium-page .service-card{text-align:left}

/* CH2/Navy/Topic Row — 위아래 24, 칸 간격 32, 아래 경계선 1 */
.premium-page .services-list .service-card{
 display:flex;align-items:flex-start;gap:32px;padding:24px 0;
 border:0;border-bottom:1px solid var(--line);background:transparent;
}
.premium-page .services-list .service-card .section-index{
 flex:0 0 56px;margin:0;font-size:1.25rem;line-height:1.6;font-weight:700;color:var(--accent);
}
.premium-page .services-list .service-card h3{flex:0 0 292px;margin:0;font-size:1.625rem;line-height:1.538}
.premium-page .services-list .service-card p{flex:1 1 auto;min-width:0;margin:0}

/* CH2/Navy/Topic Card — 세로 간격 8, 위아래 24, 아래 경계선 1 */
.premium-page .services-cards .service-card{
 display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:24px 0;
 border:0;border-bottom:1px solid var(--line);background:transparent;
}
.premium-page .services-split .service-card{
 display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:24px;
 border:0;border-bottom:1px solid var(--line);background:transparent;
}
.premium-page .services-cards .service-card .section-index,.premium-page .services-split .service-card .section-index{
 margin:0;font-size:var(--ch-small);line-height:1.5;font-weight:700;color:var(--accent);
}
.premium-page .services-cards .service-card h3,.premium-page .services-split .service-card h3{
 margin:0;font-size:var(--ch-card);line-height:var(--ch-card-lh);
}
.premium-page .services-cards .service-card p,.premium-page .services-split .service-card p{margin:0}
.premium-page .services-cards .service-card h3,.premium-page .services-cards .service-card p,
.premium-page .services-split .service-card h3,.premium-page .services-split .service-card p{
 min-width:0;max-width:100%;word-break:keep-all;overflow-wrap:anywhere;
}
.premium-page .service-card .service-link{align-self:flex-start;color:var(--accent)}
/* 항목 수에 맞춘 대칭 격자. 5개는 3개 아래에 2개가 가운데 오게 배치합니다. */
.premium-page .services-cards[data-count="2"],
.premium-page .services-cards[data-count="4"]{grid-template-columns:repeat(2,minmax(0,1fr))}
.premium-page .services-cards[data-count="3"],
.premium-page .services-cards[data-count="6"]{grid-template-columns:repeat(3,minmax(0,1fr))}
.premium-page .services-cards[data-count="5"]{grid-template-columns:repeat(6,minmax(0,1fr))}
.premium-page .services-cards[data-count="5"] .service-card{grid-column:span 2}
.premium-page .services-cards[data-count="5"] .service-card:nth-child(4){grid-column:2/span 2}
.premium-page .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:4/span 2}

/* split도 첫 카드가 나머지 전체 높이를 차지하지 않게 같은 크기의 2열로 둡니다. */
.premium-page .services-split{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 2.5rem}
.premium-page .services-split .service-card{align-self:stretch}
.premium-page .services-split .service-card .service-link{margin-top:auto}
.premium-page .services-split .service-card:first-child{
 grid-row:auto;align-self:stretch;justify-content:flex-start;padding:24px;
}
.premium-page .services-split[data-count="3"] .service-card:last-child,
.premium-page .services-split[data-count="5"] .service-card:last-child{
 grid-column:1/-1;width:calc(50% - 1.25rem);justify-self:center;
}

/* CH2/Navy/Accordion — 위아래 24, 답변 간격 16, 아래 경계선 1 */
.premium-page .faq-list details{border:0;border-bottom:1px solid var(--line);background:transparent;padding:0}
.premium-page .faq-list summary{
 display:flex;align-items:flex-start;gap:16px;justify-content:space-between;
 padding:24px 0;font-size:1.25rem;line-height:1.6;font-weight:700;color:var(--ink);
}
.premium-page .faq-list summary>span:last-child{font-size:1.5rem;line-height:1.333;font-weight:400;flex-shrink:0}
.premium-page .faq-list details[open] summary{padding-bottom:16px}
.premium-page .faq-list details>p{padding:0 0 24px;margin:0;font-size:var(--ch-body);line-height:var(--ch-body-lh);color:var(--muted)}
.premium-page .faq-number{color:var(--accent);font-weight:700;margin-right:.75rem}

/* 어두운 바닥 위의 글자는 팔레트의 흐린 색을 쓰지 않습니다. */
.premium-page .site-footer h2,.premium-page .site-footer p,.premium-page .site-footer a,.premium-page .site-footer dt,.premium-page .site-footer dd{color:#F7F6F0}
.premium-page .site-footer .footer-legal p{color:#CBD3DC}
.premium-page .site-footer .direct-kakao{color:var(--kakao-ink)}

/* CH2/Navy/Portrait — 3:4 비율, 얼굴·색조 변형 없음 */
.premium-page .portrait-figure img,.premium-page .about-portrait img{
 aspect-ratio:3/4;object-fit:cover;width:100%;height:auto;
}
/* 첫 화면의 사진 폭은 아래 '고객 첫 화면' 규칙이 정합니다. 여기서 100%로
   되돌리면 사진이 단 전체를 차지하고 담당자 카드가 구석으로 밀립니다. */
.premium-page .hero-statement-person>img{aspect-ratio:3/4;object-fit:cover;height:auto}

/* 제작 화면은 태블릿(768px) 이상에서만 열립니다. 좁은 화면에서는 들어가는 길을
   보여 주지 않고, 눌러서 들어가더라도 제작 화면이 안내만 표시합니다. */
@media(max-width:767px){
 .premium-page [data-studio-entry]{display:none!important}
 .premium-page .sample-settings{display:none}
}
@media(max-width:900px){
 .premium-page .premium-hero:not(.hero-statement){grid-template-columns:minmax(0,1fr) minmax(18rem,22rem);gap:2rem}
 .premium-page .services-list .service-card{flex-wrap:wrap;gap:8px 16px}
 .premium-page .services-list .service-card h3{flex:1 1 auto}
 .premium-page .services-list .service-card p{flex:1 1 100%}
 .premium-page .adviser-card{padding:24px;max-width:none}
 .premium-page .adviser-card .adviser-details{gap:16px}
 .premium-page .services-cards[data-count],.premium-page .services-split[data-count]{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 2rem}
 .premium-page .services-cards[data-count] .service-card{grid-column:auto;width:auto;justify-self:stretch}
 .premium-page .services-cards[data-count="5"] .service-card:nth-child(4),
 .premium-page .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:auto}
 .premium-page .services-cards[data-count="3"] .service-card:last-child,
 .premium-page .services-cards[data-count="5"] .service-card:last-child,
 .premium-page .services-split[data-count="3"] .service-card:last-child,
 .premium-page .services-split[data-count="5"] .service-card:last-child{
  grid-column:1/-1;width:calc(50% - 1rem);justify-self:center;
 }
}
@media(max-width:650px){
 .premium-page .premium-hero:not(.hero-statement){grid-template-columns:minmax(0,1fr)}
 .premium-page .hero-visual{max-width:none;justify-self:stretch}
 .premium-page .hero-visual .adviser-card{width:100%;max-width:none;align-self:stretch}
 .premium-page .adviser-card .adviser-name{font-size:2.5rem}
 .premium-page .adviser-card .adviser-phone{font-size:1.375rem}
 .premium-page .button{width:auto}
 .premium-page .services-cards[data-count],.premium-page .services-split[data-count]{grid-template-columns:minmax(0,1fr);gap:1rem}
 .premium-page .services-cards[data-count] .service-card,
 .premium-page .services-cards[data-count="3"] .service-card:last-child,
 .premium-page .services-cards[data-count="5"] .service-card:last-child,
 .premium-page .services-split[data-count] .service-card,
 .premium-page .services-split[data-count="3"] .service-card:last-child,
 .premium-page .services-split[data-count="5"] .service-card:last-child{
  grid-column:auto;width:auto;justify-self:stretch;
 }
 .premium-page .services-cards[data-count="5"] .service-card:nth-child(4),
 .premium-page .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:auto}
}
`;

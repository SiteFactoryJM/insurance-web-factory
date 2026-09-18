/**
 * Clear Human 팔레트와 컴포넌트 기초 위에 적용하는 사용자 확정 typography override.
 *
 * `clear-human-v1`의 색상·버튼·접근성 계약은 유지하고, `balanced-v2` 소비자 화면에서
 * 정보 폭, 제목과 설명의 관계, 본문 크기와 섹션 구성을 읽기 중심으로 정돈합니다.
 * 이 파일은 pageStyles의 마지막 레이어이므로 기존 premium 규칙보다 뒤에 와야 합니다.
 */
export const clearHumanStyles = `
.premium-page{
 --ch-font:'Noto Sans KR','Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
 --ch-display:clamp(2.625rem,4.6vw,3.5rem);--ch-display-lh:1.25;
 --ch-h2:clamp(1.875rem,3vw,2.375rem);--ch-h2-lh:1.35;
 --ch-h3:clamp(1.375rem,1.8vw,1.5rem);--ch-h3-lh:1.45;
 --ch-card:clamp(1.375rem,1.8vw,1.5rem);--ch-card-lh:1.45;
 --ch-body:1.1875rem;--ch-body-lh:1.65;
 --ch-small:1rem;--ch-small-lh:1.6;
 font-family:var(--ch-font);font-size:var(--ch-body);line-height:var(--ch-body-lh);
}
.premium-page h1,.premium-page h2,.premium-page h3{
 font-family:var(--heading-family,var(--ch-font));font-weight:700;letter-spacing:-.03em;
 color:var(--ink);text-wrap:balance;
}
.premium-page #main h1{font-size:var(--ch-display);line-height:var(--ch-display-lh)}
.premium-page h2{font-size:var(--ch-h2);line-height:var(--ch-h2-lh)}
.premium-page h3{font-size:var(--ch-h3);line-height:var(--ch-h3-lh)}
.premium-page p{font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page .eyebrow{font-size:var(--ch-small);line-height:var(--ch-small-lh);font-weight:600;color:var(--accent);letter-spacing:.02em}
.premium-page .support-note,.premium-page .hero-note,.premium-page .palette-caption,
.premium-page .demo-contact-notice{font-size:var(--ch-small);line-height:var(--ch-small-lh)}

/* 소비자 본문만 1120px로 모읍니다. header, footer, 제작 도구의 폭은 기존 계약을 유지합니다. */
.premium-page #main .container{width:min(1120px,calc(100% - 3rem))}
.premium-page #main .section{padding-block:64px}
.premium-page #main .section-heading{
 display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:0;
 max-width:50rem;margin:0 auto 28px;text-align:center;
}
.premium-page #main .section-heading .eyebrow{margin:0 0 12px}
.premium-page #main .section-heading h2{max-width:46rem;margin:0}
.premium-page #main .section-heading .section-support{
 max-width:40rem;margin:12px auto 0;font-size:var(--ch-body);line-height:var(--ch-body-lh);
}

/* 버튼의 채널 색과 포커스 계약. */
.premium-page .button{
 display:inline-flex;align-items:center;justify-content:center;gap:.625rem;
 min-height:56px;padding:0 24px;border-radius:var(--radius-control);
 font-size:1.125rem;line-height:1.55;font-weight:700;letter-spacing:-.01em;
 background:var(--accent);color:var(--on-brand);border:1px solid var(--accent);text-decoration:none;
}
.premium-page .button:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.premium-page .button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.premium-page .button-secondary{background:var(--surface);color:var(--ink);border-color:var(--input)}
.premium-page .button-small{min-height:44px;padding:0 16px;font-size:var(--ch-small)}
.premium-page .direct-phone{background:var(--accent);color:var(--on-brand);border-color:var(--accent)}
.premium-page .direct-phone:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.premium-page .direct-kakao{background:var(--kakao);color:var(--kakao-ink);border-color:var(--kakao-line)}
.premium-page .direct-kakao:hover{background:var(--kakao-hover);color:var(--kakao-ink);border-color:var(--kakao-line)}
.premium-page .site-footer .direct-phone{border-color:#B9C4CE;background:transparent;color:#fff}
.premium-page .site-footer .direct-phone:hover{background:#243347;border-color:#B9C4CE}

/* 첫 화면: 원고와 360px 인물 묶음의 비율을 맞추고 사진과 정보 카드 폭을 일치시킵니다. */
.premium-page #main .premium-hero:not(.hero-statement){
 grid-template-columns:minmax(0,1fr) minmax(19rem,22.5rem);gap:clamp(2.5rem,5vw,5rem);
 padding-block:64px;align-items:center;
}
.premium-page #main .hero-copy{max-width:42rem}
.premium-page #main .hero-description{max-width:36rem;margin-top:20px;font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .hero-actions{margin-top:28px;gap:12px 20px}
.premium-page #main .hero-note{max-width:36rem;margin-top:14px}
.premium-page #main .hero-visual{
 display:flex;flex-direction:column;align-items:stretch;gap:0;width:100%;max-width:22.5rem;
 padding:0;justify-self:end;min-width:0;
}
.premium-page #main .hero-visual .adviser-card{width:100%;max-width:none;align-self:stretch}
.premium-page #main .hero-visual .portrait-figure{width:100%;max-width:none;padding:0;border:0}
.premium-page #main .hero-visual .portrait-figure>img{width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;object-position:50% 15%}
.premium-page #main .hero-visual .hero-scene{position:static;margin:0}
.premium-page #main .hero-visual .hero-scene img{width:100%;height:auto;aspect-ratio:3/2;object-fit:cover}
.premium-page #main .hero-visual .hero-scene figcaption{
 position:static;margin:10px 0 16px;text-align:right;font-size:var(--ch-small);line-height:var(--ch-small-lh);color:var(--muted);
}
.premium-page .adviser-card{
 display:flex;align-items:center;justify-content:center;max-width:22.5rem;padding:28px;
 background:var(--ink);color:var(--on-brand);text-align:center;
}
.premium-page .adviser-card .adviser-details{
 display:flex;flex-direction:column;gap:14px;width:max-content;max-width:100%;min-width:0;
}
.premium-page .adviser-card p,.premium-page .adviser-card span{color:var(--detail)}
.premium-page .adviser-card .adviser-role,.premium-page .adviser-card .adviser-hours{font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page .adviser-card .adviser-name{font-size:2.75rem;line-height:1.3;font-weight:700;color:var(--on-brand)}
.premium-page .adviser-card .adviser-org{font-size:1.125rem;line-height:1.6}
.premium-page .adviser-card .adviser-phone{font-size:1.625rem;line-height:1.45;font-weight:700;color:var(--on-brand);text-decoration:none}
.premium-page .adviser-card .adviser-phone:hover{text-decoration:underline}
.premium-page #main .hero-statement{max-width:56rem;grid-template-columns:1fr;gap:28px;padding-block:64px;text-align:center}
.premium-page #main .hero-statement .hero-copy,.premium-page #main .hero-statement .hero-description{margin-inline:auto}
.premium-page #main .hero-statement .hero-actions{justify-content:center}
.premium-page #main .hero-statement-person{
 display:flex;flex-flow:row wrap;align-items:stretch;justify-content:center;gap:0;
 width:100%;max-width:40rem;margin-inline:auto;justify-self:center;text-align:left;
}
.premium-page #main .hero-statement-person>img{flex:0 1 15rem;width:15rem;height:auto;aspect-ratio:3/4;object-fit:cover;object-position:50% 15%}
.premium-page #main .hero-statement-person .adviser-card{flex:1 1 20rem;width:auto;max-width:22.5rem}

/* 서비스: 제목과 설명을 같은 묶음으로 읽는 compact grid. */
.premium-page #main .service-grid{border-top:1px solid var(--input)}
.premium-page #main .service-card,.premium-page #main .service-card:first-child,
.premium-page #main .service-card:nth-child(3){min-width:0;margin:0;border:0;border-bottom:1px solid var(--line);background:transparent}
.premium-page #main .service-card .section-index{margin:0;color:var(--accent);font-size:var(--ch-small);line-height:1.6;font-weight:700}
.premium-page #main .service-copy{min-width:0}
.premium-page #main .service-copy h3{margin:0;font-size:var(--ch-card);line-height:var(--ch-card-lh)}
.premium-page #main .service-copy p{margin:6px 0 0;font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .service-link{
 display:flex;align-items:center;justify-content:center;align-self:center;width:44px;min-width:44px;height:44px;min-height:44px;
 color:var(--accent);text-decoration:none;
}
.premium-page #main .services-list{
 display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;border-top:1px solid var(--input);
}
.premium-page #main .services-list .service-card{
 display:grid;grid-template-columns:28px minmax(0,1fr) 44px;align-items:start;gap:16px;padding:22px 20px;
}
.premium-page #main .services-list .service-card:last-child:nth-child(odd){
 grid-column:1/-1;width:calc(50% - 12px);justify-self:center;
}
.premium-page #main .services-cards{grid-template-columns:repeat(6,minmax(0,1fr));gap:24px;border-top:0}
.premium-page #main .services-cards .service-card{
 display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:22px 0;border-top:1px solid var(--input);grid-column:span 2;
}
.premium-page #main .services-cards .service-link{margin-top:auto}
.premium-page #main .services-cards .service-card:last-child:nth-child(3n+1){grid-column:3/span 2}
.premium-page #main .services-cards .service-card:nth-last-child(2):nth-child(3n+1){grid-column:2/span 2}
.premium-page #main .services-cards .service-card:last-child:nth-child(3n+2){grid-column:4/span 2}
.premium-page #main .services-cards[data-count="2"],.premium-page #main .services-cards[data-count="4"]{grid-template-columns:repeat(2,minmax(0,1fr))}
.premium-page #main .services-cards[data-count="2"] .service-card:nth-child(n),.premium-page #main .services-cards[data-count="4"] .service-card:nth-child(n){grid-column:auto}
.premium-page #main .services-cards[data-count="5"]{grid-template-columns:repeat(6,minmax(0,1fr))}
.premium-page #main .services-cards[data-count="5"] .service-card{grid-column:span 2}
.premium-page #main .services-cards[data-count="5"] .service-card:nth-child(4){grid-column:2/span 2}
.premium-page #main .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:4/span 2}
.premium-page #main .services-split{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;border-top:0}
.premium-page #main .services-split .service-card,
.premium-page #main .services-split .service-card:first-child{
 display:grid;grid-template-columns:28px minmax(0,1fr) 44px;align-items:start;gap:16px;
 grid-row:auto;padding:22px 20px;background:transparent;border-top:1px solid var(--input);
}
.premium-page #main .services-split .service-link{grid-column:3;grid-row:1;align-self:start;margin:0}
.premium-page #main .services-split .service-card:last-child:nth-child(odd){
 grid-column:1/-1;width:calc(50% - 14px);justify-self:center;
}

/* 소개: editorial은 한 줄기, profile은 사진과 본문의 압축된 2열을 유지합니다. */
.premium-page #main .about-grid{align-items:start}
.premium-page #main .about-editorial{display:block;max-width:50rem;margin-inline:auto;text-align:center}
.premium-page #main .about-heading{max-width:48rem;margin-inline:auto;text-align:center}
.premium-page #main .about-heading .eyebrow{margin:0 0 12px}
.premium-page #main .about-heading h2{margin:0;text-wrap:balance}
.premium-page #main .about-heading .philosophy{max-width:42rem;margin:12px auto 0;padding:0;border:0;font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .about-copy{max-width:48rem;margin:28px auto 0;text-align:left}
.premium-page #main .about-copy>p{font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .about-copy .adviser-signature{justify-content:center;margin-top:28px;text-align:left}
.premium-page #main .agent-facts{
 display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;margin-top:28px;border-top:1px solid var(--line);
}
.premium-page #main .agent-facts>div{display:grid;grid-template-columns:min(6.5rem,40%) minmax(0,1fr);gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.premium-page #main .agent-facts dt,.premium-page #main .agent-facts dd{font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page #main .about-profile{grid-template-columns:minmax(17rem,22.5rem) minmax(0,1fr);gap:48px;max-width:62rem;margin-inline:auto}
.premium-page #main .about-profile .about-portrait{width:100%;max-width:22.5rem;margin:0}
.premium-page #main .about-profile .about-portrait>img{width:100%;height:auto;max-height:none;aspect-ratio:3/4;object-fit:cover;object-position:50% 16%}
.premium-page #main .about-profile .about-heading{text-align:left;margin:0}
.premium-page #main .about-profile .about-copy{margin:24px 0 0}
.premium-page #main .about-profile .about-copy .adviser-signature{justify-content:flex-start}
.premium-page #main .about-quote{display:block;max-width:50rem;margin-inline:auto;text-align:center}
.premium-page #main .about-quote blockquote{
 max-width:48rem;margin:28px auto;padding:24px 0;border-block:1px solid var(--input);
 font-size:clamp(1.5rem,2.2vw,1.875rem);line-height:1.65;overflow-wrap:anywhere;text-wrap:balance;
}
.premium-page #main .about-quote .about-copy{margin-top:0}

/* 상담 과정: timeline도 3개의 동등한 단계 패널로 읽습니다. */
.premium-page #main .process-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.premium-page #main .process-grid li{display:flex;flex-direction:column;min-width:0;gap:14px;padding:24px 0 0;border-top:1px solid var(--input)}
.premium-page #main .process-grid li>div{display:block;min-width:0}
.premium-page #main .process-number{margin:0;color:var(--accent);font-size:1.25rem;line-height:1.5;font-weight:700}
.premium-page #main .process-grid h3{margin:0;font-size:var(--ch-card);line-height:var(--ch-card-lh)}
.premium-page #main .process-grid p{margin:8px 0 0;font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .process-steps{gap:28px}
.premium-page #main .process-steps .process-number{font-size:2rem;font-weight:400}

/* FAQ: 제목 아래 880px accordion. columns 옵션은 같은 폭 안에서 2열을 유지합니다. */
.premium-page #main .faq-section{display:block}
.premium-page #main .faq-list{width:min(100%,55rem);margin-inline:auto;border-top:1px solid var(--input)}
.premium-page #main .faq-list details{padding:0;border:0;border-bottom:1px solid var(--line);background:transparent}
.premium-page #main .faq-list summary{
 display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 0;
 font-size:1.3125rem;line-height:1.55;font-weight:700;color:var(--ink);
}
.premium-page #main .faq-list summary>.faq-question{display:flex;gap:12px;flex:1 1 auto;min-width:0;transform:none}
.premium-page #main .faq-list summary>span:last-child{flex:0 0 auto;font-size:1.5rem;line-height:1.4;font-weight:400}
.premium-page #main .faq-list details[open]{background:transparent}
.premium-page #main .faq-list details[open] summary{padding-bottom:10px}
.premium-page #main .faq-list details>p{max-width:49rem;margin:0;padding:0 0 20px 40px;font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .faq-number{flex:0 0 auto;margin:0;padding-top:2px;color:var(--accent);font-size:var(--ch-small);font-weight:700}
.premium-page #main .faq-columns .faq-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;border-top:0}
.premium-page #main .faq-columns .faq-list details{border-top:1px solid var(--input)}

/* 연락: 중앙 안내, 작은 담당자 identity, 780px 직접 연락 패널. */
.premium-page #main .contact-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:28px;max-width:1120px}
.premium-page #main .contact-copy{max-width:40rem;margin-inline:auto;padding:0;text-align:center}
.premium-page #main .contact-copy .eyebrow{margin:0 0 12px}
.premium-page #main .contact-copy h2{max-width:38rem;margin-inline:auto}
.premium-page #main .contact-copy>p{max-width:40rem;margin:12px auto 0}
.premium-page #main .contact-person{display:inline-flex;align-items:center;justify-content:center;gap:14px;margin:24px auto 0;text-align:left}
.premium-page #main .contact-person>img{width:64px;height:85px;flex:0 0 64px;object-fit:cover;object-position:50% 15%}
.premium-page #main .contact-person strong{font-size:1.25rem;line-height:1.5}
.premium-page #main .contact-person span{font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page #main .direct-contact-panel{width:min(100%,48.75rem);margin-inline:auto;padding:28px;border:1px solid var(--line);background:var(--paper);text-align:center}
.premium-page #main .direct-contact-panel>.eyebrow{margin:0 0 12px}
.premium-page #main .direct-contact-panel h3{max-width:36rem;margin:0 auto;font-size:var(--ch-h3);line-height:var(--ch-h3-lh);text-wrap:balance}
.premium-page #main .direct-contact-panel>.direct-contact-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}
.premium-page #main .direct-contact-panel>.direct-contact-actions:has(>a:only-child){grid-template-columns:1fr}
.premium-page #main .direct-contact-panel>.direct-contact-actions .button{width:100%;min-width:0}
.premium-page #main .direct-contact-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;margin:24px 0;border-block:1px solid var(--line);text-align:left}
.premium-page #main .direct-contact-details>div{display:grid;grid-template-columns:1fr;gap:4px;padding:14px 20px;border:0}
.premium-page #main .direct-contact-details>div:nth-child(even){border-left:1px solid var(--line)}
.premium-page #main .direct-contact-details>div:nth-child(n+3){border-top:1px solid var(--line)}
.premium-page #main .direct-contact-details>div:last-child:nth-child(odd){grid-column:1/-1}
.premium-page #main .direct-contact-details dt{font-size:var(--ch-small);line-height:var(--ch-small-lh);color:var(--muted)}
.premium-page #main .direct-contact-details dd{font-size:var(--ch-body);line-height:var(--ch-body-lh);overflow-wrap:anywhere}
.premium-page #main .direct-contact-panel>.support-note,.premium-page #main .direct-contact-panel>.demo-contact-notice{margin:0;text-align:left;font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page #main .direct-contact-panel>.demo-contact-notice{margin-top:14px}

.premium-page #main .location-section{text-align:center}
.premium-page #main .location-section h2{max-width:48rem;margin-inline:auto;font-size:1.25rem;line-height:1.6}
.premium-page #main .location-section .text-link{margin-top:20px}

/* footer의 어두운 바닥에서는 팔레트의 흐린 본문색을 쓰지 않습니다. */
.premium-page .site-footer h2,.premium-page .site-footer p,.premium-page .site-footer a,
.premium-page .site-footer dt,.premium-page .site-footer dd{color:#F7F6F0}
.premium-page .site-footer .footer-legal p{color:#CBD3DC}
.premium-page .site-footer .direct-kakao{color:var(--kakao-ink)}

@media(max-width:900px){
 .premium-page #main .container{width:min(1120px,calc(100% - 3rem))}
 .premium-page #main .section{padding-block:48px}
 .premium-page #main .premium-hero:not(.hero-statement){grid-template-columns:minmax(0,1fr) minmax(18rem,21rem);gap:32px;padding-block:48px}
 .premium-page #main .hero-statement{padding-block:48px}
 .premium-page #main .services-cards[data-count],.premium-page #main .services-split[data-count]{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px}
 .premium-page #main .services-cards[data-count] .service-card,
 .premium-page #main .services-cards[data-count] .service-card:nth-last-child(2),
 .premium-page #main .services-cards[data-count] .service-card:last-child{grid-column:auto;width:auto;justify-self:stretch}
 .premium-page #main .services-cards[data-count="5"] .service-card:nth-child(4),.premium-page #main .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:auto}
 .premium-page #main .services-cards[data-count] .service-card:last-child:nth-child(odd),
 .premium-page #main .services-split[data-count] .service-card:last-child:nth-child(odd){grid-column:1/-1;width:calc(50% - 12px);justify-self:center}
 .premium-page #main .about-profile{grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}
 .premium-page #main .about-profile .agent-facts{grid-template-columns:minmax(0,1fr)}
 .premium-page #main .about-profile .adviser-signature{flex-wrap:wrap}
}
@media(max-width:650px){
 .premium-page{--ch-display:clamp(2.25rem,11vw,2.625rem);--ch-h2:clamp(1.75rem,8vw,1.875rem);--ch-body:1.125rem;--ch-body-lh:1.65}
 .premium-page #main .container{width:calc(100% - 2.5rem)}
 .premium-page #main .section{padding-block:40px}
 .premium-page #main .section-heading{margin-bottom:28px}
 .premium-page #main .premium-hero:not(.hero-statement),.premium-page #main .hero-statement{grid-template-columns:minmax(0,1fr);gap:28px;padding-block:40px}
 .premium-page #main .hero-visual{max-width:none;justify-self:stretch}
 .premium-page #main .hero-actions{display:block}
 .premium-page #main .hero-actions>.text-link{margin-top:12px}
 .premium-page #main .hero-statement-person{flex-wrap:wrap;max-width:22.5rem}
 .premium-page #main .hero-statement-person>img{flex:0 0 100%;width:100%;max-width:none}
 .premium-page #main .hero-statement-person .adviser-card{flex:0 0 100%;width:100%;max-width:none}
 .premium-page .adviser-card{max-width:none;padding:28px}
 .premium-page .adviser-card .adviser-name{font-size:2.25rem}
 .premium-page .adviser-card .adviser-phone{font-size:1.375rem}
 .premium-page #main .services-list,.premium-page #main .services-cards[data-count],.premium-page #main .services-split[data-count]{grid-template-columns:minmax(0,1fr);gap:0}
 .premium-page #main .services-list .service-card,.premium-page #main .services-list[data-count] .service-card:last-child:nth-child(odd),
 .premium-page #main .services-cards[data-count] .service-card,.premium-page #main .services-cards[data-count="3"] .service-card:last-child,.premium-page #main .services-cards[data-count="5"] .service-card:last-child,
 .premium-page #main .services-split[data-count] .service-card,.premium-page #main .services-cards[data-count] .service-card:last-child:nth-child(odd),.premium-page #main .services-split[data-count] .service-card:last-child:nth-child(odd){grid-column:auto;width:auto;justify-self:stretch}
 .premium-page #main .services-list .service-card,.premium-page #main .services-split .service-card,.premium-page #main .services-split .service-card:first-child{padding:20px 0;gap:12px}
 .premium-page #main .services-cards[data-count="5"] .service-card:nth-child(4),.premium-page #main .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:auto}
 .premium-page #main .about-profile{grid-template-columns:minmax(0,1fr);gap:28px}
 .premium-page #main .about-profile .about-portrait{max-width:22.5rem;margin-inline:auto}
 .premium-page #main .about-profile .about-heading{text-align:center}
 .premium-page #main .agent-facts{grid-template-columns:minmax(0,1fr);gap:0}
 .premium-page #main .about-copy .adviser-signature,.premium-page #main .about-profile .about-copy .adviser-signature{justify-content:center}
 .premium-page #main .about-quote blockquote{text-align:left}
 .premium-page #main .process-grid{grid-template-columns:minmax(0,1fr);gap:24px}
 .premium-page #main .process-grid li{display:grid;grid-template-columns:36px minmax(0,1fr);gap:12px;padding-top:20px}
 .premium-page #main .process-number{grid-row:1;grid-column:1;font-size:1.125rem}
 .premium-page #main .process-grid li>div{grid-column:2}
 .premium-page #main .process-steps .process-number{font-size:1.5rem}
 .premium-page #main .faq-list summary{font-size:1.25rem;padding-block:20px}
 .premium-page #main .faq-list details>p{padding-left:0}
 .premium-page #main .faq-columns .faq-list{grid-template-columns:minmax(0,1fr);gap:0}
 .premium-page #main .contact-grid{gap:24px}
 .premium-page #main .contact-person{margin-top:20px}
 .premium-page #main .direct-contact-panel{padding:24px 20px}
 .premium-page #main .direct-contact-panel>.direct-contact-actions{grid-template-columns:minmax(0,1fr)}
 .premium-page #main .direct-contact-details{grid-template-columns:minmax(0,1fr)}
 .premium-page #main .direct-contact-details>div{padding:12px 0}
 .premium-page #main .direct-contact-details>div:nth-child(even){border-left:0}
 .premium-page #main .direct-contact-details>div+div{border-left:0;border-top:1px solid var(--line)}
}
@media(max-width:767px){
 .premium-page [data-studio-entry]{display:none!important}
 .premium-page .sample-settings{display:none}
}
@media(max-width:380px){
 .premium-page #main .container{width:calc(100% - 2rem)}
 .premium-page #main .services-list .service-card,.premium-page #main .services-split .service-card,.premium-page #main .services-split .service-card:first-child{grid-template-columns:24px minmax(0,1fr) 44px;gap:10px}
}
@media print{
 .premium-page #main .container{width:100%}
 .premium-page #main .section{padding-block:24px}
}
`;

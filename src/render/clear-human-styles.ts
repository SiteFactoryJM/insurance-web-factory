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
 --ch-display:clamp(2.75rem,4.8vw,3.75rem);--ch-display-lh:1.25;
 --ch-h2:clamp(2rem,3vw,2.5rem);--ch-h2-lh:1.35;
 --ch-h3:1.375rem;--ch-h3-lh:1.545;
 --ch-card:1.375rem;--ch-card-lh:1.545;
 --ch-body:1.125rem;--ch-body-lh:1.6667;
 --ch-small:1rem;--ch-small-lh:1.625;
 font-family:var(--ch-font);font-size:var(--ch-body);line-height:var(--ch-body-lh);
}
.premium-page h1,.premium-page h2,.premium-page h3{
 font-family:var(--ch-font);font-weight:700;letter-spacing:-.03em;
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
.premium-page #main .section{padding-block:48px}
.premium-page #main .section-heading{
 display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:0;
 max-width:50rem;margin:0 auto 22px;text-align:center;
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
.premium-page .direct-instagram{background:linear-gradient(135deg,#76596F 0%,#966278 48%,#AE6C76 72%,#BE7968 100%);color:#fff;border-color:#966278}
.premium-page .direct-instagram:hover{background:linear-gradient(135deg,#684E62 0%,#85566A 48%,#9A6068 72%,#AA6B5C 100%);color:#fff;border-color:#85566A}
.premium-page .brand-logo{width:80px;height:80px;object-fit:contain;flex:0 0 auto}
.premium-page .site-footer .direct-phone{border-color:#B9C4CE;background:transparent;color:#fff}
.premium-page .site-footer .direct-phone:hover{background:#243347;border-color:#B9C4CE}

/* 첫 화면: 사진을 먼저 읽고 본문으로 이어지도록 360px 인물 묶음을 첫 열에 둡니다. */
.premium-page #main .premium-hero:not(.hero-statement){
 grid-template-columns:minmax(18rem,20.5rem) minmax(0,1fr);gap:clamp(2.75rem,5.25vw,5rem);
 padding-block:48px;align-items:stretch;
}
.premium-page #main .hero-copy{max-width:42rem}
.premium-page #main .premium-hero:not(.hero-statement) .hero-copy{align-self:stretch;display:flex;flex-direction:column;justify-content:flex-start;padding:12px 0 0}
.premium-page #main .hero-brand-feature{position:relative;isolation:isolate;width:100%;min-height:188px;margin:0 0 26px;overflow:hidden}
.premium-page #main .hero-brand-soft-panel,.premium-page #main .hero-brand-gold-wave{display:grid;grid-template-columns:minmax(0,1.2fr) 1px minmax(10rem,.8fr);gap:24px;align-items:center;padding:26px 30px;border-radius:8px}
.premium-page #main .hero-brand-soft-panel{background:linear-gradient(120deg,#fffdfa 0%,#fbf6ec 58%,#f4ead9 100%);border:1px solid #efe3cf;box-shadow:0 12px 30px rgba(108,84,46,.06)}
.premium-page #main .hero-brand-gold-wave{background:#fffdf8;border:1px solid #dcb66e;box-shadow:0 12px 30px rgba(108,84,46,.05)}
.premium-page #main .brand-panel-logo{position:relative;z-index:2;min-width:0}
.premium-page #main .brand-panel-logo img{display:block;width:min(100%,23rem);height:auto;max-height:8rem;margin-inline:auto;object-fit:contain;object-position:center}
.premium-page #main .brand-panel-divider{position:relative;z-index:2;display:block;width:1px;height:86px;background:rgba(163,132,82,.38)}
.premium-page #main .brand-panel-copy{position:relative;z-index:2;min-width:0;color:#4b4034}
.premium-page #main .brand-panel-copy p{margin:0;font-family:var(--ch-font);font-size:clamp(1rem,1.45vw,1.2rem);line-height:1.6;font-weight:500;letter-spacing:-.025em;color:#4b4034;text-wrap:balance}
.premium-page #main .brand-panel-copy span{display:block;margin-top:14px;font-size:.68rem;line-height:1.5;letter-spacing:.28em;color:#6f655c;overflow-wrap:anywhere}
.premium-page #main .brand-panel-wave{position:absolute;z-index:1;pointer-events:none}
.premium-page #main .hero-brand-soft-panel .brand-panel-wave{right:-68px;bottom:-118px;width:290px;height:290px;border:34px solid rgba(220,181,112,.10);border-radius:50%;box-shadow:0 0 0 34px rgba(220,181,112,.055),0 0 0 68px rgba(220,181,112,.035)}
.premium-page #main .hero-brand-gold-wave .brand-panel-wave{left:-8%;right:-8%;bottom:-112px;height:175px;border-top:1px solid rgba(212,168,92,.45);border-radius:50% 50% 0 0 / 100% 100% 0 0;transform:rotate(-2deg);box-shadow:0 -18px 0 rgba(226,194,132,.075),0 -36px 0 rgba(226,194,132,.045)}
.premium-page #main .hero-copy-brand-watermark{position:relative;isolation:isolate;overflow:visible;padding-inline:0}
.premium-page #main .hero-watermark-zone{position:static;margin:0 0 4px;padding:42px 0 24px}
.premium-page #main .hero-watermark-zone>.hero-brand-watermark{
 position:absolute;top:0;right:clamp(-8.5rem,-8vw,-3rem);bottom:-18px;left:clamp(-4.5rem,-5vw,-2rem);
 z-index:0;width:auto;height:auto;min-height:0;margin:0;pointer-events:none;
 background:url('/assets/haeon-watermark-wave.png') center 40% / cover no-repeat;
 opacity:.82;
 -webkit-mask-image:radial-gradient(ellipse 92% 86% at 62% 34%,#000 0%,#000 54%,rgba(0,0,0,.92) 66%,rgba(0,0,0,.58) 80%,transparent 100%);
 mask-image:radial-gradient(ellipse 92% 86% at 62% 34%,#000 0%,#000 54%,rgba(0,0,0,.92) 66%,rgba(0,0,0,.58) 80%,transparent 100%);
}
.premium-page #main .hero-watermark-zone>.eyebrow,.premium-page #main .hero-watermark-zone>h1,
.premium-page #main .hero-copy-brand-watermark>.hero-description,.premium-page #main .hero-copy-brand-watermark>.hero-topics,
.premium-page #main .hero-copy-brand-watermark>.hero-actions,.premium-page #main .hero-copy-brand-watermark>.hero-note{position:relative;z-index:1}
.premium-page #main .hero-copy-brand-watermark .hero-description{margin-top:78px}
.premium-page #main .premium-hero:not(.hero-statement) .hero-copy>.eyebrow{margin-top:auto}
.premium-page #main .hero-description{max-width:36rem;margin-top:16px;font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .hero-actions{margin-top:22px;gap:12px 20px}
.premium-page #main .premium-hero:not(.hero-statement) .hero-note{max-width:36rem;margin-top:14px;margin-bottom:0;padding-top:0}
.premium-page #main .hero-visual{
 display:flex;flex-direction:column;align-items:stretch;gap:0;width:100%;max-width:20.5rem;
 padding:0;justify-self:start;min-width:0;
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
 display:flex;align-items:center;justify-content:center;max-width:20.5rem;padding:22px 24px 24px;
 background:var(--ink);color:var(--on-brand);text-align:center;
}
.premium-page .adviser-card .adviser-details{
 display:flex;flex-direction:column;gap:10px;width:max-content;max-width:100%;min-width:0;
}
.premium-page .adviser-card p,.premium-page .adviser-card span{color:var(--detail)}
.premium-page .adviser-card .adviser-role,.premium-page .adviser-card .adviser-hours{font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page .adviser-card .adviser-name{font-size:2.5rem;line-height:1.28;font-weight:700;color:var(--on-brand)}
.premium-page .adviser-card .adviser-org{font-size:1.0625rem;line-height:1.55}
.premium-page .adviser-card .adviser-phone{font-size:1.5rem;line-height:1.45;font-weight:700;color:var(--on-brand);text-decoration:none}
.premium-page .adviser-card .adviser-phone:hover{text-decoration:underline}
.premium-page #main .hero-statement{max-width:56rem;grid-template-columns:1fr;gap:24px;padding-block:48px;text-align:center}
.premium-page #main .hero-statement .hero-copy,.premium-page #main .hero-statement .hero-description{margin-inline:auto}
.premium-page #main .hero-statement .hero-brand-feature{width:min(100%,52rem);margin-inline:auto}
.premium-page #main .hero-statement .hero-brand-soft-panel,.premium-page #main .hero-statement .hero-brand-gold-wave{text-align:left}
.premium-page #main .hero-statement .brand-panel-logo img{margin-inline:auto}
.premium-page #main .hero-statement .brand-panel-copy{text-align:left}
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
 display:grid;grid-template-columns:28px minmax(0,1fr);align-items:start;gap:16px;padding:22px 20px;
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
 display:grid;grid-template-columns:28px minmax(0,1fr);align-items:start;gap:16px;
 grid-row:auto;padding:22px 20px;background:transparent;border-top:1px solid var(--input);
}
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
.premium-page #main .about-copy{max-width:48rem;margin:22px auto 0;text-align:left}
.premium-page #main .about-copy>p{font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page #main .about-copy .adviser-signature{justify-content:center;margin-top:28px;text-align:left}
.premium-page #main .agent-facts{
 display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;margin-top:22px;border-top:1px solid var(--line);
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
.premium-page #main .process-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
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
.premium-page #main .direct-contact-panel{width:min(100%,48.75rem);margin-inline:auto;padding:24px;border:1px solid var(--line);background:var(--paper);text-align:center}
.premium-page #main .direct-contact-panel>.eyebrow{margin:0 0 12px}
.premium-page #main .direct-contact-panel h3{max-width:36rem;margin:0 auto;font-size:var(--ch-h3);line-height:var(--ch-h3-lh);text-wrap:balance}
.premium-page #main .direct-contact-panel>.direct-contact-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}
.premium-page #main .direct-contact-panel>.direct-contact-actions:has(>a:nth-child(3)){grid-template-columns:repeat(3,minmax(0,1fr))}
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
.premium-page .footer-brand-end{display:flex;flex-direction:column;align-items:flex-end;gap:.75rem}
.premium-page .footer-brand-logo{display:block;width:88px;height:88px;object-fit:contain}

.gallery-page #main .gallery-header{max-width:52rem;margin-inline:auto;text-align:center}
.gallery-page #main .gallery-header>p{max-width:42rem;margin-inline:auto}
.gallery-page #main .gallery-header .button{margin-inline:auto}

.premium-page #main .hero-editorial .adviser-card{padding:22px 24px}
.premium-page #main .hero-editorial .adviser-card .adviser-details{gap:10px}
.premium-page #main .hero-editorial .adviser-card .adviser-name{font-size:2.25rem}
.premium-page #main .hero-editorial .adviser-card .adviser-phone{font-size:1.4rem}

@media(max-width:900px){
 .premium-page #main .container{width:min(1120px,calc(100% - 3rem))}
 .premium-page #main .section{padding-block:32px}
 .premium-page #main .premium-hero:not(.hero-statement){grid-template-columns:minmax(0,1fr);gap:28px;padding-block:40px}
 .premium-page #main .premium-hero:not(.hero-statement) .hero-visual{max-width:20.5rem;justify-self:start}
 .premium-page #main .hero-statement{padding-block:40px}
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
 .premium-page{--ch-display:clamp(2.125rem,9.5vw,2.375rem);--ch-h2:clamp(1.75rem,8vw,1.875rem);--ch-body:1.125rem;--ch-body-lh:1.65}
 .premium-page #main .container{width:calc(100% - 2.5rem)}
 .premium-page #main .section{padding-block:40px}
 .premium-page #main .section-heading{margin-bottom:22px}
 .premium-page #main .premium-hero:not(.hero-statement),.premium-page #main .hero-statement{grid-template-columns:minmax(0,1fr);gap:24px;padding-block:32px}
 .premium-page #main .hero-visual{max-width:none;justify-self:stretch}
 .premium-page #main .hero-brand-feature{min-height:0;margin-bottom:20px}
 .premium-page #main .hero-brand-soft-panel,.premium-page #main .hero-brand-gold-wave{grid-template-columns:minmax(0,1fr);gap:14px;padding:20px 18px}
 .premium-page #main .brand-panel-logo img{width:min(100%,18rem);max-height:6.75rem}
 .premium-page #main .brand-panel-divider{width:56px;height:1px;margin-inline:auto}
 .premium-page #main .brand-panel-copy{text-align:center}
 .premium-page #main .brand-panel-copy p{font-size:1rem}
 .premium-page #main .brand-panel-copy span{margin-top:9px;font-size:.62rem;letter-spacing:.18em}
 .premium-page #main .hero-brand-soft-panel .brand-panel-wave{right:-100px;bottom:-155px}
 .premium-page #main .hero-brand-gold-wave .brand-panel-wave{bottom:-135px}
 .premium-page #main .hero-copy-brand-watermark{position:relative;overflow:visible;padding:0}
 .premium-page #main .hero-watermark-zone{margin-bottom:2px;padding:26px 0 18px}
 .premium-page #main .hero-watermark-zone>.hero-brand-watermark{
  top:-12px;right:-20px;bottom:auto;left:-20px;height:clamp(320px,105vw,430px);
  background-position:62% 34%;opacity:.72;
  -webkit-mask-image:radial-gradient(ellipse 105% 88% at 60% 30%,#000 0%,#000 52%,rgba(0,0,0,.88) 68%,rgba(0,0,0,.48) 82%,transparent 100%);
  mask-image:radial-gradient(ellipse 105% 88% at 60% 30%,#000 0%,#000 52%,rgba(0,0,0,.88) 68%,rgba(0,0,0,.48) 82%,transparent 100%);
 }
 .premium-page #main .hero-copy-brand-watermark .hero-description{margin-top:16px}
 .premium-page #main .hero-actions{display:block}
 .premium-page #main .hero-actions>.text-link{margin-top:12px}
 .premium-page #main .hero-statement-person{flex-wrap:wrap;max-width:22.5rem}
 .premium-page #main .hero-statement-person>img{flex:0 0 100%;width:100%;max-width:none}
 .premium-page #main .hero-statement-person .adviser-card{flex:0 0 100%;width:100%;max-width:none}
 .premium-page .adviser-card{max-width:none;padding:24px 22px}
 .premium-page .adviser-card .adviser-name{font-size:2.25rem}
 .premium-page .adviser-card .adviser-phone{font-size:1.375rem}
 .premium-page #main .services-list,.premium-page #main .services-cards[data-count],.premium-page #main .services-split[data-count]{grid-template-columns:minmax(0,1fr);gap:0}
 .premium-page #main .services-list .service-card,.premium-page #main .services-list[data-count] .service-card:last-child:nth-child(odd),
 .premium-page #main .services-cards[data-count] .service-card,.premium-page #main .services-cards[data-count="3"] .service-card:last-child,.premium-page #main .services-cards[data-count="5"] .service-card:last-child,
 .premium-page #main .services-split[data-count] .service-card,.premium-page #main .services-cards[data-count] .service-card:last-child:nth-child(odd),.premium-page #main .services-split[data-count] .service-card:last-child:nth-child(odd){grid-column:auto;width:auto;justify-self:stretch}
 .premium-page #main .services-list .service-card,.premium-page #main .services-split .service-card,.premium-page #main .services-split .service-card:first-child{padding:18px 16px;gap:12px}
 .premium-page #main .services-cards[data-count="5"] .service-card:nth-child(4),.premium-page #main .services-cards[data-count="5"] .service-card:nth-child(5){grid-column:auto}
 .premium-page #main .services-cards[data-count] .service-card{padding:18px 16px}
 .premium-page #main .about-profile{grid-template-columns:minmax(0,1fr);gap:28px}
 .premium-page #main .about-profile .about-portrait{max-width:22.5rem;margin-inline:auto}
 .premium-page #main .about-profile .about-heading{text-align:center}
 .premium-page #main .agent-facts{grid-template-columns:minmax(0,1fr);gap:0}
 .premium-page #main .about-copy .adviser-signature,.premium-page #main .about-profile .about-copy .adviser-signature{justify-content:center}
 .premium-page #main .about-quote blockquote{text-align:left}
 .premium-page #main .process-grid{grid-template-columns:minmax(0,1fr);gap:24px}
 .premium-page #main .process-grid li{display:grid;grid-template-columns:36px minmax(0,1fr);gap:12px;padding:18px 16px 0}
 .premium-page #main .process-number{grid-row:1;grid-column:1;font-size:1.125rem}
 .premium-page #main .process-grid li>div{grid-column:2}
 .premium-page #main .process-steps .process-number{font-size:1.5rem}
 .premium-page #main .faq-list summary{font-size:1.25rem;padding:18px 12px}
 .premium-page #main .faq-list details>p{padding:0 12px 18px}
 .premium-page #main .faq-columns .faq-list{grid-template-columns:minmax(0,1fr);gap:0}
 .premium-page #main .contact-grid{gap:24px}
 .premium-page #main .contact-person{margin-top:20px}
 .premium-page #main .direct-contact-panel{padding:22px 18px}
 .premium-page #main .direct-contact-panel>.direct-contact-actions,.premium-page #main .direct-contact-panel>.direct-contact-actions:has(>a:nth-child(3)){grid-template-columns:minmax(0,1fr)}
 .premium-page .brand-logo{width:60px;height:60px}
 .premium-page .footer-brand-end{align-items:flex-start}
 .premium-page .footer-brand-logo{width:76px;height:76px}
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
 .premium-page #main .services-list .service-card,.premium-page #main .services-split .service-card,.premium-page #main .services-split .service-card:first-child{grid-template-columns:24px minmax(0,1fr);gap:10px}
}

/* Clear Human visual rhythm v4 */
html{scroll-behavior:smooth}

.premium-page{word-break:keep-all;overflow-wrap:break-word;max-width:100%;overflow-x:hidden}
.premium-page p,.premium-page li,.premium-page dd{word-break:keep-all;overflow-wrap:break-word;text-wrap:pretty}
.premium-page h1,.premium-page h2,.premium-page h3{word-break:keep-all;overflow-wrap:anywhere;text-wrap:balance;min-width:0;max-width:100%}
.premium-page #main .hero-copy{max-width:46rem}
.premium-page #main .hero-description{max-width:40rem;font-size:1.125rem;line-height:1.6667}
.premium-page #main .section-heading h2{max-width:50rem}
.premium-page #main .section-heading .section-support{max-width:44rem;font-size:1.125rem;line-height:1.6667}
.premium-page #main .section-heading::after{content:"";display:block;width:48px;height:2px;margin:18px auto 0;background:var(--accent)}

.premium-page #main .hero-topics{display:flex;flex-wrap:wrap;gap:8px;margin-top:30px;max-width:40rem}
.premium-page #main .hero-topics span{display:inline-flex;align-items:center;min-height:34px;max-width:100%;padding:5px 11px;border:1px solid var(--line);background:var(--tint);color:var(--ink);font-size:.9375rem;line-height:1.45;font-weight:600;overflow-wrap:anywhere}
.premium-page #main .premium-hero:not(.hero-statement) .hero-actions{margin-top:auto;padding-top:24px}
.premium-page #main .hero-actions{margin-top:28px}
@media(min-width:651px){
 .premium-page #main .premium-hero:not(.hero-statement) .hero-actions{padding-top:8px;transform:translateY(10px)}
 .premium-page #main .premium-hero:not(.hero-statement) .hero-note{margin-top:24px;transform:translateY(10px)}
}
@media(min-width:901px){
 .premium-page #main .hero-watermark-zone{padding-top:98px}
 .premium-page #main .hero-copy-brand-watermark .hero-description{margin-top:76px}
 .premium-page #main .hero-topics{margin-top:18px}
 .premium-page #main .premium-hero:not(.hero-statement) .hero-actions{margin-top:24px;padding-top:0}
 .premium-page #main .hero-copy-brand-watermark .hero-note{max-width:none;white-space:nowrap}
}
.premium-page #main .hero-visual{position:relative}
.premium-page #main .portrait-figure,.premium-page #main .hero-scene{position:relative;z-index:1;background:transparent;box-shadow:none}
.premium-page #main .portrait-figure::before,.premium-page #main .hero-scene::before{display:none}
.premium-page #main .portrait-figure>img,.premium-page #main .hero-scene>img{position:relative;z-index:1}
.premium-page #main .hero-editorial,.premium-page #main .hero-portrait{align-items:stretch}
.premium-page #main .hero-editorial .hero-copy,.premium-page #main .hero-portrait .hero-copy{display:flex;flex-direction:column;justify-content:flex-start;align-self:stretch}

.premium-page .direct-contact-actions .button{min-height:58px;border-radius:var(--radius-contact)}
.premium-page .direct-contact-actions .button svg{width:21px;height:21px}

.premium-page #main .services-section{position:relative;z-index:0;background:transparent}
.premium-page #main .process-section{position:relative;z-index:0;background:transparent}
.premium-page #main .faq-section{position:relative;z-index:0;background:transparent}
.premium-page #main .about-section{background:var(--tint);border-block:1px solid var(--line)}
.premium-page #main .review-section{background:var(--surface)}
.premium-page #main .services-section,.premium-page #main .process-section,.premium-page #main .faq-section{border-block:1px solid var(--line)}

.premium-page #main .service-grid{border-top:0;gap:18px 20px}
.premium-page #main .service-card,.premium-page #main .service-card:first-child,.premium-page #main .service-card:nth-child(3){min-height:176px;padding:24px!important;border:1px solid transparent!important;background:var(--surface);gap:8px;transition:background-color .28s ease,border-color .28s ease,transform .28s ease,box-shadow .28s ease}
.premium-page #main .service-card .section-index{font-size:1rem;line-height:1.5}
.premium-page #main .service-copy h3{font-size:1.375rem;line-height:1.545}
.premium-page #main .service-copy p{font-size:1.125rem;line-height:1.6667;margin-top:8px}
.premium-page #main .services-list .service-card,.premium-page #main .services-split .service-card,.premium-page #main .services-split .service-card:first-child{grid-template-columns:28px minmax(0,1fr)}
.premium-page #main .services-cards .service-card{grid-column:span 2}
.theme-warm-care #main .service-card{border-top:3px solid var(--accent)!important;background:var(--surface)}
.theme-premium-navy #main .services-split .service-card:first-child{background:var(--tint);border-color:var(--input)!important}
.theme-clean-minimal #main .service-card{background:transparent;border-left:0!important;border-right:0!important;padding-inline:4px!important}
.theme-local-friendly #main .service-card{box-shadow:inset 4px 0 0 var(--accent)}

.premium-page #main .process-grid{gap:20px}
.premium-page #main .process-grid li{min-height:220px;padding:24px;border:1px solid var(--line);background:var(--surface);gap:16px}
.premium-page #main .process-number{display:inline-flex;flex-direction:column;align-items:flex-start;gap:6px;font-size:1.35rem;line-height:1;font-weight:700}
.premium-page #main .process-number::before{content:"STEP";font-size:.72rem;line-height:1;letter-spacing:.14em;color:var(--muted);font-weight:700}
.premium-page #main .process-grid h3{margin-top:10px;font-size:1.375rem;line-height:1.545}
.premium-page #main .process-grid p{font-size:1.125rem;line-height:1.6667}
.theme-premium-navy #main .process-grid li:nth-child(2){background:var(--tint)}
.theme-warm-care #main .process-grid li{border-top:3px solid var(--accent)}

.premium-page #main .about-copy{max-width:50rem;width:100%;margin:24px auto 0;min-width:0}
.premium-page #main .about-copy>p{max-width:48rem;margin-inline:auto;font-size:1.125rem;line-height:1.6667}
.premium-page #main .agent-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:28px;border-top:0}
.premium-page #main .agent-facts>div{display:block;padding:20px;border:1px solid var(--line);background:var(--surface)}
.premium-page #main .agent-facts dt{margin-bottom:8px;font-size:1rem;line-height:1.625;color:var(--muted)}
.premium-page #main .agent-facts dd{font-size:1.25rem;line-height:1.5;font-weight:700;color:var(--ink)}
.premium-page #main .agent-meta{display:flex;flex-wrap:wrap;gap:8px 24px;margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}
.premium-page #main .agent-meta p{font-size:1rem;line-height:1.625}
.premium-page #main .agent-meta strong{color:var(--ink);margin-right:8px}

.premium-page #main .faq-list{width:min(100%,55rem);max-width:55rem;margin-inline:auto;background:var(--surface);border:1px solid var(--line);padding-inline:24px;min-width:0}
.premium-page #main .faq-list details{border-bottom:1px solid var(--line)}
.premium-page #main .faq-list details:last-child{border-bottom:0}
.premium-page #main .faq-list summary{padding:24px 0;font-size:1.25rem;line-height:1.6}
.premium-page #main .faq-list details>p{padding:0 0 24px 40px;font-size:1.125rem;line-height:1.6667}
.premium-page #main .faq-list summary>span:last-child{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--input);font-size:0;line-height:1;border-radius:50%}
.premium-page #main .faq-list summary>span:last-child::before{content:"+";font-size:1.35rem;font-weight:400}
.premium-page #main .faq-list details[open] summary>span:last-child::before{content:"−"}

.premium-page #main .contact-section{background:var(--accent);border:0}
.premium-page #main .contact-copy .eyebrow,.premium-page #main .contact-copy h2,.premium-page #main .contact-copy>p{color:var(--on-brand)}
.premium-page #main .contact-copy .eyebrow{opacity:.9}
.premium-page #main .direct-contact-panel{background:var(--surface);border-color:var(--line);box-shadow:0 16px 42px rgba(0,0,0,.10)}

.theme-trust-blue #main .section-heading::after{width:56px}
.theme-warm-care #main .section-heading::after{width:32px;height:3px}
.theme-premium-navy #main .section-heading h2{letter-spacing:-.04em}
.theme-clean-minimal #main .section-heading::after{height:1px;width:96px}
.theme-local-friendly #main .section-heading::after{width:40px;height:3px}

@media(max-width:900px){
 .premium-page #main .service-card,.premium-page #main .service-card:first-child,.premium-page #main .service-card:nth-child(3){min-height:0}
 .premium-page #main .process-grid li{min-height:0}
}
@media(max-width:650px){
 .premium-page{--ch-display:clamp(2.125rem,9vw,2.375rem);--ch-h2:clamp(1.75rem,7vw,1.95rem)}
 .premium-page #main .hero-topics{gap:6px;margin-top:14px}
 .premium-page #main .hero-topics span{font-size:.875rem;min-height:32px}
 .premium-page #main .portrait-figure::before,.premium-page #main .hero-scene::before{inset:12px -8px -8px 12px}
 .premium-page #main .service-card,.premium-page #main .service-card:first-child,.premium-page #main .service-card:nth-child(3){padding:20px 16px!important}
 .premium-page #main .process-grid li{display:block;padding:20px 16px}
 .premium-page #main .process-number{margin-bottom:18px}
 .premium-page #main .agent-facts{grid-template-columns:1fr;gap:10px}
 .premium-page #main .agent-facts>div{padding:16px}
 .premium-page #main .faq-list{padding-inline:16px}
 .premium-page #main .faq-list details>p{padding-left:0}
}



/* v4.2: html2canvas-safe full-bleed section backgrounds */
.premium-page #main .services-section::before,
.premium-page #main .process-section::before,
.premium-page #main .faq-section::before{
 content:"";
 position:absolute;
 top:0;
 bottom:0;
 left:50%;
 width:100vw;
 max-width:100vw;
 transform:translateX(-50%);
 z-index:-1;
 pointer-events:none;
}
.premium-page #main .services-section::before{background:var(--surface)}
.premium-page #main .process-section::before{background:var(--paper)}
.premium-page #main .faq-section::before{background:var(--tint)}

/* v4.1 reflow/accessibility hotfix */
.premium-page #main .hero-copy,
.premium-page #main .hero-actions,
.premium-page #main .hero-topics,
.premium-page #main .hero-topics span,
.premium-page #main .service-card,
.premium-page #main .service-copy,
.premium-page #main .process-grid li,
.premium-page #main .process-grid li>div,
.premium-page #main .agent-facts>div,
.premium-page #main .faq-list,
.premium-page #main .faq-list summary,
.premium-page #main .faq-question,
.premium-page #main .direct-contact-actions,
.premium-page #main .direct-contact-actions .button{
 min-width:0;max-width:100%;
}
.premium-page #main .service-copy h3,
.premium-page #main .process-grid h3,
.premium-page #main .faq-question{
 overflow-wrap:anywhere;
}
@media(max-width:380px){
 .premium-page #main .hero-topics span{white-space:normal}
 .premium-page #main .direct-contact-actions{width:100%}
 .premium-page #main .hero-actions .direct-contact-actions{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}
 .premium-page #main .hero-actions .direct-contact-actions .button{width:100%;padding-inline:12px}
}



/* v4.3 export compatibility: use simple section fills in html2canvas. */
body[data-export-capture="true"] #main .services-section::before,
body[data-export-capture="true"] #main .process-section::before,
body[data-export-capture="true"] #main .faq-section::before{
 display:none!important;
}
body[data-export-capture="true"] #main .services-section{background:var(--surface)!important}
body[data-export-capture="true"] #main .process-section{background:var(--paper)!important}
body[data-export-capture="true"] #main .faq-section{background:var(--tint)!important}
body[data-export-capture="true"] #main *{
 text-shadow:none!important;
}


/* v5 interaction pass */
.premium-page #main>section[id],
.premium-page #main .section[id]{
 scroll-margin-top:96px;
}
@keyframes ch-target-flash{
 0%{box-shadow:0 0 0 0 transparent}
 25%{box-shadow:0 0 0 8px rgba(45,72,100,.16)}
 100%{box-shadow:0 0 0 0 transparent}
}
.premium-page #main>section[id]:target,
.premium-page #main .section[id]:target{
 animation:ch-target-flash .8s ease;
}
.premium-page #main .focus-grid article,
.premium-page #main .service-card,
.premium-page #main .process-grid li,
.premium-page #main .cases-item{
 transition:background-color .28s ease,border-color .28s ease,transform .28s ease,box-shadow .28s ease;
}
.premium-page #main .focus-grid article:hover,
.premium-page #main .focus-grid article:focus-within,
.premium-page #main .service-card:hover,
.premium-page #main .service-card:focus-within,
.premium-page #main .process-grid li:hover,
.premium-page #main .process-grid li:focus-within,
.premium-page #main .cases-item:hover{
 background:var(--tint)!important;
 border-color:var(--accent)!important;
 transform:translateY(-4px);
 box-shadow:0 14px 30px rgba(0,0,0,.06);
}
.premium-page #main .focus-grid article{background:var(--surface);border:1px solid var(--line);padding:24px}
.premium-page #main .cases-section{
 background:var(--paper);
 border-block:1px solid var(--line);
}
.premium-page #main .cases-section .section-heading{
 max-width:52rem;
 margin:0 auto 24px;
 text-align:center;
}
.premium-page #main .cases-section .section-heading h2,
.premium-page #main .cases-section .section-heading .section-support{
 margin-inline:auto;
}
.premium-page #main .cases-section .section-heading::after{
 margin-left:auto;
 margin-right:auto;
 width:40px;
}
.premium-page #main .cases-marquee{
 position:relative;
 overflow:hidden;
 margin-top:22px;
 padding-block:2px 8px;
}
.premium-page #main .cases-track{
 display:flex;
 align-items:stretch;
 gap:14px;
 width:max-content;
 animation:ch-cases-marquee 42s linear infinite;
 padding:6px 0;
}
.premium-page #main .cases-marquee:hover .cases-track{
 animation-play-state:paused;
}
.premium-page #main .cases-item{
 position:relative;
 display:grid;
 grid-template-columns:52px minmax(0,1fr);
 align-items:start;
 gap:16px;
 width:320px;
 min-width:320px;
 min-height:232px;
 padding:22px 22px 20px;
 border:1px solid var(--line);
 border-top:2px solid var(--accent);
 background:var(--surface);
}
.premium-page #main .cases-item p{
 margin:0;
 font-size:1rem;
 line-height:1.7;
 font-weight:400;
 color:var(--muted);
 text-wrap:pretty;
}
.premium-page #main .cases-badge{
 display:block;
 min-width:0;
 height:auto;
 padding:0;
 border:0;
 background:transparent;
 font-size:1rem;
 line-height:1.35;
 font-weight:700;
 font-variant-numeric:tabular-nums;
 color:var(--accent);
}
.premium-page #main .cases-badge::before{
 content:"POINT";
 display:block;
 margin-bottom:7px;
 font-size:.625rem;
 line-height:1;
 letter-spacing:.14em;
 font-weight:700;
 color:var(--muted);
}
@keyframes ch-cases-marquee{
 from{transform:translateX(0)}
 to{transform:translateX(calc(-50% - 8px))}
}
.theme-warm-care #main .service-card:hover,
.theme-warm-care #main .process-grid li:hover,
.theme-warm-care #main .cases-item:hover{
 box-shadow:0 12px 28px rgba(119,69,39,.10);
}
.theme-premium-navy #main .cases-item{background:var(--surface)}
.theme-clean-minimal #main .service-card:hover,
.theme-clean-minimal #main .process-grid li:hover,
.theme-clean-minimal #main .focus-grid article:hover,
.theme-clean-minimal #main .cases-item:hover{
 box-shadow:none;
 transform:none;
}
.theme-local-friendly #main .cases-item{
 box-shadow:inset 4px 0 0 var(--accent);
}

.premium-page #main .cases-item:hover{
 background:var(--tint)!important;
 transform:translateY(-2px);
 box-shadow:0 10px 24px rgba(0,0,0,.045);
}
.theme-clean-minimal #main .cases-item{
 border-top-width:1px;
}
.theme-clean-minimal #main .cases-item:hover{
 border-color:var(--accent)!important;
 background:var(--surface)!important;
}
.theme-premium-navy #main .cases-item{
 border-top-color:var(--accent);
}
.theme-warm-care #main .cases-item{
 border-top-width:3px;
}
@media(max-width:650px){
 .premium-page #main .cases-section .section-heading{
  margin-bottom:18px;
 }
 .premium-page #main .cases-item{
  width:270px;
  min-width:270px;
  min-height:212px;
  grid-template-columns:44px minmax(0,1fr);
  gap:12px;
  padding:18px 16px;
 }
 .premium-page #main .cases-item p{
  font-size:1rem;
 }
}


/* v5.3 refinement pass */

/* v5.4 polish pass */
.premium-page #main .cases-section .section-heading{
 max-width:48rem;
 margin:0 auto 18px;
}
.premium-page #main .cases-section .section-heading h2{
 text-wrap:balance;
}
.premium-page #main .cases-marquee{
 margin-top:18px;
}
.premium-page #main .cases-track{
 gap:10px;
 animation:ch-cases-marquee 46s linear infinite;
 padding:2px 0;
}
.premium-page #main .cases-item{
 width:278px;
 min-width:278px;
 min-height:198px;
 padding:18px 18px 16px;
 grid-template-columns:44px minmax(0,1fr);
 gap:12px;
}
.premium-page #main .cases-copy{
 gap:8px;
}
.premium-page #main .cases-copy h3{
 font-size:1rem;
 line-height:1.45;
}
.premium-page #main .cases-item p{
 font-size:.9375rem;
 line-height:1.6;
}
.premium-page #main .cases-badge{
 font-size:.9375rem;
}
.premium-page #main .service-card{
 position:relative;
 overflow:hidden;
}
.premium-page #main .service-card::after{
 content:"";
 position:absolute;
 left:24px;
 right:24px;
 top:0;
 border-top:2px solid var(--accent);
 opacity:0;
 transform:scaleX(.82);
 transform-origin:center;
 transition:opacity .28s ease,transform .28s ease;
 pointer-events:none;
}
.premium-page #main .service-card:hover::after,
.premium-page #main .service-card:focus-within::after{
 opacity:1;
 transform:scaleX(1);
}
.premium-page #main .service-card:hover,
.premium-page #main .service-card:focus-within{
 border-color:var(--line)!important;
}
.premium-page #main .focus-grid article,
.premium-page #main .process-grid li,
.premium-page #main .agent-facts>div,
.premium-page #main .faq-list details{
 background:var(--surface)!important;
 border-color:var(--line)!important;
}
.premium-page #main .agent-facts{
 gap:20px;
}
.premium-page #main .agent-facts>div{
 min-height:132px;
 padding:22px 24px;
}
.premium-page #main .agent-facts>div p,
.premium-page #main .agent-facts>div h3,
.premium-page #main .agent-facts>div h4{
 margin-block-start:0;
}
.premium-page #main .agent-facts>div .eyebrow,
.premium-page #main .agent-facts>div small{
 display:block;
 margin-bottom:12px;
}
.premium-page #main .contact-section .section-heading + p,
.premium-page #main .about-section .section-heading + p{
 max-width:56rem;
 margin-left:auto;
 margin-right:auto;
}
.premium-page #main .direct-contact-panel,
.premium-page #main .contact-panel{
 max-width:960px;
 margin-inline:auto;
}
.premium-page #main .direct-contact-panel .button,
.premium-page #main .contact-panel .button{
 align-items:center;
 justify-content:center;
}
.premium-page #main .hero-chip-list,
.premium-page #main .hero-tags,
.premium-page #main .hero-quick-links{
 justify-content:flex-start;
 align-items:stretch;
 gap:10px;
}
.premium-page #main .hero-chip-list a,
.premium-page #main .hero-tags a,
.premium-page #main .hero-quick-links a,
.premium-page #main .hero-chip-list button,
.premium-page #main .hero-tags button,
.premium-page #main .hero-quick-links button{
 display:inline-flex;
 align-items:center;
 min-height:38px;
}
.premium-page #main .direct-contact-note,
.premium-page #main .contact-note,
.premium-page #main .hero-disclaimer{
 margin-left:0;
 text-align:left;
}
.premium-page #main .section-index,
.premium-page #main .cases-badge,
.premium-page #main [class*="index"]{
 font-family:inherit!important;
 font-weight:700;
 font-variant-numeric:tabular-nums lining-nums;
}
.premium-page #main .portrait-figure,
.premium-page #main .hero-scene,
.premium-page #main .direct-contact-panel .portrait,
.premium-page #main .contact-panel .portrait{
 overflow:hidden;
}
.premium-page #main .portrait-figure img,
.premium-page #main .hero-scene img,
.premium-page #main .direct-contact-panel img,
.premium-page #main .contact-panel img{
 object-fit:contain!important;
 object-position:center top!important;
}
.theme-clean-minimal #main .service-card,
.theme-clean-minimal #main .focus-grid article,
.theme-clean-minimal #main .process-grid li{
 background:var(--surface)!important;
}
@media(max-width:920px){
 .premium-page #main .cases-item{
  width:256px;
  min-width:256px;
  min-height:192px;
  padding:16px;
 }
 .premium-page #main .agent-facts>div{
  min-height:120px;
  padding:20px;
 }
}
@media(max-width:650px){
 .premium-page #main .cases-track{
  gap:8px;
 }
 .premium-page #main .cases-item{
  width:240px;
  min-width:240px;
  min-height:186px;
  grid-template-columns:40px minmax(0,1fr);
  gap:10px;
  padding:16px 14px;
 }
 .premium-page #main .cases-copy h3{
  font-size:.975rem;
 }
 .premium-page #main .cases-item p{
  font-size:.9rem;
 }
}

.premium-page #main .cases-copy{
 display:grid;
 gap:12px;
 align-content:start;
}
.premium-page #main .cases-copy h3{
 margin:0;
 font-size:1.125rem;
 line-height:1.5;
 font-weight:700;
 color:var(--ink);
 text-wrap:balance;
}
.premium-page #main .cases-item:hover{
 transform:translateY(-2px);
}
.premium-page #main .service-card:hover,
.premium-page #main .service-card:focus-within{
 box-shadow:inset 0 2px 0 0 var(--accent),0 14px 30px rgba(0,0,0,.06);
}
.theme-clean-minimal #main .service-card:hover,
.theme-clean-minimal #main .service-card:focus-within{
 box-shadow:inset 0 1px 0 0 var(--accent);
}
.premium-page #main .agent-facts>div,
.premium-page #main .faq-list details{
 transition:none!important;
 transform:none!important;
 box-shadow:none!important;
}
.premium-page #main .agent-facts>div:hover,
.premium-page #main .agent-facts>div:focus-within,
.premium-page #main .faq-list details:hover,
.premium-page #main .faq-list details:focus-within{
 background:var(--surface)!important;
 border-color:var(--line)!important;
 transform:none!important;
 box-shadow:none!important;
}
.premium-page #main .focus-grid article,
.premium-page #main .process-grid li,
.premium-page #main .service-card,
.premium-page #main .agent-facts>div,
.premium-page #main .faq-list details{
 background:var(--surface)!important;
}
.premium-page #main .section-index,
.premium-page #main .cases-badge,
.premium-page #main [class*="index"]{
 font-family:inherit;
 font-variant-numeric:tabular-nums lining-nums;
 letter-spacing:0;
}
.premium-page #main .portrait-figure img,
.premium-page #main .hero-scene img,
.premium-page #main .direct-contact-panel img{
 width:100%;
 height:100%;
 object-fit:contain!important;
 object-position:center top!important;
 background:var(--surface);
}
.premium-page #main .cases-track{
 align-items:stretch;
}
.premium-page #main .cases-badge{
 align-self:start;
}
.premium-page #main .section-intro p,
.premium-page #main .service-card p,
.premium-page #main .focus-grid p,
.premium-page #main .process-grid p,
.premium-page #main .faq-list .faq-answer,
.premium-page #main .agent-facts p{
 text-wrap:pretty;
}

@media(prefers-reduced-motion:reduce){
 html{scroll-behavior:auto}
 .premium-page #main .cases-track{animation:none}
 .premium-page #main .focus-grid article,
 .premium-page #main .service-card,
 .premium-page #main .process-grid li,
 .premium-page #main .agent-facts>div,
 .premium-page #main .faq-list details,
 .premium-page #main .cases-item{
  transition:none;
 }
}
@media(max-width:650px){
 .premium-page #main .cases-track{gap:12px}
 .premium-page #main .cases-item{min-width:260px;padding:16px}
 .premium-page #main .focus-grid article{padding:20px 16px}
}

/* PDF/ZIP export capture: preserve information, skip expensive decoration. */
body[data-export-capture="true"] #main .portrait-figure::before,
body[data-export-capture="true"] #main .hero-scene::before{
 display:none!important;
}
body[data-export-capture="true"] #main .direct-contact-panel{
 box-shadow:none!important;
}
body[data-export-capture="true"] #main .service-card,
body[data-export-capture="true"] #main .process-grid li{
 box-shadow:none!important;
}
body[data-export-capture="true"] #main .hero-brand-watermark{
 background:none!important;
 -webkit-mask-image:none!important;
 mask-image:none!important;
 opacity:0!important;
}

@media print{
 .premium-page #main .container{width:100%}
 .premium-page #main .section{padding-block:24px}
}
`;

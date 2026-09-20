/**
 * Figma Clear Human 2026 final specification layer.
 *
 * ui-ux-pro-max 역할: 보험 상담 페이지에 맞는 high-trust editorial/service 패턴,
 * 반응형·상태·접근성 규칙을 선택합니다.
 * design-system 역할: Primitive → Semantic → Component 토큰을 이 마지막 CSS 레이어에
 * 고정해 5개 레이아웃 × 6개 팔레트가 같은 규칙을 공유하게 합니다.
 * design 역할: 큰 인물 사진, 짧은 헤드라인, 섹션별 다른 읽기 리듬을 통해 카드 반복감을 줄입니다.
 */
export const clearHumanStyles = `
.premium-page{
  --ch-font:'Noto Sans KR','Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
  --ch-space-8:8px;--ch-space-12:12px;--ch-space-16:16px;--ch-space-24:24px;--ch-space-32:32px;
  --ch-space-48:48px;--ch-space-64:64px;--ch-space-80:80px;--ch-space-96:96px;
  --ch-display:3.75rem;--ch-display-lh:1.3333;
  --ch-h2:2.25rem;--ch-h2-lh:1.3889;
  --ch-h3:1.625rem;--ch-h3-lh:1.5385;
  --ch-card:1.375rem;--ch-card-lh:1.5455;
  --ch-body:1.125rem;--ch-body-lh:1.6667;
  --ch-lead:1.25rem;--ch-lead-lh:1.7;
  --ch-small:1rem;--ch-small-lh:1.625;
  --ch-max:1248px;
  font-family:var(--ch-font);font-size:var(--ch-body);line-height:var(--ch-body-lh);
  color:var(--ink);background:var(--surface);
}
.premium-page *{box-sizing:border-box}
.premium-page #main{overflow:clip;background:var(--surface)}
.premium-page #main .container,
.premium-page .site-header>.container,
.premium-page .site-footer>.container,
.premium-page .sample-bar>.container{
  width:min(var(--ch-max),calc(100% - 96px));max-width:none;margin-inline:auto;
}
.premium-page h1,.premium-page h2,.premium-page h3{
  margin:0;font-family:var(--heading-family,var(--ch-font));font-weight:700;letter-spacing:-.025em;
  color:var(--ink);text-wrap:balance;word-break:keep-all;overflow-wrap:anywhere;
}
.premium-page h1{font-size:var(--ch-display);line-height:var(--ch-display-lh)}
.premium-page h2{font-size:var(--ch-h2);line-height:var(--ch-h2-lh)}
.premium-page h3{font-size:var(--ch-h3);line-height:var(--ch-h3-lh)}
.premium-page p,.premium-page li,.premium-page dd,.premium-page dt{font-size:var(--ch-body);line-height:var(--ch-body-lh)}
.premium-page p{margin-top:0}
.premium-page .eyebrow{
  margin:0;color:var(--accent);font-size:var(--ch-small);line-height:1.5;font-weight:600;letter-spacing:.01em;
}
.premium-page .support-note,.premium-page .hero-note,.premium-page .palette-caption,
.premium-page .demo-contact-notice,.premium-page figcaption{font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page .copy-mobile{display:none}

/* Figma CH2/Button + CH2/Contact Button */
.premium-page .button{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:56px;padding:0 24px;
  border:1px solid var(--accent);border-radius:var(--radius-control);background:var(--accent);color:var(--on-brand);
  font:700 1.125rem/1.55 var(--ch-font);letter-spacing:-.01em;text-decoration:none;text-align:center;
}
.premium-page .button:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.premium-page .button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.premium-page .button-secondary{background:var(--surface);color:var(--ink);border-color:var(--input)}
.premium-page .button-small{min-height:44px;padding-inline:16px;font-size:1rem}
.premium-page .direct-contact-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px}
.premium-page .direct-contact-actions .button{min-height:58px;border-radius:var(--radius-contact);font-weight:500}
.premium-page .direct-contact-actions .button svg{width:21px;height:21px;flex:0 0 21px}
.premium-page .direct-phone{background:var(--accent);color:var(--on-brand);border-color:var(--accent)}
.premium-page .direct-phone:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.premium-page .direct-kakao{background:var(--kakao);color:var(--kakao-ink);border-color:var(--kakao-line)}
.premium-page .direct-kakao:hover{background:var(--kakao-hover);color:var(--kakao-ink);border-color:var(--kakao-line)}

/* Demo control: functional but visually subordinate. */
.premium-page .sample-bar{background:var(--ink);color:var(--on-brand);border:0}
.premium-page .sample-inner{min-height:46px;padding-block:7px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.premium-page .sample-label{font-size:.875rem;line-height:1.5;color:var(--detail)}
.premium-page .sample-actions{display:flex;align-items:center;gap:10px}
.premium-page .sample-settings>summary,.premium-page .sample-actions>a{font-size:.875rem}
.premium-page .sample-bar .studio-start{min-height:36px;padding-inline:14px;border-color:var(--on-brand);background:transparent;color:var(--on-brand)}
.premium-page .design-controls{z-index:70}

/* Header = Figma 88px identity / nav / contact. */
.premium-page .site-header{position:relative;z-index:50;background:var(--surface);border-bottom:1px solid var(--line)}
.premium-page .header-inner{min-height:88px;display:flex;align-items:center;justify-content:space-between;gap:32px;padding-block:12px}
.premium-page .brand{display:flex;align-items:center;gap:12px;min-width:0;text-decoration:none;color:var(--ink)}
.premium-page .brand>span{display:flex;min-width:0;flex-direction:column}
.premium-page .brand strong{font-size:1.375rem;line-height:1.45;letter-spacing:-.02em;white-space:normal}
.premium-page .brand-service{font-weight:700}
.premium-page .brand-sub{font-size:1rem;line-height:1.625;color:var(--muted)}
.premium-page .brand-logo{width:44px;height:44px;object-fit:contain}
.premium-page .desktop-nav{display:flex;align-items:center;justify-content:center;gap:32px;margin-left:auto}
.premium-page .desktop-nav a{font-size:1.125rem;line-height:1.55;font-weight:500;text-decoration:none;color:var(--ink)}
.premium-page .desktop-nav a:hover{text-decoration:underline;text-decoration-thickness:1px}
.premium-page .header-tools{display:flex;align-items:center;gap:12px;flex-shrink:0}
.premium-page .header-tools>.direct-contact-actions{display:none}
.premium-page .header-contact{min-width:152px}
.premium-page .mobile-menu{display:none}

/* Hero shells. 1440 viewport => 96px side margins => 1248px reading grid. */
.premium-page .hero-shell{background:var(--paper);padding-block:64px}
.premium-page .hero-layout{display:grid;grid-template-columns:minmax(0,704px) minmax(0,416px);gap:128px;align-items:center}
.premium-page .hero-copy{min-width:0}
.premium-page .hero-copy>.eyebrow{margin-bottom:24px}
.premium-page .hero-copy h1{max-width:704px}
.premium-page .hero-description{max-width:704px;margin:24px 0 0;color:var(--muted);font-size:var(--ch-lead);line-height:var(--ch-lead-lh)}
.premium-page .hero-actions{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:24px}
.premium-page .hero-actions .direct-contact-actions{display:contents}
.premium-page .hero-actions .button{width:200px}
.premium-page .hero-actions>.text-link{margin-left:8px}
.premium-page .text-link{display:inline-flex;align-items:center;gap:8px;color:var(--ink);font-size:1rem;font-weight:600;text-decoration-thickness:1px}
.premium-page .hero-note{max-width:640px;margin:16px 0 0;color:var(--muted)}
.premium-page .hero-visual{min-width:0}
.premium-page .portrait-figure{margin:0}
.premium-page .portrait-figure img{display:block;width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;object-position:50% 15%}
.premium-page .hero-portrait-only{display:flex;flex-direction:column;gap:16px;width:416px;max-width:100%;justify-self:end}
.premium-page .portrait-caption{margin:0;color:var(--ink);font-size:1.125rem;line-height:1.6667;font-weight:500}
.premium-page .hero-profile-stack{display:flex;flex-direction:column;width:416px;max-width:100%;justify-self:end}
.premium-page .hero-profile-stack .adviser-card{margin-top:0}
.premium-page .hero-statement .hero-layout{grid-template-columns:1fr;gap:36px}
.premium-page .hero-statement .hero-copy{max-width:960px;margin-inline:auto;text-align:center}
.premium-page .hero-statement .hero-copy h1,.premium-page .hero-statement .hero-description{margin-inline:auto}
.premium-page .hero-statement .hero-actions{justify-content:center}
.premium-page .hero-statement .hero-note{margin-inline:auto}
.premium-page .hero-statement-person{
  display:grid;grid-template-columns:minmax(0,320px) minmax(0,416px);gap:0;align-items:stretch;
  width:min(736px,100%);margin-inline:auto;
}
.premium-page .hero-statement-person>img{display:block;width:100%;height:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 15%}
.premium-page .hero-editorial .hero-layout{grid-template-columns:minmax(0,620px) minmax(0,500px);gap:96px}
.premium-page .hero-editorial-visual{display:grid;grid-template-columns:minmax(0,1fr);align-items:end}
.premium-page .hero-scene{margin:0}
.premium-page .hero-scene img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}
.premium-page .hero-scene figcaption{margin:10px 0 16px;color:var(--muted);text-align:right}

/* CH2/Agent Details */
.premium-page .adviser-card{background:var(--ink);color:var(--on-brand);padding:32px;min-width:0}
.premium-page .adviser-details{display:flex;flex-direction:column;gap:14px}
.premium-page .adviser-card p{margin:0}
.premium-page .adviser-role,.premium-page .adviser-hours{font-size:1rem;line-height:1.625;color:var(--detail)}
.premium-page .adviser-name{font-size:clamp(2.25rem,4vw,3.75rem);line-height:1.333;font-weight:700;color:var(--on-brand)}
.premium-page .adviser-org{font-size:1.25rem;line-height:1.7;color:var(--detail)}
.premium-page .adviser-phone{font-size:1.625rem;line-height:1.54;font-weight:700;color:var(--on-brand);text-decoration:none}
.premium-page .adviser-phone:hover{text-decoration:underline}
.premium-page .hero-profile-stack .adviser-card{padding:28px 32px}
.premium-page .hero-profile-stack .adviser-name{font-size:2.5rem}

/* Full-bleed content bands. */
.premium-page #main .section{padding-block:64px;margin:0}
.premium-page #main .section-heading{max-width:900px;margin:0 0 32px;text-align:left}
.premium-page #main .section-heading .eyebrow{margin-bottom:12px}
.premium-page #main .section-heading .section-support{max-width:720px;margin:12px 0 0;color:var(--muted)}
.premium-page .services-section,.premium-page .process-section,.premium-page .faq-section{background:var(--surface)}
.premium-page .focus-section,.premium-page .review-section{background:var(--paper)}
.premium-page .about-section{background:var(--tint)}
.premium-page .location-section{background:var(--paper)}

/* CH2 Topic Row / Topic Card: rows first, cards only where layout needs them. */
.premium-page .service-grid{display:grid;min-width:0}
.premium-page .service-card{min-width:0;background:transparent}
.premium-page .service-copy{min-width:0}
.premium-page .service-copy h3{font-size:var(--ch-h3);line-height:var(--ch-h3-lh)}
.premium-page .service-copy p{margin:6px 0 0;color:var(--muted)}
.premium-page .section-index,.premium-page .process-number{
  color:var(--accent);font-size:1.25rem;line-height:1.6;font-weight:700;font-variant-numeric:tabular-nums;
}
.premium-page .service-link{
  display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;
  color:var(--accent);text-decoration:none;font-size:1.25rem;
}
.premium-page .services-list{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.premium-page .services-list .service-card{
  display:grid;grid-template-columns:56px 292px minmax(0,1fr) 44px;gap:32px;align-items:center;
  min-height:109px;padding:24px 0;border-bottom:1px solid var(--line);
}
.premium-page .services-list .service-copy{display:contents}
.premium-page .services-list .service-copy h3{grid-column:2}
.premium-page .services-list .service-copy p{grid-column:3;margin:0}
.premium-page .services-list .service-link{grid-column:4}
.premium-page .services-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px}
.premium-page .services-cards .service-card{
  display:grid;grid-template-columns:56px minmax(0,1fr) 44px;gap:20px;align-items:start;
  min-height:168px;padding:24px 0;border-top:1px solid var(--line);
}
.premium-page .services-cards .service-copy p{margin-top:8px}
.premium-page .services-cards .service-link{align-self:center}
.premium-page .services-cards .service-card:last-child:nth-child(odd){grid-column:1/-1;width:calc(50% - 16px);justify-self:center}
.premium-page .services-split{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.premium-page .services-split .service-card{
  display:grid;grid-template-columns:44px minmax(0,1fr);grid-template-rows:auto 1fr;gap:10px 16px;
  padding:28px;background:var(--paper);border:1px solid var(--line);min-height:190px;
}
.premium-page .services-split .section-index{grid-column:1;grid-row:1}
.premium-page .services-split .service-copy{grid-column:2;grid-row:1/3}
.premium-page .services-split .service-link{grid-column:1;grid-row:2;align-self:end}
.premium-page .services-split .service-card:last-child:nth-child(odd){grid-column:1/-1;width:calc(50% - 12px);justify-self:center}

/* Layout personality without inventing decorative claims. */
.premium-page[data-layout="warm-care"] .section-heading,
.premium-page body[data-layout="warm-care"] .section-heading{margin-inline:auto;text-align:center}
body[data-layout="warm-care"] .section-heading .section-support{margin-inline:auto}
body[data-layout="warm-care"] .hero-shell{background:var(--surface)}
body[data-layout="warm-care"] .about-section{background:var(--paper)}
body[data-layout="premium-navy"] .hero-shell{background:var(--ink)}
body[data-layout="premium-navy"] .hero-copy h1,
body[data-layout="premium-navy"] .hero-copy>.eyebrow,
body[data-layout="premium-navy"] .hero-description,
body[data-layout="premium-navy"] .hero-note,
body[data-layout="premium-navy"] .hero-actions>.text-link{color:var(--on-brand)}
body[data-layout="premium-navy"] .hero-note{opacity:.84}
body[data-layout="premium-navy"] .hero-actions>.text-link{border-color:var(--on-brand)}
body[data-layout="clean-minimal"] .hero-shell{background:var(--surface);border-bottom:1px solid var(--line)}
body[data-layout="clean-minimal"] .section{border-bottom:1px solid var(--line)}
body[data-layout="local-friendly"] .services-section{background:var(--paper)}
body[data-layout="local-friendly"] .contact-section{order:0}

/* About compositions. */
.premium-page .about-grid{display:grid;min-width:0;align-items:start}
.premium-page .about-heading{margin:0 0 20px}
.premium-page .about-heading .eyebrow{margin-bottom:12px}
.premium-page .about-heading .philosophy{margin:12px 0 0;color:var(--muted)}
.premium-page .about-copy>p{margin:0;color:var(--muted)}
.premium-page .adviser-signature{display:flex;align-items:flex-start;gap:16px;margin-top:24px}
.premium-page .adviser-signature strong{font-size:1.125rem}
.premium-page .adviser-signature span{font-size:1rem;line-height:1.625;color:var(--muted)}
.premium-page .about-editorial{display:grid}
body[data-layout="trust-blue"] .about-editorial{grid-template-columns:minmax(0,408px) minmax(0,624px);gap:80px}
body[data-layout="trust-blue"] .about-copy-column{align-self:center}
body[data-layout="trust-blue"] .about-section .adviser-card{width:624px;max-width:100%}
.premium-page .about-profile{grid-template-columns:minmax(0,416px) minmax(0,1fr);gap:80px;align-items:center}
.premium-page .about-portrait{margin:0}
.premium-page .about-portrait img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 15%}
.premium-page .about-portrait figcaption{margin-top:12px;color:var(--muted)}
.premium-page .about-profile-copy{min-width:0}
body[data-layout="premium-navy"] .about-editorial{grid-template-columns:minmax(0,1fr) 360px;gap:80px;align-items:center}
.premium-page .about-quote blockquote{
  max-width:720px;margin:28px 0;padding:24px 0;border-block:1px solid var(--line);
  font-size:1.625rem;line-height:1.55;font-weight:700;color:var(--ink);
}
.premium-page .about-editorial-copy{max-width:820px}
.premium-page .agent-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;margin:28px 0 0;border-top:1px solid var(--line)}
.premium-page .agent-facts>div{display:grid;grid-template-columns:minmax(6rem,.45fr) 1fr;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.premium-page .agent-facts dt,.premium-page .agent-facts dd{margin:0;font-size:1rem;line-height:1.625}
.premium-page .agent-facts dt{color:var(--muted)}
.premium-page .career-list{padding-left:1.25rem;color:var(--muted)}

/* Process: Figma rows for timeline, equal panels for steps. */
.premium-page .process-grid{list-style:none;margin:0;padding:0}
.premium-page .process-grid li h3{font-size:var(--ch-h3);line-height:var(--ch-h3-lh)}
.premium-page .process-grid li p{margin:6px 0 0;color:var(--muted)}
.premium-page .process-timeline{border-top:1px solid var(--line)}
.premium-page .process-timeline li{
  display:grid;grid-template-columns:56px 292px minmax(0,1fr);gap:32px;align-items:center;
  min-height:109px;padding:24px 0;border-bottom:1px solid var(--line);
}
.premium-page .process-timeline li>div{display:contents}
.premium-page .process-timeline li h3{grid-column:2}
.premium-page .process-timeline li p{grid-column:3;margin:0}
.premium-page .process-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.premium-page .process-steps li{min-height:220px;padding:28px;background:var(--paper);border-top:3px solid var(--accent)}
.premium-page .process-steps li h3{margin-top:28px}

/* Focus / reviews are content-density sections, not decorative card walls. */
.premium-page .focus-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.premium-page .focus-grid article{padding:24px 0;border-top:1px solid var(--input)}
.premium-page .focus-grid h3{margin-top:8px}
.premium-page .focus-grid p{margin:8px 0 0;color:var(--muted)}
.premium-page .review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.premium-page .review-card{margin:0;padding:28px;background:var(--surface);border:1px solid var(--line)}
.premium-page .review-card blockquote{margin:0;font-size:1.25rem;line-height:1.65}
.premium-page .review-card figcaption{margin-top:18px;color:var(--muted)}

/* CH2 Accordion */
.premium-page .faq-list{max-width:100%;border-top:1px solid var(--line)}
.premium-page .faq-list details{border:0;border-bottom:1px solid var(--line);background:transparent}
.premium-page .faq-list summary{
  display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:24px 0;
  color:var(--ink);font-size:1.25rem;line-height:1.6;font-weight:700;cursor:pointer;list-style:none;
}
.premium-page .faq-list summary::-webkit-details-marker{display:none}
.premium-page .faq-question{display:flex;gap:24px;min-width:0}
.premium-page .faq-number{min-width:40px;color:var(--accent);font-size:1rem}
.premium-page .faq-symbol{font-size:1.5rem;line-height:1.3;font-weight:400}
.premium-page .faq-list details[open] .faq-symbol{transform:rotate(45deg)}
.premium-page .faq-list details>p{max-width:900px;margin:0 64px 24px;color:var(--muted)}

/* Contact = dark confidence block + direct-contact facts. */
.premium-page .contact-section{background:var(--ink);color:var(--on-brand)}
.premium-page .contact-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,520px);gap:64px;align-items:center}
.premium-page .contact-copy>.eyebrow{color:var(--detail)}
.premium-page .contact-copy h2,.premium-page .contact-copy p{color:var(--on-brand)}
.premium-page .contact-copy>p:not(.eyebrow){max-width:680px;margin:16px 0 0}
.premium-page .contact-person{display:flex;align-items:center;gap:16px;margin-top:24px}
.premium-page .contact-person img{width:72px;height:96px;object-fit:cover;object-position:50% 15%}
.premium-page .contact-person strong,.premium-page .contact-person span{display:block}
.premium-page .contact-person span{font-size:1rem;color:var(--detail)}
.premium-page .direct-contact-panel{background:var(--surface);color:var(--ink);padding:28px;border:0}
.premium-page .direct-contact-panel .eyebrow{margin-bottom:8px}
.premium-page .direct-contact-panel h3{font-size:1.625rem}
.premium-page .direct-contact-panel .direct-contact-actions{margin-top:20px}
.premium-page .direct-contact-panel .button{flex:1 1 190px}
.premium-page .direct-contact-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 20px;margin:24px 0 0;border-top:1px solid var(--line)}
.premium-page .direct-contact-details>div{padding:12px 0;border-bottom:1px solid var(--line)}
.premium-page .direct-contact-details dt,.premium-page .direct-contact-details dd{margin:0;font-size:1rem;line-height:1.625}
.premium-page .direct-contact-details dt{color:var(--muted)}
.premium-page .direct-contact-panel .support-note{margin:16px 0 0;color:var(--muted)}
.premium-page .direct-contact-panel .demo-contact-notice{margin:10px 0 0;color:var(--muted)}

/* Footer stays quiet and is the home for legal / status copy. */
.premium-page .site-footer{background:var(--paper);color:var(--ink);padding:64px 0 calc(64px + env(safe-area-inset-bottom))}
.premium-page .footer-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:48px;align-items:start}
.premium-page .footer-identity h2{font-size:1.125rem;line-height:1.6667}
.premium-page .footer-identity p,.premium-page .footer-business p,.premium-page .footer-contact p{font-size:1rem;line-height:1.625}
.premium-page .footer-contact{text-align:right}
.premium-page .site-footer .direct-contact-actions{justify-content:flex-end}
.premium-page .site-footer .button{min-height:48px}
.premium-page .footer-legal{margin-top:32px;padding-top:32px;border-top:1px solid var(--line);color:var(--muted)}
.premium-page .footer-legal>p{font-size:1rem;line-height:1.75}
.premium-page .footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:28px}
.premium-page .footer-bottom p,.premium-page .footer-bottom a{font-size:1rem}
.premium-page .mobile-cta{display:none}

/* Five compositions deliberately change hierarchy, not only colour. */
body[data-layout="warm-care"] .hero-layout{grid-template-columns:minmax(0,620px) minmax(0,500px);gap:96px}
body[data-layout="warm-care"] .hero-profile-stack{width:500px}
body[data-layout="warm-care"] .hero-profile-stack{display:grid;grid-template-columns:1fr 1fr}
body[data-layout="warm-care"] .hero-profile-stack .portrait-figure img{height:100%;object-fit:cover}
body[data-layout="warm-care"] .hero-profile-stack .adviser-card{display:flex;align-items:center}
body[data-layout="warm-care"] .services-cards .service-card{padding-inline:24px;background:var(--paper);border-top:0;border-bottom:1px solid var(--line)}
body[data-layout="premium-navy"] .services-section{background:var(--paper)}
body[data-layout="premium-navy"] .process-section{background:var(--surface)}
body[data-layout="premium-navy"] .about-section{background:var(--tint)}
body[data-layout="clean-minimal"] .services-cards{grid-template-columns:1fr}
body[data-layout="clean-minimal"] .services-cards .service-card,
body[data-layout="clean-minimal"] .services-cards .service-card:last-child:nth-child(odd){
  width:100%;grid-column:auto;grid-template-columns:56px 292px minmax(0,1fr) 44px;min-height:109px;
}
body[data-layout="clean-minimal"] .services-cards .service-copy{display:contents}
body[data-layout="clean-minimal"] .services-cards .service-copy h3{grid-column:2}
body[data-layout="clean-minimal"] .services-cards .service-copy p{grid-column:3;margin:0}
body[data-layout="clean-minimal"] .services-cards .service-link{grid-column:4}
body[data-layout="local-friendly"] .hero-layout{align-items:start}
body[data-layout="local-friendly"] .hero-copy{padding-top:32px}
body[data-layout="local-friendly"] .services-cards .service-card{border-top:0;border-bottom:1px solid var(--line)}
body[data-layout="local-friendly"] .contact-section .contact-grid{grid-template-columns:1fr 1fr}

/* Compatibility / accessibility guardrails for legacy layers and export capture. */
.premium-page .site-footer p,.premium-page .site-footer dt,.premium-page .site-footer dd,.premium-page .site-footer a{color:var(--muted)}
.premium-page .site-footer h2,.premium-page .site-footer strong{color:var(--ink)}
.premium-page .site-footer .footer-note{color:var(--muted)}
.premium-page .about-section .adviser-card p,.premium-page .about-section .adviser-card a{color:var(--on-brand)}
.premium-page .about-section .adviser-card .adviser-role,.premium-page .about-section .adviser-card .adviser-org,.premium-page .about-section .adviser-card .adviser-hours{color:var(--detail)}
.premium-page .services-split .service-card:first-child{grid-row:auto;display:grid;grid-template-columns:44px minmax(0,1fr);grid-template-rows:auto 1fr;gap:10px 16px;justify-content:initial;min-height:190px;padding:28px;background:var(--paper);border:1px solid var(--line)}
.premium-page .services-split .service-card:first-child .section-index{grid-column:1;grid-row:1}
.premium-page .services-split .service-card:first-child .service-copy{grid-column:2;grid-row:1/3}
.premium-page .services-split .service-card:first-child .service-link{grid-column:1;grid-row:2;align-self:end}
.premium-page #main .section-heading{margin-left:auto;margin-right:auto}
.premium-page .faq-list{width:min(880px,100%);margin-inline:auto}
body[data-layout="trust-blue"] .hero-portrait-only .adviser-card{width:100%}
body[data-layout="trust-blue"] .about-editorial{display:block}
body[data-layout="trust-blue"] .about-copy-column{width:min(800px,100%);margin-inline:auto}
body[data-layout="trust-blue"] .contact-grid{grid-template-columns:1fr}
body[data-layout="trust-blue"] .contact-copy{width:min(780px,100%);margin-inline:auto}
body[data-layout="trust-blue"] .direct-contact-panel{width:min(780px,100%);margin-inline:auto}
body[data-layout="trust-blue"] .process-timeline{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;border-top:0}
body[data-layout="trust-blue"] .process-timeline li{display:block;min-height:210px;padding:24px 0;border-top:1px solid var(--line);border-bottom:0}
body[data-layout="trust-blue"] .process-timeline li>div{display:block}
body[data-layout="trust-blue"] .process-timeline li h3{margin-top:24px}
@media(min-width:651px){
  .premium-page #specialties{width:min(1120px,calc(100% - 96px));margin-inline:auto}
  .premium-page #specialties>.container{width:100%}
}

/* Tablet */
@media(max-width:1100px){
  .premium-page #main .container,.premium-page .site-header>.container,.premium-page .site-footer>.container,.premium-page .sample-bar>.container{width:min(100% - 48px,900px)}
  .premium-page .desktop-nav{display:none}
  .premium-page .mobile-menu{display:block}
  .premium-page .header-contact{display:none}
  .premium-page .header-tools>.direct-contact-actions{display:none}
  .premium-page .hero-layout,.premium-page .hero-editorial .hero-layout,body[data-layout="warm-care"] .hero-layout{
    grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:48px;
  }
  .premium-page .hero-portrait-only,.premium-page .hero-profile-stack{width:100%}
  body[data-layout="warm-care"] .hero-profile-stack{display:flex;width:100%}
  .premium-page .hero-copy h1{font-size:clamp(2.75rem,5vw,3.5rem);line-height:1.3}
  .premium-page .services-list .service-card,.premium-page .process-timeline li{grid-template-columns:48px 240px minmax(0,1fr);gap:20px}
  body[data-layout="trust-blue"] .about-editorial{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:48px}
  body[data-layout="trust-blue"] .about-section .adviser-card{width:auto}
  .premium-page .about-profile{grid-template-columns:minmax(260px,340px) 1fr;gap:48px}
  body[data-layout="premium-navy"] .about-editorial{grid-template-columns:1fr 300px;gap:48px}
  .premium-page .contact-grid{grid-template-columns:1fr 1fr;gap:32px}
  .premium-page .footer-top{grid-template-columns:1fr 1fr}
}

/* Mobile follows the 390px Figma frames: 24px margins, 342px content, stacked reading order. */
@media(max-width:650px){
  .premium-page{--ch-display:2.25rem;--ch-display-lh:1.28;--ch-h2:1.75rem;--ch-h2-lh:1.36;--ch-h3:1.375rem;--ch-h3-lh:1.55;--ch-body:1.125rem;--ch-body-lh:1.6667}
  .premium-page #main .container,.premium-page .site-header>.container,.premium-page .site-footer>.container,.premium-page .sample-bar>.container{width:calc(100% - 48px)}
  .premium-page .sample-inner{align-items:flex-start;flex-direction:column;padding-block:10px}
  .premium-page .sample-label{font-size:.8125rem}
  .premium-page .sample-actions{width:100%;justify-content:space-between}
  .premium-page .sample-settings{min-width:0}
  .premium-page .site-header{min-height:88px}
  .premium-page .header-inner{min-height:88px;gap:12px}
  .premium-page .brand{max-width:230px}
  .premium-page .brand strong{font-size:1.25rem}
  .premium-page .brand-sub{font-size:.9375rem}
  .premium-page .mobile-menu>summary{
    display:inline-flex;align-items:center;justify-content:center;min-width:88px;min-height:48px;padding:0 12px;
    border-radius:var(--radius-control);background:var(--accent);color:var(--on-brand);font-size:1rem;font-weight:700;list-style:none;cursor:pointer;
  }
  .premium-page .mobile-menu>summary::-webkit-details-marker{display:none}
  .premium-page .mobile-menu nav{
    position:absolute;top:calc(100% + 8px);right:24px;width:min(342px,calc(100vw - 48px));
    padding:20px;background:var(--surface);border:1px solid var(--line);box-shadow:0 12px 40px rgb(23 42 61 / .12);
  }
  .premium-page .mobile-menu nav a{display:block;padding:12px 4px;font-size:1.125rem;text-decoration:none}
  .premium-page .hero-shell{padding-block:48px}
  .premium-page .hero-layout,.premium-page .hero-editorial .hero-layout,body[data-layout="warm-care"] .hero-layout{
    display:flex;flex-direction:column;gap:24px;
  }
  .premium-page .hero-copy{width:100%}
  .premium-page .hero-copy>.eyebrow{margin-bottom:16px}
  .premium-page .hero-description{margin-top:16px;font-size:1.125rem;line-height:1.6667}
  .premium-page .hero-actions{gap:12px;margin-top:24px}
  .premium-page .hero-actions .button{flex:1 1 150px;width:auto;min-width:0;padding-inline:14px}
  .premium-page .hero-actions>.text-link{flex:1 0 100%;margin:4px 0 0}
  .premium-page .hero-note{margin-top:12px}
  .premium-page .hero-portrait-only{width:100%;align-items:center;margin-top:0}
  .premium-page .hero-portrait-only .portrait-figure{width:min(288px,100%)}
  .premium-page .portrait-caption{width:100%;font-size:1rem}
  .premium-page .hero-profile-stack{display:flex!important;width:100%}
  .premium-page .hero-profile-stack .portrait-figure{width:min(288px,100%);margin-inline:auto}
  .premium-page .hero-profile-stack .adviser-card{width:100%}
  .premium-page .hero-statement .hero-layout{gap:28px}
  .premium-page .hero-statement-person{display:flex;flex-direction:column;width:100%}
  .premium-page .hero-statement-person>img{width:min(288px,100%);height:auto;margin-inline:auto}
  .premium-page .hero-editorial-visual{width:100%}
  .premium-page .hero-scene img{aspect-ratio:3/2}
  .premium-page .hero-scene figcaption{text-align:left}
  .premium-page .adviser-card{padding:24px}
  .premium-page .adviser-name{font-size:2.25rem}
  .premium-page .adviser-org{font-size:1.125rem}
  .premium-page .adviser-phone{font-size:1.375rem}
  .premium-page #main .section{padding-block:48px}
  .premium-page #main .section-heading{margin-bottom:24px}
  .premium-page #main .section-heading .section-support{margin-top:8px}
  .premium-page .services-list,.premium-page .services-cards,.premium-page .services-split{display:flex;flex-direction:column;gap:0;border:0}
  .premium-page .services-list .service-card,.premium-page .services-cards .service-card,.premium-page .services-split .service-card,
  body[data-layout="clean-minimal"] .services-cards .service-card,body[data-layout="clean-minimal"] .services-cards .service-card:last-child:nth-child(odd){
    display:grid;width:100%;grid-template-columns:1fr 44px;grid-template-rows:auto auto auto;gap:8px 12px;
    min-height:183px;padding:24px 0;border:0;border-bottom:1px solid var(--line);background:transparent;
  }
  .premium-page .services-list .section-index,.premium-page .services-cards .section-index,.premium-page .services-split .section-index{grid-column:1;grid-row:1}
  .premium-page .services-list .service-copy,.premium-page .services-cards .service-copy,.premium-page .services-split .service-copy{display:block;grid-column:1;grid-row:2/4}
  .premium-page .services-list .service-copy h3,.premium-page .services-cards .service-copy h3,.premium-page .services-split .service-copy h3{grid-column:auto}
  .premium-page .services-list .service-copy p,.premium-page .services-cards .service-copy p,.premium-page .services-split .service-copy p{grid-column:auto;margin-top:8px}
  .premium-page .services-list .service-link,.premium-page .services-cards .service-link,.premium-page .services-split .service-link{grid-column:2;grid-row:1/4;align-self:center}
  .premium-page .services-cards .service-card:last-child:nth-child(odd),.premium-page .services-split .service-card:last-child:nth-child(odd){width:100%}
  body[data-layout="trust-blue"] .about-editorial,.premium-page .about-profile,body[data-layout="premium-navy"] .about-editorial{display:flex;flex-direction:column;gap:32px}
  body[data-layout="trust-blue"] .about-section .adviser-card{width:100%}
  .premium-page .about-profile .about-portrait{width:min(288px,100%)}
  body[data-layout="premium-navy"] .about-portrait{width:min(288px,100%);margin-inline:auto}
  .premium-page .agent-facts{grid-template-columns:1fr}
  .premium-page .agent-facts>div{grid-template-columns:110px 1fr}
  .premium-page .process-timeline,.premium-page .process-steps{display:flex;flex-direction:column;border-top:0;gap:0}
  body[data-layout="trust-blue"] .process-timeline{display:flex;flex-direction:column;gap:0}
  body[data-layout="trust-blue"] .process-timeline li{display:block;min-height:150px;padding:24px 0;border-top:0;border-bottom:1px solid var(--line)}
  .premium-page .services-split .service-card:first-child{display:grid;width:100%;grid-template-columns:1fr 44px;grid-template-rows:auto auto auto;gap:8px 12px;min-height:183px;padding:24px 0;border:0;border-bottom:1px solid var(--line);background:transparent}
  .premium-page .services-split .service-card:first-child .section-index{grid-column:1;grid-row:1}
  .premium-page .services-split .service-card:first-child .service-copy{display:block;grid-column:1;grid-row:2/4}
  .premium-page .services-split .service-card:first-child .service-link{grid-column:2;grid-row:1/4;align-self:center}
  .premium-page .process-timeline li,.premium-page .process-steps li{
    display:block;min-height:150px;padding:24px 0;border:0;border-bottom:1px solid var(--line);background:transparent;
  }
  .premium-page .process-grid li h3{margin:8px 0 0}
  .premium-page .focus-grid,.premium-page .review-grid{grid-template-columns:1fr}
  .premium-page .faq-question{gap:12px}
  .premium-page .faq-number{min-width:32px}
  .premium-page .faq-list summary{font-size:1.125rem;padding:22px 0}
  .premium-page .faq-list details>p{margin:0 0 22px;color:var(--muted)}
  .premium-page .contact-grid{display:flex;flex-direction:column;gap:28px}
  .premium-page .contact-copy>p:not(.eyebrow){margin-top:12px}
  .premium-page .contact-person img{width:84px;height:112px}
  .premium-page .direct-contact-panel{width:100%;padding:24px}
  .premium-page .direct-contact-panel .direct-contact-actions{display:flex;flex-wrap:wrap}
  .premium-page .direct-contact-panel .button{flex:1 1 140px;min-width:0;padding-inline:12px}
  .premium-page .direct-contact-details{grid-template-columns:1fr}
  .premium-page .site-footer{padding-block:48px calc(120px + env(safe-area-inset-bottom))}
  .premium-page .footer-top{grid-template-columns:1fr;gap:24px}
  .premium-page .footer-contact{text-align:left}
  .premium-page .site-footer .direct-contact-actions{justify-content:flex-start}
  .premium-page .footer-bottom{align-items:flex-start;flex-direction:column}
  .premium-page .mobile-cta{
    position:fixed;z-index:80;left:0;right:0;bottom:0;display:block;padding:15px 24px calc(15px + env(safe-area-inset-bottom));
    background:var(--surface);border-top:1px solid var(--line);backdrop-filter:blur(12px);
  }
  .premium-page .mobile-cta .direct-contact-actions{display:flex;flex-wrap:nowrap;gap:12px}
  .premium-page .mobile-cta .button{flex:1 1 0;min-width:0;min-height:58px;padding-inline:10px}
  .premium-page .mobile-cta .button span{font-size:1rem}
  .premium-page .copy-desktop{display:none}.premium-page .copy-mobile{display:inline}
}

@media(max-width:390px){
  .premium-page .mobile-cta .direct-contact-actions{flex-wrap:wrap}
  .premium-page .mobile-cta .button{flex:1 1 150px}
}

/* Large text must reflow rather than clip. */
@media(min-width:651px){
  .premium-page .header-inner{flex-wrap:wrap}
}
@media(prefers-reduced-motion:reduce){
  .premium-page *{scroll-behavior:auto!important;transition:none!important;animation:none!important}
}
`;

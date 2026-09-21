export const uiCopyDensityRefreshStyles = `
/* UI copy-density refresh: calmer hierarchy, less dead space, and clearer grouping. */

/* Informational marquee cards should read compactly without shrinking type below 16px. */
.premium-page #main .cases-section{padding-block:44px}
.premium-page #main .cases-section .section-heading{margin-bottom:14px}
.premium-page #main .cases-marquee{margin-top:12px;padding-block:2px 6px}
.premium-page #main .cases-track{gap:12px;align-items:stretch}
.premium-page #main .cases-marquee:focus-within .cases-track{animation-play-state:paused}
.premium-page #main .cases-item{
 width:296px;min-width:296px;min-height:0!important;
 grid-template-columns:44px minmax(0,1fr);gap:12px;align-content:start;
 padding:18px 20px;border-top-width:1px;
}
.premium-page #main .cases-copy{gap:7px}
.premium-page #main .cases-copy h3{font-size:1.125rem;line-height:1.48}
.premium-page #main .cases-item p{font-size:1rem;line-height:1.62}
.premium-page #main .cases-badge{font-size:1rem;line-height:1.35}
.premium-page #main .cases-item:hover{transform:none;box-shadow:none}

/* Service topics: one baseline rule contract across all five themes.
   Theme personality stays in surface/accent treatment, not irregular borders. */
.premium-page #main .service-grid{border-top:0!important}
.premium-page #main .service-card,
.premium-page #main .service-card:first-child,
.premium-page #main .service-card:nth-child(3),
.premium-page #main .services-list .service-card,
.premium-page #main .services-cards .service-card,
.premium-page #main .services-split .service-card,
.premium-page #main .services-split .service-card:first-child{
 position:relative;overflow:hidden;
 min-height:0;
 border:0!important;border-top:1px solid var(--line)!important;
 box-shadow:none!important;transform:none!important;
}
.premium-page #main .services-cards .service-card{min-height:152px}
.premium-page #main .service-card::after{
 content:"";display:block!important;position:absolute;
 left:0;right:0;top:0;
 border-top:3px solid var(--accent);
 opacity:0;transform:scaleX(.88);transform-origin:center;
 transition:opacity .18s ease,transform .2s ease;
 pointer-events:none;
}
.premium-page #main .service-card:hover::after,
.premium-page #main .service-card:focus-within::after{opacity:1;transform:scaleX(1)}
.premium-page #main .service-card:hover,
.premium-page #main .service-card:focus-within{
 transform:none!important;box-shadow:none!important;border-top-color:var(--line)!important;
}
.theme-trust-blue #main .service-card{background:var(--surface)!important}
.theme-warm-care #main .service-card{background:var(--surface)!important;border-top:1px solid var(--line)!important}
.theme-premium-navy #main .services-split .service-card,
.theme-premium-navy #main .services-split .service-card:first-child{
 grid-row:auto!important;display:grid!important;
 background:var(--surface)!important;border-top:1px solid var(--line)!important;
}
.theme-clean-minimal #main .service-card{
 background:transparent!important;border-top:1px solid var(--line)!important;padding-inline:4px!important;
}
.theme-local-friendly #main .service-card{
 background:var(--surface)!important;border-top:1px solid var(--line)!important;
 box-shadow:inset 3px 0 0 var(--accent)!important;
}
.theme-local-friendly #main .service-card:hover,
.theme-local-friendly #main .service-card:focus-within{box-shadow:inset 3px 0 0 var(--accent)!important}

/* Insurance scope: Figma B topic-cloud direction.
   Representative labels are evenly distributed and move only a few pixels so the
   section feels alive without becoming distracting. Every colour stays token based. */
.premium-page #main .insurance-scope-section{
 background:var(--paper);border-bottom:1px solid var(--line);
}
.premium-page #main .insurance-scope-heading{
 max-width:68rem;margin-inline:auto;margin-bottom:32px;text-align:center;
}
.premium-page #main .insurance-scope-heading .eyebrow{color:var(--accent)}
.premium-page #main .insurance-scope-heading h2{
 max-width:66rem;margin-inline:auto;text-wrap:balance;
}
.premium-page #main .insurance-scope-heading .section-support{
 max-width:64rem;margin-inline:auto;color:var(--muted);text-wrap:pretty;
}
.premium-page #main .insurance-scope-cloud{
 width:min(100%,70rem);margin-inline:auto;padding:50px 46px 34px;
 border:1px solid var(--line);border-radius:28px;
 background:var(--surface);box-shadow:0 18px 48px color-mix(in srgb,var(--ink) 7%,transparent);
}
.premium-page #main .insurance-scope-badge{
 display:flex;width:max-content;max-width:100%;align-items:center;justify-content:center;gap:7px;
 margin:0 auto 34px;padding:8px 16px;border-radius:999px;
 background:var(--tint);color:var(--accent);
 font-size:1rem;line-height:1.5;font-weight:700;
}
.premium-page #main .insurance-scope-badge strong{font:inherit;color:inherit}

.premium-page #main .insurance-scope-topics{
 display:grid;grid-template-columns:repeat(12,minmax(0,1fr));
 gap:26px 12px;align-items:center;width:100%;min-width:0;
 margin:0;padding:0;list-style:none;
}
.premium-page #main .insurance-scope-topic{
 grid-column:span 3;display:flex;align-items:center;justify-content:center;
 min-width:0;min-height:64px;padding:6px 4px;text-align:center;
 font-size:clamp(1.125rem,1.45vw,1.375rem);line-height:1.45;
 font-weight:500;letter-spacing:-.02em;color:var(--ink);white-space:nowrap;
}
.premium-page #main .insurance-scope-topic:nth-last-child(-n+3){grid-column:span 4}
.premium-page #main .insurance-scope-topic.is-emphasis{
 font-size:clamp(1.25rem,1.75vw,1.625rem);font-weight:700;letter-spacing:-.03em;
}
.premium-page #main .insurance-scope-topic.is-accent{color:var(--accent)}
.premium-page #main .insurance-scope-topic span{
 display:inline-block;will-change:transform;
 animation:insurance-scope-float 7.4s ease-in-out infinite;
}
.premium-page #main .insurance-scope-topic:nth-child(4n+1) span{--scope-float:-3px;animation-duration:7.8s;animation-delay:-1.4s}
.premium-page #main .insurance-scope-topic:nth-child(4n+2) span{--scope-float:2px;animation-duration:6.8s;animation-delay:-3.2s}
.premium-page #main .insurance-scope-topic:nth-child(4n+3) span{--scope-float:-2px;animation-duration:8.2s;animation-delay:-.6s}
.premium-page #main .insurance-scope-topic:nth-child(4n) span{--scope-float:3px;animation-duration:7.2s;animation-delay:-2.3s}
@keyframes insurance-scope-float{
 0%,100%{transform:translate3d(0,0,0)}
 50%{transform:translate3d(0,var(--scope-float,-2px),0)}
}

.premium-page #main .insurance-scope-all-note{
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
 width:100%;margin-top:34px;padding:17px 22px;border-radius:16px;
 background:var(--tint);color:var(--ink);text-align:center;
}
.premium-page #main .insurance-scope-note-mark{
 width:30px;height:2px;flex:0 0 2px;border-radius:2px;background:var(--accent);
}
.premium-page #main .insurance-scope-all-note p{
 width:100%;margin:0;text-align:center;
 font-size:1rem;line-height:1.65;font-weight:700;color:var(--ink);
 text-wrap:pretty;overflow-wrap:anywhere;
}

@media(max-width:900px){
 .premium-page #main .insurance-scope-heading{margin-bottom:28px}
 .premium-page #main .insurance-scope-cloud{padding:40px 28px 30px;border-radius:24px}
 .premium-page #main .insurance-scope-badge{margin-bottom:30px}
 .premium-page #main .insurance-scope-topics{
  grid-template-columns:repeat(3,minmax(0,1fr));gap:22px 14px;
 }
 .premium-page #main .insurance-scope-topic,
 .premium-page #main .insurance-scope-topic:nth-last-child(-n+3){grid-column:auto}
 .premium-page #main .insurance-scope-topic{min-height:60px}
 .premium-page #main .insurance-scope-all-note{margin-top:30px}
}
@media(max-width:650px){
 .premium-page #main .insurance-scope-heading{margin-bottom:22px}
 .premium-page #main .insurance-scope-cloud{
  padding:30px 14px 22px;border-radius:20px;box-shadow:none;
 }
 .premium-page #main .insurance-scope-badge{
  margin-bottom:26px;padding:7px 13px;font-size:.9375rem;
 }
 .premium-page #main .insurance-scope-topics{
  grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 10px;
 }
 .premium-page #main .insurance-scope-topic{
  min-height:54px;padding:4px 2px;font-size:1.0625rem;line-height:1.45;
  white-space:normal;text-align:center;overflow-wrap:anywhere;
 }
 .premium-page #main .insurance-scope-topic.is-emphasis{font-size:1.1875rem}
 .premium-page #main .insurance-scope-topic:last-child:nth-child(odd){
  grid-column:1/-1;justify-self:center;width:min(100%,10rem);
 }
 .premium-page #main .insurance-scope-all-note{
  margin-top:26px;padding:15px 14px;border-radius:14px;
 }
 .premium-page #main .insurance-scope-note-mark{width:24px}
 .premium-page #main .insurance-scope-all-note p{font-size:.9375rem;line-height:1.7}
}
@media(max-width:390px){
 .premium-page #main .insurance-scope-cloud{padding-inline:12px}
 .premium-page #main .insurance-scope-topics{gap:16px 8px}
 .premium-page #main .insurance-scope-topic{font-size:1rem}
 .premium-page #main .insurance-scope-topic.is-emphasis{font-size:1.125rem}
}
@media(prefers-reduced-motion:reduce){
 .premium-page #main .insurance-scope-topic span{animation:none!important;transform:none!important}
}

/* About stays editorial; identity facts now live where the user can act on them. */
.premium-page #main .about-editorial .about-copy{
 max-width:50rem;padding-top:22px;border-top:1px solid var(--line);
}
.premium-page #main .about-editorial .about-copy>p{max-width:46rem}
.premium-page #main .about-editorial .agent-meta{max-width:46rem;margin:18px auto 0}

/* Adviser principle: one readable statement. The 16 intro choices each get a
   distinct, subtle text composition instead of four repeated cards. */
.premium-page #main .adviser-principle{
 position:relative;max-width:46rem;margin-top:28px;padding-top:20px;border-top:1px solid var(--line);
}
.premium-page #main .adviser-principle-copy{min-width:0}
.premium-page #main .adviser-principle .eyebrow{margin:0 0 8px;font-size:var(--ch-small);line-height:var(--ch-small-lh)}
.premium-page #main .adviser-principle h3{
 margin:0;max-width:42rem;font-size:clamp(1.25rem,2vw,1.5rem);line-height:1.5;
 font-weight:700;letter-spacing:-.025em;color:var(--ink);text-wrap:balance;overflow-wrap:anywhere;
}
.premium-page #main .adviser-principle-body{
 margin:9px 0 0;max-width:44rem;font-size:1.0625rem;line-height:1.72;color:var(--muted);text-wrap:pretty;
}
.premium-page #main .principle-layout-01{max-width:46rem}
.premium-page #main .principle-layout-02{border-top:0;border-left:2px solid var(--accent);padding:2px 0 2px 20px}
.premium-page #main .principle-layout-03{max-width:40rem;margin-inline:auto;text-align:center;border-top:0;padding-top:0}
.premium-page #main .principle-layout-03::before{content:"";display:block;width:48px;border-top:2px solid var(--accent);margin:0 auto 14px}
.premium-page #main .principle-layout-04 .adviser-principle-copy{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.25fr);gap:8px 26px;align-items:start}
.premium-page #main .principle-layout-04 .eyebrow{grid-column:1/-1}
.premium-page #main .principle-layout-04 h3{grid-column:1}
.premium-page #main .principle-layout-04 .adviser-principle-body{grid-column:2;margin-top:0}
.premium-page #main .principle-layout-05{border-top:0;padding-top:0}
.premium-page #main .principle-layout-05 .adviser-principle-copy{display:grid;grid-template-columns:7.5rem minmax(0,1fr);gap:4px 22px}
.premium-page #main .principle-layout-05 .eyebrow{grid-row:1/3;grid-column:1;padding-top:2px}
.premium-page #main .principle-layout-05 h3,.premium-page #main .principle-layout-05 .adviser-principle-body{grid-column:2}
.premium-page #main .principle-layout-06{border-top:0;border-bottom:1px solid var(--line);padding:0 0 20px}
.premium-page #main .principle-layout-07{max-width:38rem;margin-right:auto}
.premium-page #main .principle-layout-08{max-width:43rem;border-top-color:var(--accent)}
.premium-page #main .principle-layout-08 h3{color:var(--accent)}
.premium-page #main .principle-layout-09{border-top:0;border-left:1px solid var(--line);padding:2px 0 2px 24px}
.premium-page #main .principle-layout-10 .adviser-principle-copy{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:8px 28px}
.premium-page #main .principle-layout-10 .eyebrow{grid-column:1/-1}
.premium-page #main .principle-layout-10 h3{grid-column:1}
.premium-page #main .principle-layout-10 .adviser-principle-body{grid-column:2;margin-top:0}
.premium-page #main .principle-layout-11{border-top:0;padding-top:0}
.premium-page #main .principle-layout-11 .adviser-principle-copy{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px 18px;align-items:start}
.premium-page #main .principle-layout-11 .eyebrow{grid-column:1;grid-row:1;margin-top:4px}
.premium-page #main .principle-layout-11 h3{grid-column:2;grid-row:1}
.premium-page #main .principle-layout-11 .adviser-principle-body{grid-column:2;grid-row:2;margin-top:2px}
.premium-page #main .principle-layout-12{max-width:42rem;margin-inline:auto;text-align:center}
.premium-page #main .principle-layout-12 .adviser-principle-body{max-width:38rem;margin-inline:auto;text-align:left;margin-top:10px}
.premium-page #main .principle-layout-13{border-block:1px solid var(--line);padding:18px 0}
.premium-page #main .principle-layout-14{max-width:41rem;margin-inline:auto;border-top:0;padding-top:0;text-align:center}
.premium-page #main .principle-layout-14 .adviser-principle-body{margin-inline:auto}
.premium-page #main .principle-layout-15{border-top:0;padding-top:18px}
.premium-page #main .principle-layout-15::before{content:"";position:absolute;left:0;top:0;width:5.5rem;border-top:3px solid var(--accent)}
.premium-page #main .principle-layout-15 .adviser-principle-body{padding-left:24px}
.premium-page #main .principle-layout-16{max-width:44rem;margin-left:auto}
.premium-page #main .principle-layout-16 h3{max-width:34rem}
.premium-page #main .principle-layout-16 .adviser-principle-body{max-width:40rem;padding-left:20px;border-left:1px solid var(--line)}

/* Contact panel becomes the single factual identity block. */
.premium-page #main .direct-contact-details .contact-identity dd{
 color:var(--ink);font-weight:700;
}
.premium-page #main .direct-contact-details .contact-identity:nth-child(2) dd{
 font-size:1.0625rem;line-height:1.6;
}

/* Statement heroes: three key topics, actions and disclaimer share one center line. */
.premium-page #main .hero-statement .hero-topics{
 justify-content:center;margin:18px auto 0;
}
.theme-clean-minimal #main .hero-statement .hero-topics{
 display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
 width:min(100%,34rem);gap:8px;
}
.theme-clean-minimal #main .hero-statement .hero-topics span{
 justify-content:center;text-align:center;min-height:40px;padding:6px 10px;
}
.premium-page #main .hero-statement .hero-actions{align-items:center}
.premium-page #main .hero-statement .hero-actions>.text-link{display:inline-flex;justify-content:center}
.premium-page #main .hero-statement .hero-note{
 max-width:40rem;margin:12px auto 0;text-align:center;
}

@media(max-width:650px){
 .premium-page #main .cases-section{padding-block:36px}
 .premium-page #main .cases-item{
  width:252px;min-width:252px;min-height:0!important;
  grid-template-columns:40px minmax(0,1fr);gap:10px;padding:16px;
 }
 .premium-page #main .cases-copy h3{font-size:1.0625rem}
 .premium-page #main .cases-item p{font-size:1rem}
 .theme-clean-minimal #main .hero-statement .hero-topics{width:100%}
}

@media(max-width:650px){
 .premium-page #main .services-cards .service-card{min-height:0}
 .premium-page #main .adviser-principle,
 .premium-page #main [class*="principle-layout-"]{
  max-width:100%;margin:24px 0 0;padding:18px 0 0;border:0;border-top:1px solid var(--line);text-align:left;
 }
 .premium-page #main [class*="principle-layout-"]::before{display:none}
 .premium-page #main [class*="principle-layout-"] .adviser-principle-copy{display:block}
 .premium-page #main [class*="principle-layout-"] .eyebrow,
 .premium-page #main [class*="principle-layout-"] h3,
 .premium-page #main [class*="principle-layout-"] .adviser-principle-body{
  display:block;grid-column:auto;grid-row:auto;max-width:none;margin-left:0;margin-right:0;padding-left:0;border-left:0;text-align:left;
 }
 .premium-page #main .adviser-principle h3{font-size:1.25rem}
 .premium-page #main .adviser-principle-body{font-size:1rem;line-height:1.7}
}

@media(max-width:380px){
 .theme-clean-minimal #main .hero-statement .hero-topics{
  grid-template-columns:minmax(0,1fr);width:min(100%,20rem);
 }
}

@media(prefers-reduced-motion:reduce){
 .premium-page #main .cases-track{animation:none!important}
 .premium-page #main .service-card::after{transition:none!important}
}
`;

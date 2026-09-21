export const uiCopyDensityRefreshStyles = `
/* UI copy-density refresh: calmer hierarchy, less dead space, and clearer grouping. */

/* Consulting point carousel: three-card spatial flow with readable Korean copy. */
.premium-page #main .cases-section{
 padding:52px 0 40px;
 background:var(--paper);
 border-block:1px solid var(--line);
}
.premium-page #main .cases-section .cases-heading{
 max-width:50rem;
 margin:10px auto 8px;
 text-align:center;
}
.premium-page #main .cases-section .cases-heading .eyebrow{margin:0 0 10px}
.premium-page #main .cases-section .cases-heading h2{
 max-width:46rem;
 margin:0 auto;
 text-wrap:balance;
}
.premium-page #main .cases-section .cases-heading .section-support{
 max-width:42rem;
 margin:10px auto 0;
 text-wrap:pretty;
}
.premium-page #main .cases-carousel{
 --case-step:clamp(17.5rem,26vw,20.5rem);
 position:relative;
 display:grid;
 grid-template-columns:56px minmax(0,1fr) 56px;
 align-items:center;
 gap:12px;
 margin-top:2px;
}
.premium-page #main .cases-stage{
 min-width:0;
 overflow:visible;
 padding:22px 0 10px;
}
.premium-page #main .cases-list{
 display:grid!important;
 align-items:stretch;
 width:100%!important;
 margin:0;
 padding:0;
 list-style:none;
 animation:none!important;
}
.premium-page #main .cases-carousel .cases-item{
 grid-area:1/1;
 justify-self:center;
 align-self:stretch;
 display:flex!important;
 flex-direction:column;
 width:min(33vw,25rem);
 min-width:0!important;
 min-height:0!important;
 padding:28px 30px 32px!important;
 gap:0!important;
 overflow:visible;
 border:1px solid var(--line)!important;
 border-top:1px solid var(--line)!important;
 border-radius:16px;
 background:var(--surface);
 box-shadow:none;
 opacity:0;
 pointer-events:none;
 transform:translateX(calc(var(--case-step) + 5rem)) scale(.84);
 transform-origin:center;
 transition:transform .54s cubic-bezier(.22,.61,.36,1),opacity .36s ease,box-shadow .36s ease,border-color .36s ease;
}
.premium-page #main .cases-carousel .cases-item.is-hidden-left{
 opacity:0;
 transform:translateX(calc(0px - var(--case-step) - 5rem)) scale(.84);
}
.premium-page #main .cases-carousel .cases-item.is-hidden-right{
 opacity:0;
 transform:translateX(calc(var(--case-step) + 5rem)) scale(.84);
}
.premium-page #main .cases-carousel .cases-item.is-prev{
 z-index:1;
 opacity:.94;
 pointer-events:auto;
 transform:translateX(calc(0px - var(--case-step))) scale(.92) rotate(-1.15deg);
}
.premium-page #main .cases-carousel .cases-item.is-next{
 z-index:1;
 opacity:.94;
 pointer-events:auto;
 transform:translateX(var(--case-step)) scale(.92) rotate(1.15deg);
}
.premium-page #main .cases-carousel .cases-item.is-active{
 z-index:3;
 opacity:1;
 pointer-events:auto;
 transform:translateX(0) scale(1.02);
 border-bottom:4px solid var(--accent)!important;
 box-shadow:0 18px 38px rgba(29,33,39,.10);
}
.premium-page #main .cases-badge{
 display:block;
 width:auto;
 min-width:0;
 height:auto;
 margin:0 0 26px;
 padding:0;
 border:0;
 background:transparent;
 font-size:.875rem;
 line-height:1.35;
 font-weight:700;
 letter-spacing:.16em;
 color:var(--accent);
 font-variant-numeric:tabular-nums;
}
.premium-page #main .cases-badge::before{content:none}
.premium-page #main .cases-copy{
 display:flex;
 flex-direction:column;
 min-width:0;
 gap:0!important;
}
.premium-page #main .cases-copy h3{
 min-height:3.05em;
 margin:0;
 font-size:clamp(1.35rem,1.8vw,1.65rem);
 line-height:1.45;
 font-weight:700;
 letter-spacing:-.03em;
 color:var(--ink);
 text-wrap:balance;
 word-break:keep-all;
}
.premium-page #main .cases-copy h3.cases-title-single{
 min-height:1.4em;
 font-size:clamp(1.5rem,1.9vw,1.75rem);
 line-height:1.4;
}
.premium-page #main .cases-item p{
 margin:22px 0 0;
 font-size:1.125rem;
 line-height:1.72;
 font-weight:400;
 letter-spacing:-.012em;
 color:var(--muted);
 text-wrap:pretty;
 word-break:keep-all;
 overflow-wrap:break-word;
}
.premium-page #main .cases-nav{
 position:relative;
 z-index:6;
 display:grid;
 place-items:center;
 width:52px;
 height:52px;
 padding:0;
 border:1px solid var(--line);
 border-radius:50%;
 background:var(--surface);
 color:var(--ink);
 cursor:pointer;
 transition:background-color .2s ease,border-color .2s ease,transform .2s ease;
}
.premium-page #main .cases-nav:hover{
 background:var(--tint);
 border-color:var(--input);
 transform:translateY(-1px);
}
.premium-page #main .cases-nav:focus-visible{
 outline:3px solid var(--accent);
 outline-offset:3px;
}
.premium-page #main .cases-nav-mark{
 display:block;
 width:12px;
 height:12px;
 border-top:2px solid currentColor;
 border-right:2px solid currentColor;
}
.premium-page #main .cases-nav-prev .cases-nav-mark{transform:rotate(-135deg) translate(-1px,-1px)}
.premium-page #main .cases-nav-next .cases-nav-mark{transform:rotate(45deg) translate(-1px,1px)}
.premium-page #main .cases-live{
 position:absolute!important;
 width:1px!important;
 height:1px!important;
 padding:0!important;
 margin:-1px!important;
 overflow:hidden!important;
 clip:rect(0,0,0,0)!important;
 white-space:nowrap!important;
 border:0!important;
}
@media(max-width:900px){
 .premium-page #main .cases-carousel{--case-step:clamp(15rem,42vw,19rem)}
 .premium-page #main .cases-carousel .cases-item{width:min(58vw,23rem)}
}
@media(max-width:650px){
 .premium-page #main .cases-section{padding:40px 0 34px}
 .premium-page #main .cases-section .container{width:min(calc(100% - 1.5rem),35rem)}
 .premium-page #main .cases-section .cases-heading{margin:2px auto 6px}
 .premium-page #main .cases-section .cases-heading .eyebrow{margin-bottom:8px}
 .premium-page #main .cases-section .cases-heading .section-support{margin-top:8px}
 .premium-page #main .cases-carousel{
  --case-step:110%;
  grid-template-columns:44px minmax(0,1fr) 44px;
  gap:4px;
  margin-top:0;
 }
 .premium-page #main .cases-stage{overflow:hidden;padding:18px 0 8px}
 .premium-page #main .cases-carousel .cases-item{
  width:min(calc(100% - 8px),20.5rem);
  padding:22px 20px 24px!important;
  border-radius:14px;
 }
 .premium-page #main .cases-carousel .cases-item.is-prev,
 .premium-page #main .cases-carousel .cases-item.is-next{opacity:0;pointer-events:none}
 .premium-page #main .cases-copy h3{min-height:0;font-size:1.35rem;line-height:1.45}
 .premium-page #main .cases-copy h3.cases-title-single{font-size:1.45rem;line-height:1.42}
 .premium-page #main .cases-item p{margin-top:18px;font-size:1.0625rem;line-height:1.7}
 .premium-page #main .cases-badge{margin-bottom:20px;font-size:.8125rem}
 .premium-page #main .cases-nav{width:44px;height:44px}
}
@media(prefers-reduced-motion:reduce){
 .premium-page #main .cases-carousel .cases-item,
 .premium-page #main .cases-nav{transition:none!important}
}


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

/* Insurance scope: split directory inspired by the approved second concept.
   Desktop keeps the content narrower and removes directional arrows.
   Mobile collapses each insurance item to icon + name only. */
.premium-page #main .insurance-scope-section{
 background:var(--paper);border-bottom:1px solid var(--line);
}
.premium-page #main .insurance-scope-heading{
 max-width:58rem;margin-inline:auto;margin-bottom:26px;text-align:center;
}
.premium-page #main .insurance-scope-heading .eyebrow{color:var(--accent)}
.premium-page #main .insurance-scope-heading h2{max-width:56rem;margin-inline:auto;text-wrap:balance}
.premium-page #main .insurance-scope-heading .section-support{
 max-width:52rem;margin-inline:auto;color:var(--muted);text-wrap:pretty;
}
.premium-page #main .insurance-scope-directory{
 display:grid;grid-template-columns:minmax(20rem,.95fr) minmax(0,1.25fr);gap:18px;
 width:min(100%,62rem);margin-inline:auto;align-items:stretch;
}
.premium-page #main .insurance-scope-group{
 display:flex;flex-direction:column;height:100%;
 min-width:0;padding:26px;border:1px solid var(--line);border-radius:18px;background:var(--surface);
}
.premium-page #main .insurance-scope-popular{background:var(--tint)}
.premium-page #main .insurance-scope-label{
 margin:0 0 8px;font-size:.75rem;line-height:1.4;font-weight:700;letter-spacing:.16em;color:var(--accent);
}
.premium-page #main .insurance-scope-group h3{
 margin:0;font-size:clamp(1.5rem,2vw,1.75rem);line-height:1.4;font-weight:700;letter-spacing:-.03em;color:var(--ink);
}
.premium-page #main .insurance-scope-group-support{
 margin:8px 0 20px;font-size:.9rem;line-height:1.55;letter-spacing:-.025em;color:var(--muted);text-wrap:pretty;
}
.premium-page #main .insurance-scope-list{
 display:grid;grid-auto-rows:minmax(0,1fr);align-content:stretch;flex:1 1 auto;
 gap:10px;margin:0;padding:0;list-style:none;
}
.premium-page #main .insurance-scope-popular-list{grid-template-columns:minmax(0,1fr)}
.premium-page #main .insurance-scope-other-list{grid-template-columns:repeat(2,minmax(0,1fr))}
.premium-page #main .insurance-scope-item{
 display:grid;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:12px;
 min-width:0;min-height:78px;height:100%;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:var(--surface);
}
.premium-page #main .insurance-scope-icon{
 display:grid;place-items:center;width:44px;height:44px;border-radius:50%;
 background:var(--paper);color:var(--accent);
}
.premium-page #main .insurance-scope-icon svg{display:block;max-width:24px;max-height:24px}
.premium-page #main .insurance-scope-item-copy{min-width:0}
.premium-page #main .insurance-scope-item h4{
 margin:0;font-family:var(--ch-font);font-size:1.0625rem;line-height:1.45;font-weight:700;
 letter-spacing:-.02em;color:var(--ink);overflow-wrap:anywhere;
}
.premium-page #main .insurance-scope-item p{
 margin:4px 0 0;font-size:.9rem;line-height:1.55;color:var(--muted);text-wrap:pretty;overflow-wrap:anywhere;
}
@media(min-width:901px){
 .premium-page #main .insurance-scope-popular .insurance-scope-group-support{
  white-space:nowrap;letter-spacing:-.045em;
 }
}
@media(max-width:900px){
 .premium-page #main .insurance-scope-directory{grid-template-columns:1fr;width:min(100%,44rem);gap:14px}
 .premium-page #main .insurance-scope-popular-list{grid-template-columns:repeat(2,minmax(0,1fr))}
 .premium-page #main .insurance-scope-other-list{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:650px){
 .premium-page #main .insurance-scope-heading{margin-bottom:18px}
 .premium-page #main .insurance-scope-directory{gap:12px}
 .premium-page #main .insurance-scope-group{padding:18px 14px;border-radius:14px}
 .premium-page #main .insurance-scope-label{margin-bottom:5px;font-size:.6875rem}
 .premium-page #main .insurance-scope-group h3{font-size:1.25rem}
 .premium-page #main .insurance-scope-group-support{display:none}
 .premium-page #main .insurance-scope-list{gap:9px;margin-top:14px}
 .premium-page #main .insurance-scope-item{
  grid-template-columns:38px minmax(0,1fr);gap:9px;min-height:66px;padding:10px 11px;border-radius:10px;
 }
 .premium-page #main .insurance-scope-icon{width:38px;height:38px}
 .premium-page #main .insurance-scope-icon svg{width:21px;height:21px}
 .premium-page #main .insurance-scope-item h4{font-size:.96875rem;line-height:1.4}
 .premium-page #main .insurance-scope-item p{display:none}
 .premium-page #main .insurance-scope-popular-list,.premium-page #main .insurance-scope-other-list{
  grid-template-columns:repeat(2,minmax(0,1fr));
 }
 .premium-page #main .insurance-scope-popular-list .insurance-scope-item:last-child:nth-child(odd){
  grid-column:1/-1;width:calc(50% - 4.5px);justify-self:center;
 }
}
@media(max-width:360px){
 .premium-page #main .insurance-scope-group{padding-inline:11px}
 .premium-page #main .insurance-scope-list{gap:8px}
 .premium-page #main .insurance-scope-item{grid-template-columns:34px minmax(0,1fr);gap:7px;padding-inline:9px}
 .premium-page #main .insurance-scope-icon{width:34px;height:34px}
 .premium-page #main .insurance-scope-icon svg{width:19px;height:19px}
 .premium-page #main .insurance-scope-item h4{font-size:.9rem}
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
 .premium-page #main .service-card::after{transition:none!important}
}


/* Adviser introduction: reference composition with portrait, narrative and three promises. */
.premium-page #main .about-section-profile{
 padding-block:38px!important;
 background:var(--tint);
}
.premium-page #main .about-profile{
 display:grid;
 grid-template-columns:minmax(15.5rem,18.25rem) minmax(0,33rem);
 justify-content:center;
 align-items:start;
 gap:32px;
 width:min(100%,55rem);
 max-width:55rem;
 margin-inline:auto;
}
.premium-page #main .about-profile-portrait{
 width:100%;
 max-width:18.25rem;
 margin:0;
}
.premium-page #main .about-profile-portrait>img{
 display:block;
 width:100%;
 aspect-ratio:3/4;
 height:auto;
 object-fit:cover!important;
 object-position:50% 13%!important;
 background:var(--paper);
}
.premium-page #main .about-profile-caption{
 display:flex;
 flex-direction:column;
 align-items:center;
 gap:0;
 padding-top:2px;
 text-align:center;
 color:var(--ink);
}
.premium-page #main .about-profile-caption strong{
 font-size:1.625rem;
 line-height:1.25;
 font-weight:750;
 letter-spacing:-.045em;
}
.premium-page #main .about-profile-caption span{
 font-size:.9375rem;
 line-height:1.45;
 color:var(--ink);
}
.premium-page #main .about-profile-content{
 min-width:0;
 padding-top:1px;
}
.premium-page #main .about-profile-heading{
 max-width:none;
 margin:0;
 text-align:left;
}
.premium-page #main .about-profile-heading .eyebrow{
 margin:0 0 12px;
 font-size:.875rem;
 line-height:1.45;
 font-weight:700;
 letter-spacing:.02em;
 color:var(--muted);
}
.premium-page #main .about-profile-heading h2{
 margin:0;
 max-width:29rem;
 font-size:clamp(1.78rem,2.2vw,2.08rem);
 line-height:1.18;
 font-weight:760;
 letter-spacing:-.05em;
 color:var(--ink);
 text-wrap:balance;
}
.premium-page #main .about-profile-copy{
 width:100%;
 max-width:none;
 margin:18px 0 0;
 padding:0;
 text-align:left;
 border:0;
}
.premium-page #main .about-profile-lead p,
.premium-page #main .about-profile-message p{
 max-width:none;
 margin:0;
 font-size:1.0625rem;
 line-height:1.76;
 letter-spacing:-.022em;
 color:var(--muted);
}
.premium-page #main .about-profile-lead p+p{margin-top:1px}
.premium-page #main .about-profile-lead strong,
.premium-page #main .about-profile-message strong{
 font-weight:750;
 color:var(--ink);
}
.premium-page #main .about-profile-message{
 margin-top:13px;
 padding-top:13px;
 border-top:1px solid var(--line);
}
.premium-page #main .about-profile-values{
 display:grid;
 grid-template-columns:repeat(3,minmax(0,1fr));
 width:min(100%,29.5rem);
 margin-top:22px;
 margin-left:-10px;
}
.premium-page #main .about-profile-values.adviser-principle{
 position:relative;
 max-width:none;
 padding:0;
 border:0;
}
.premium-page #main .about-profile-principle-copy{
 position:absolute;
 width:1px;
 height:1px;
 padding:0;
 margin:-1px;
 overflow:hidden;
 clip-path:inset(50%);
 white-space:nowrap;
 border:0;
}
.premium-page #main .about-profile-value{
 min-width:0;
 padding:0 7px;
 text-align:center;
}
.premium-page #main .about-profile-value:first-child{padding-left:0}
.premium-page #main .about-profile-value:last-child{padding-right:0}
.premium-page #main .about-profile-value+.about-profile-value{
 border-left:1px solid var(--line);
}
.premium-page #main .about-profile-value strong{
 display:block;
 font-size:1.45rem;
 line-height:1.25;
 font-weight:760;
 letter-spacing:-.035em;
 color:var(--ink);
}
.premium-page #main .about-profile-value span{
 display:block;
 margin-top:4px;
 font-size:.9375rem;
 line-height:1.45;
 letter-spacing:-.025em;
 color:var(--ink);
 white-space:nowrap;
}
.premium-page #main .about-profile .career-list,
.premium-page #main .about-profile .agent-meta{
 margin-top:20px;
}

@media(max-width:800px){
 .premium-page #main .about-section-profile{padding-block:34px!important}
 .premium-page #main .about-profile{
  grid-template-columns:minmax(0,1fr);
  width:min(100%,35rem);
  gap:28px;
 }
 .premium-page #main .about-profile-portrait{
  width:min(72vw,18.25rem);
  margin-inline:auto;
 }
 .premium-page #main .about-profile-content{padding-top:0}
 .premium-page #main .about-profile-heading{text-align:center}
 .premium-page #main .about-profile-heading h2{
  max-width:29rem;
  margin-inline:auto;
  font-size:clamp(1.75rem,7vw,2.15rem);
 }
 .premium-page #main .about-profile-copy{
  max-width:31rem;
  margin:18px auto 0;
 }
 .premium-page #main .about-profile-values{
  width:min(100%,29rem);
  margin-left:auto;
  margin-right:auto;
 }
}
@media(max-width:420px){
 .premium-page #main .about-profile-values{margin-top:20px}
 .premium-page #main .about-profile-value{padding-inline:7px}
 .premium-page #main .about-profile-value strong{font-size:1.25rem}
 .premium-page #main .about-profile-value span{
  font-size:.8125rem;
  line-height:1.4;
  white-space:normal;
  word-break:keep-all;
 }
}
`;

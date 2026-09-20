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

/* Service topics: consistent hairline first, stronger top rule only on hover/focus.
   These are informational cards, so the state does not add lift, pointer cues, or shadow. */
.premium-page #main .services-cards[data-count] .service-card,
.premium-page #main .services-split[data-count] .service-card,
.premium-page #main .services-split[data-count] .service-card:first-child{
 position:relative;overflow:hidden;
 border-top:1px solid var(--line)!important;
 box-shadow:none!important;transform:none!important;
}
.premium-page #main .service-card::after{
 display:block!important;
 left:0;right:0;top:0;
 border-top:3px solid var(--accent);
 opacity:0;transform:scaleX(.86);transform-origin:center;
 transition:opacity .18s ease,transform .2s ease;
 pointer-events:none;
}
.premium-page #main .service-card:hover::after,
.premium-page #main .service-card:focus-within::after{
 opacity:1;transform:scaleX(1);
}
.premium-page #main .service-card:hover,
.premium-page #main .service-card:focus-within{
 transform:none!important;box-shadow:none!important;
}
.theme-clean-minimal #main .services-cards[data-count]{
 gap:18px 24px;border-top:0;
}
.theme-clean-minimal #main .services-cards[data-count] .service-card:nth-child(n){
 min-height:0!important;
 padding:24px 4px!important;
 border-left:0!important;border-right:0!important;border-bottom:0!important;
 border-top:1px solid var(--line)!important;
 background:transparent!important;
 box-shadow:none!important;transform:none!important;overflow:hidden;
}

/* About stays editorial; identity facts now live where the user can act on them. */
.premium-page #main .about-editorial .about-copy{
 max-width:50rem;padding-top:22px;border-top:1px solid var(--line);
}
.premium-page #main .about-editorial .about-copy>p{max-width:46rem}
.premium-page #main .about-editorial .agent-meta{max-width:46rem;margin:18px auto 0}

/* Adviser principles: typography-led trust content, not another boxed card section. */
.premium-page #main .adviser-principles{
 margin-top:30px;padding-top:24px;border-top:1px solid var(--line);
}
.premium-page #main .adviser-principles-intro{max-width:46rem}
.premium-page #main .adviser-principles-intro .eyebrow{
 margin:0 0 8px;font-size:var(--ch-small);line-height:var(--ch-small-lh);
}
.premium-page #main .adviser-principles-intro h3{
 margin:0;max-width:42rem;
 font-size:clamp(1.25rem,2vw,1.5rem);line-height:1.5;
 font-weight:700;letter-spacing:-.025em;text-wrap:balance;
}
.premium-page #main .adviser-principles-intro>p:last-child{
 margin:10px 0 0;max-width:44rem;
 font-size:var(--ch-body);line-height:1.7;color:var(--muted);
}
.premium-page #main .adviser-principles-list{
 display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
 gap:18px 22px;margin:24px 0 0;padding:0;list-style:none;
}
.premium-page #main .adviser-principles-list li{
 display:grid;grid-template-columns:28px minmax(0,1fr);
 gap:12px;align-items:start;min-width:0;
 padding:14px 0 0;border-top:1px solid var(--line);
}
.premium-page #main .principle-index{
 padding-top:2px;font-size:var(--ch-small);line-height:1.5;
 font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums;
}
.premium-page #main .adviser-principles-list h4{
 margin:0;font-size:1.1875rem;line-height:1.5;
 font-weight:700;letter-spacing:-.02em;color:var(--ink);text-wrap:balance;
}
.premium-page #main .adviser-principles-list p{
 margin:6px 0 0;font-size:1.0625rem;line-height:1.7;
 color:var(--muted);text-wrap:pretty;
}
.premium-page #main .about-profile .about-copy{margin-top:24px}
.premium-page #main .about-profile .adviser-principles{margin-top:28px}

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

@media(max-width:900px) and (min-width:651px){
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
 .premium-page #main .adviser-principles{margin-top:24px;padding-top:20px}
 .premium-page #main .adviser-principles-list{grid-template-columns:minmax(0,1fr);gap:14px;margin-top:20px}
 .premium-page #main .adviser-principles-list li{padding-top:13px}
 .premium-page #main .adviser-principles-list h4{font-size:1.125rem}
 .premium-page #main .adviser-principles-list p{font-size:1rem}
}

@media(max-width:380px){
 .theme-clean-minimal #main .hero-statement .hero-topics{
  grid-template-columns:minmax(0,1fr);width:min(100%,20rem);
 }
}

@media(prefers-reduced-motion:reduce){
 .premium-page #main .cases-track{animation:none!important}
}
`;

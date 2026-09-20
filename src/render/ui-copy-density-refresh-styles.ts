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

/* Clean Minimal: only interior rules, no boxed outer cards. */
.theme-clean-minimal #main .services-cards[data-count="6"]{
 display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;border:0;
}
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(n){
 grid-column:auto!important;width:auto;min-height:0!important;justify-self:stretch;
 padding:26px 30px!important;border:0!important;background:transparent!important;
 box-shadow:none!important;transform:none!important;overflow:visible;
}
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(3n+2),
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(3n+3){
 border-left:1px solid var(--line)!important;
}
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(n+4){
 border-top:1px solid var(--line)!important;
}
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card::after{display:none}
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card:hover,
.theme-clean-minimal #main .services-cards[data-count="6"] .service-card:focus-within{
 background:transparent!important;border-color:var(--line)!important;box-shadow:none!important;transform:none!important;
}

/* About stays editorial; identity facts now live where the user can act on them. */
.premium-page #main .about-editorial .about-copy{
 max-width:50rem;padding-top:22px;border-top:1px solid var(--line);
}
.premium-page #main .about-editorial .about-copy>p{max-width:46rem}
.premium-page #main .about-editorial .agent-meta{max-width:46rem;margin:18px auto 0}

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
 .theme-clean-minimal #main .services-cards[data-count="6"]{grid-template-columns:repeat(2,minmax(0,1fr))}
 .theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(n){border:0!important;padding:24px 26px!important}
 .theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(even){border-left:1px solid var(--line)!important}
 .theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(n+3){border-top:1px solid var(--line)!important}
}

@media(max-width:650px){
 .premium-page #main .cases-section{padding-block:36px}
 .premium-page #main .cases-item{
  width:252px;min-width:252px;min-height:0!important;
  grid-template-columns:40px minmax(0,1fr);gap:10px;padding:16px;
 }
 .premium-page #main .cases-copy h3{font-size:1.0625rem}
 .premium-page #main .cases-item p{font-size:1rem}
 .theme-clean-minimal #main .services-cards[data-count="6"]{grid-template-columns:minmax(0,1fr)}
 .theme-clean-minimal #main .services-cards[data-count="6"] .service-card:nth-child(n){
  border:0!important;padding:22px 4px!important;
 }
 .theme-clean-minimal #main .services-cards[data-count="6"] .service-card+ .service-card{
  border-top:1px solid var(--line)!important;
 }
 .theme-clean-minimal #main .hero-statement .hero-topics{width:100%}
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

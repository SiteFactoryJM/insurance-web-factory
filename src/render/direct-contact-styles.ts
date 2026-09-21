export const directContactStyles = `
/* CH2/Navy/Contact Button — 높이 58, 좌우 24, 간격 10, 모서리 2, 아이콘 21, 18px Medium */
.direct-contact-actions{display:flex;flex-wrap:wrap;gap:.75rem;align-items:stretch}
.premium-page .direct-contact-actions .button{gap:10px;justify-content:center;min-height:58px;padding:0 24px;border-radius:var(--radius-contact);font-weight:500;text-decoration:none;white-space:normal}
.direct-contact-actions svg{flex-shrink:0;width:21px;height:21px}
.contact-grid>*{min-width:0}.contact-person{flex-wrap:wrap}.contact-person>div{min-width:0;overflow-wrap:anywhere}

.premium-page .contact-compact .button{padding:0 16px;font-size:1rem;min-height:44px;gap:8px}
.premium-page .contact-compact svg{width:18px;height:18px}
.premium-page .header-tools{display:flex;align-items:center}.premium-page .header-inner{gap:1.25rem;min-height:6rem}
.premium-page .desktop-nav{gap:1.25rem}.direct-contact-panel{padding:2rem;border:1px solid var(--line);background:var(--paper)}
.direct-contact-panel h3{font-size:1.6rem;margin-bottom:1.5rem}.direct-contact-panel>.direct-contact-actions{margin-block:1.5rem}.direct-contact-panel>p{font-size:1rem}
.direct-contact-details{margin-block:1.75rem}.direct-contact-details>div{display:grid;grid-template-columns:6rem 1fr;gap:1rem;border-bottom:1px solid var(--line);padding:.8rem 0}.direct-contact-details dd{margin:0;overflow-wrap:anywhere}
.demo-contact-notice{border-left:3px solid var(--input);padding-left:1rem;margin-top:1.5rem}.premium-page .hero-note{max-width:36rem}
.premium-page .site-footer .footer-contact{max-width:100%}
.premium-page .section{padding-block:4.5rem}.premium-page .section-heading{margin-bottom:2rem}.premium-page .trust-strip p{line-height:1.6}
body:not([data-studio-preview=true]) .preview-contact-notice{display:none}body[data-studio-preview=true] .demo-contact-notice{display:none}
body[data-studio-preview=true] .direct-contact-actions a,body[data-studio-preview=true] .floating-contact-dock a{cursor:default}
body[data-export-capture="true"] .floating-contact-dock{display:none!important}

@media(max-width:650px){.premium-page{padding-bottom:calc(72px + env(safe-area-inset-bottom))}.premium-page .section{padding-block:3rem}.direct-contact-panel{padding:1.25rem}.direct-contact-actions{gap:.6rem}.direct-contact-panel .direct-contact-actions .button{flex:1 1 100%}.premium-page .direct-mobile-cta{padding:.6rem 1rem calc(.6rem + env(safe-area-inset-bottom));background:var(--paper);border-top:1px solid var(--line)}.direct-mobile-cta .direct-contact-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.direct-mobile-cta .direct-contact-actions:has(>a:only-child){grid-template-columns:1fr}.premium-page .direct-mobile-cta .button{width:100%;font-size:1rem;padding:.75rem .4rem}.premium-page .hero-actions{display:block}.premium-page .hero-actions>.text-link{margin-top:1rem}.premium-page .hero-actions .direct-contact-actions .button{flex:1 1 auto}}
@media(max-width:650px){.direct-contact-details>div{grid-template-columns:minmax(0,1fr);gap:.3rem}}
.floating-contact-dock{position:fixed;z-index:90;right:max(18px,env(safe-area-inset-right));top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:10px;padding:8px;border:1px solid color-mix(in srgb,var(--line) 82%,transparent);background:color-mix(in srgb,var(--paper) 92%,transparent);box-shadow:0 12px 32px rgba(15,23,42,.16);backdrop-filter:blur(10px);border-radius:999px}
.floating-contact-link{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;text-decoration:none;border:1px solid transparent;box-shadow:0 5px 14px rgba(15,23,42,.12);transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}
.floating-contact-link svg{width:22px;height:22px}
.floating-contact-link:hover,.floating-contact-link:focus-visible{transform:translateY(-2px);box-shadow:0 8px 18px rgba(15,23,42,.18)}
.floating-contact-link:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.floating-phone{background:var(--accent);color:var(--on-brand);border-color:var(--accent)}
.floating-kakao{background:var(--kakao);color:var(--kakao-ink);border-color:var(--kakao-line)}
.floating-instagram{background:linear-gradient(135deg,#76596F 0%,#966278 48%,#AE6C76 72%,#BE7968 100%);color:#fff;border-color:#966278}
@media(max-width:650px){.floating-contact-dock{top:auto;bottom:calc(12px + env(safe-area-inset-bottom));right:max(12px,env(safe-area-inset-right));transform:none;flex-direction:row;gap:7px;padding:7px}.floating-contact-link{width:44px;height:44px}.floating-contact-link svg{width:20px;height:20px}}
@media(prefers-reduced-motion:reduce){.floating-contact-link{transition:none}}
@media print{.direct-mobile-cta,.floating-contact-dock,.direct-contact-actions{display:none!important}.premium-page{padding-bottom:0}}
`;

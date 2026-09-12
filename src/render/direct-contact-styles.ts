export const directContactStyles = `
.direct-contact-actions{display:flex;flex-wrap:wrap;gap:.75rem;align-items:stretch}
.premium-page .direct-contact-actions .button{gap:.65rem;justify-content:center;min-height:48px;text-decoration:none;white-space:normal}
.direct-contact-actions svg{flex-shrink:0}.premium-page .direct-kakao{background:#eee6d4;color:#302d24;border:1px solid #c8bda6}
.contact-grid>*{min-width:0}.contact-person{flex-wrap:wrap}.contact-person>div{min-width:0;overflow-wrap:anywhere}
.premium-page .direct-kakao:hover{background:#e3d8c0;color:#302d24}.premium-page .contact-compact .button{padding:.65rem .9rem;font-size:1rem;min-height:44px}
.premium-page .header-tools{display:flex;align-items:center;gap:.75rem}.premium-page .header-inner{gap:1.25rem;min-height:6rem}
.premium-page .desktop-nav{gap:1.25rem}.direct-contact-panel{padding:2rem;border:1px solid var(--line);background:var(--paper)}
.direct-contact-panel h3{font-size:1.6rem;margin-bottom:1.5rem}.direct-contact-panel>.direct-contact-actions{margin-block:1.5rem}.direct-contact-panel>p{font-size:1rem}
.direct-contact-details{margin-block:1.75rem}.direct-contact-details>div{display:grid;grid-template-columns:6rem 1fr;gap:1rem;border-bottom:1px solid var(--line);padding:.8rem 0}.direct-contact-details dd{margin:0;overflow-wrap:anywhere}
.demo-contact-notice{border-left:3px solid var(--input);padding-left:1rem;margin-top:1.5rem}.premium-page .hero-note{max-width:36rem}
.premium-page .site-footer .direct-phone{border:1px solid #b9c4ce;background:transparent;color:#fff}.premium-page .site-footer .footer-contact{max-width:100%}
.premium-page .section{padding-block:4.5rem}.premium-page .section-heading{margin-bottom:2rem}.premium-page .trust-strip p{line-height:1.6}
body:not([data-studio-preview=true]) .preview-contact-notice{display:none}body[data-studio-preview=true] .demo-contact-notice{display:none}
body[data-studio-preview=true] .direct-contact-actions a{cursor:default}
@media(max-width:1250px){.premium-page .header-tools>.direct-contact-actions{display:none}}
@media(max-width:650px){.premium-page{padding-bottom:calc(88px + env(safe-area-inset-bottom))}.premium-page .section{padding-block:3rem}.direct-contact-panel{padding:1.25rem}.direct-contact-actions{gap:.6rem}.direct-contact-panel .direct-contact-actions .button{flex:1 1 100%}.premium-page .direct-mobile-cta{padding:.6rem 1rem calc(.6rem + env(safe-area-inset-bottom));background:var(--paper);border-top:1px solid var(--line)}.direct-mobile-cta .direct-contact-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.direct-mobile-cta .direct-contact-actions:has(>a:only-child){grid-template-columns:1fr}.premium-page .direct-mobile-cta .button{width:100%;font-size:1rem;padding:.75rem .4rem}.premium-page .hero-actions{display:block}.premium-page .hero-actions>.text-link{margin-top:1rem}.premium-page .hero-actions .direct-contact-actions .button{flex:1 1 auto}}
@media(max-width:650px){.direct-contact-details>div{grid-template-columns:minmax(0,1fr);gap:.3rem}}
@media print{.direct-mobile-cta,.direct-contact-actions{display:none!important}.premium-page{padding-bottom:0}}
`;

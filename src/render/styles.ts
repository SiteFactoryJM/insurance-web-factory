export const styles = String.raw`
:root {
  --accent: #1e5aa8;
  --accent-strong: #15447f;
  --accent-soft: #eaf2fb;
  --ink: #142033;
  --muted: #5f6b7a;
  --line: #dfe5ec;
  --surface: #ffffff;
  --surface-muted: #f5f7fa;
  --warm: #f7f3ea;
  --danger: #b42318;
  --success: #147d53;
  --shadow-sm: 0 8px 24px rgba(22, 34, 52, .08);
  --shadow-lg: 0 24px 70px rgba(22, 34, 52, .16);
  --radius-sm: 12px;
  --radius: 22px;
  --radius-lg: 34px;
  --container: 1180px;
  --font-body: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Noto Sans KR", "Malgun Gothic", sans-serif;
  --font-heading: var(--font-body);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 76px; }
body { margin: 0; min-width: 320px; overflow-x: hidden; color: var(--ink); background: var(--surface); font-family: var(--font-body); font-size: 16px; line-height: 1.7; word-break: keep-all; -webkit-font-smoothing: antialiased; }
body.font-noto-serif-kr { --font-heading: "Noto Serif KR", serif; }
body.nav-open { overflow: hidden; }
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; }
button, select { cursor: pointer; }
img { display: block; max-width: 100%; }
svg { flex: 0 0 auto; }
.container { width: min(calc(100% - 40px), var(--container)); margin-inline: auto; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.honeypot { position: absolute !important; left: -9999px !important; opacity: 0 !important; pointer-events: none !important; }

.site-header { position: sticky; top: 0; z-index: 80; height: 70px; border-bottom: 1px solid rgba(223, 229, 236, .8); background: rgba(255,255,255,.94); backdrop-filter: blur(16px); }
.header-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.brand { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
.brand img, .brand-mark { width: 36px; height: 36px; border-radius: 12px; }
.brand-mark { display: grid; place-items: center; color: #fff; background: var(--accent); font-weight: 800; }
.brand span:last-child { min-width: 0; display: grid; line-height: 1.25; }
.brand strong { font-size: 15px; letter-spacing: -.02em; }
.brand small { margin-top: 2px; color: var(--muted); font-size: 11px; font-weight: 600; }
.nav-toggle { width: 44px; height: 44px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 12px; color: var(--ink); background: var(--surface-muted); }
.main-nav { position: fixed; inset: 70px 0 auto; z-index: 79; display: grid; gap: 4px; padding: 18px 20px 26px; border-bottom: 1px solid var(--line); background: #fff; transform: translateY(-120%); visibility: hidden; opacity: 0; transition: transform .25s ease, opacity .2s ease, visibility .25s; box-shadow: var(--shadow-sm); }
.main-nav.is-open { transform: translateY(0); visibility: visible; opacity: 1; }
.main-nav a { min-height: 48px; display: flex; align-items: center; padding: 0 14px; border-radius: 12px; font-weight: 700; }
.main-nav a:hover, .main-nav a:focus-visible { color: var(--accent); background: var(--accent-soft); outline: none; }
.main-nav .nav-cta { justify-content: center; margin-top: 6px; color: #fff; background: var(--accent); }
.main-nav .nav-cta:hover, .main-nav .nav-cta:focus-visible { color: #fff; background: var(--accent-strong); }

.hero { position: relative; isolation: isolate; overflow: hidden; padding: 52px 0 64px; }
.hero-grid { display: grid; gap: 36px; align-items: center; }
.hero-copy { position: relative; z-index: 2; }
.eyebrow, .local-badge { display: inline-flex; align-items: center; gap: 7px; margin: 0 0 16px; padding: 8px 12px; border-radius: 999px; color: var(--accent-strong); background: var(--accent-soft); font-size: 13px; line-height: 1.2; font-weight: 800; letter-spacing: -.01em; }
.hero h1 { max-width: 750px; margin: 0; font-family: var(--font-heading); font-size: clamp(36px, 9vw, 62px); line-height: 1.17; letter-spacing: -.055em; }
.hero-lead { max-width: 670px; margin: 22px 0 0; color: var(--muted); font-size: 17px; line-height: 1.75; letter-spacing: -.015em; }
.hero-actions { display: grid; gap: 10px; margin-top: 28px; }
.button { min-height: 52px; display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 0 20px; border: 1px solid transparent; border-radius: 14px; font-weight: 800; line-height: 1.2; transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease; }
.button:hover { transform: translateY(-2px); }
.button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible, summary:focus-visible, a:focus-visible { outline: 3px solid color-mix(in srgb, var(--accent) 28%, transparent); outline-offset: 3px; }
.button-primary { color: #fff; background: var(--accent); box-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 25%, transparent); }
.button-primary:hover { background: var(--accent-strong); }
.button-secondary { color: var(--ink); border-color: var(--line); background: rgba(255,255,255,.86); }
.button-block { width: 100%; }
.trust-note { display: flex; align-items: flex-start; gap: 8px; margin: 18px 0 0; color: var(--muted); font-size: 13px; line-height: 1.55; }
.trust-note svg { margin-top: 1px; color: var(--success); }

.profile-card { position: relative; width: min(100%, 430px); margin-inline: auto; overflow: hidden; border: 1px solid rgba(255,255,255,.75); border-radius: var(--radius-lg); background: #fff; box-shadow: var(--shadow-lg); }
.profile-photo-wrap { position: relative; overflow: hidden; aspect-ratio: 4 / 4.55; background: linear-gradient(145deg, var(--accent-soft), #fff); }
.profile-photo { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.profile-status { position: absolute; right: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 7px; padding: 8px 11px; border-radius: 999px; color: var(--ink); background: rgba(255,255,255,.92); box-shadow: var(--shadow-sm); font-size: 12px; font-weight: 800; backdrop-filter: blur(10px); }
.profile-status i { width: 8px; height: 8px; border-radius: 50%; background: #19a66c; box-shadow: 0 0 0 4px rgba(25,166,108,.14); }
.profile-info { padding: 22px 22px 24px; }
.profile-info > p { margin: 0 0 5px; color: var(--muted); font-size: 13px; font-weight: 700; }
.profile-info h2 { margin: 0; font-family: var(--font-heading); font-size: 27px; line-height: 1.3; letter-spacing: -.035em; }
.profile-info h2 small { margin-left: 5px; color: var(--muted); font-family: var(--font-body); font-size: 14px; font-weight: 600; }
.region-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.region-tags span { padding: 5px 9px; border-radius: 7px; color: var(--accent-strong); background: var(--accent-soft); font-size: 11px; font-weight: 800; }
.profile-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 18px 0 0; padding-top: 16px; border-top: 1px solid var(--line); }
.profile-meta div { display: grid; gap: 1px; }
.profile-meta div + div { padding-left: 16px; border-left: 1px solid var(--line); }
.profile-meta dt { color: var(--muted); font-size: 11px; }
.profile-meta dd { margin: 0; font-size: 13px; font-weight: 800; }

.hero-trust-blue { background: radial-gradient(circle at 15% 10%, #fff 0, transparent 28%), linear-gradient(135deg, #f7fbff 0%, #edf5fd 52%, #e5effa 100%); }
.hero-trust-blue::before { content: ""; position: absolute; width: 380px; height: 380px; right: -180px; top: -180px; border: 70px solid rgba(30,90,168,.07); border-radius: 50%; }
.hero-trust-blue .profile-card { transform: rotate(1deg); }

.hero-warm-care { background: linear-gradient(135deg, #fffaf2 0%, #f7f1e4 100%); }
.hero-warm-care .eyebrow { color: #426a53; background: #e7f0e8; }
.hero-warm-care .profile-card { border-radius: 48% 48% 28px 28px; }
.hero-warm-care .profile-photo-wrap { border-radius: 50% 50% 0 0; }
.warm-orb { position: absolute; border-radius: 50%; filter: blur(1px); opacity: .55; }
.warm-orb-one { width: 220px; height: 220px; right: -70px; top: 60px; background: #efcfaa; }
.warm-orb-two { width: 130px; height: 130px; left: -55px; bottom: 40px; background: #cfe0c7; }

.hero-premium-navy { color: #fff; background: #0e1a2e; }
.hero-premium-navy::after { content: ""; position: absolute; inset: 0; z-index: -2; background: radial-gradient(circle at 80% 25%, rgba(197,163,96,.25), transparent 32%), linear-gradient(120deg, #0e1a2e, #142946 65%, #0d182a); }
.premium-grid { position: absolute; inset: 0; z-index: -1; opacity: .13; background-image: linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px); background-size: 60px 60px; mask-image: linear-gradient(to right, transparent, #000); }
.hero-premium-navy .eyebrow { color: #eadbb7; background: rgba(197,163,96,.14); border: 1px solid rgba(197,163,96,.25); }
.hero-premium-navy .hero-lead, .hero-premium-navy .trust-note { color: #c7d1df; }
.hero-premium-navy .button-primary { color: #151b25; background: #d8bb7b; box-shadow: 0 14px 32px rgba(197,163,96,.18); }
.hero-premium-navy .button-secondary { color: #fff; border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.07); }
.hero-premium-navy .profile-card { border-color: rgba(216,187,123,.28); background: #15243a; }
.hero-premium-navy .profile-info > p, .hero-premium-navy .profile-info h2 small, .hero-premium-navy .profile-meta dt { color: #aebdce; }
.hero-premium-navy .profile-info, .hero-premium-navy .profile-meta div + div, .hero-premium-navy .profile-meta { border-color: rgba(255,255,255,.12); }

.hero-clean-minimal { border-bottom: 1px solid #dedede; background: #fdfdfc; }
.hero-clean-minimal .hero-grid { align-items: end; }
.hero-clean-minimal h1 { max-width: 780px; font-weight: 650; }
.hero-clean-minimal .profile-card { border: 0; border-radius: 0; box-shadow: none; background: transparent; }
.hero-clean-minimal .profile-photo-wrap { border-radius: 0; background: #efefed; }
.hero-clean-minimal .profile-info { padding-inline: 0; }
.minimal-index { display: block; margin-bottom: 34px; color: #737373; font-size: 10px; font-weight: 800; letter-spacing: .15em; }

.hero-local-friendly { background: linear-gradient(150deg, #edfaf7 0%, #fff 58%, #fff4ee 100%); }
.hero-local-friendly::before { content: ""; position: absolute; width: 160px; height: 160px; right: 4%; top: 8%; border-radius: 42% 58% 65% 35%; background: rgba(239,123,83,.13); transform: rotate(18deg); }
.hero-local-friendly .local-badge { color: #177b6c; background: #d8f3ec; }
.hero-local-friendly .eyebrow { padding: 0; color: #5c6a69; background: transparent; }
.hero-local-friendly .profile-card { border: 7px solid #fff; border-radius: 28px; transform: rotate(-1deg); }
.hero-local-friendly .profile-info { background: #fff9f5; }

.section { padding: 76px 0; }
.section-muted { background: var(--surface-muted); }
.section-heading { margin-bottom: 34px; }
.section-heading h2, .contact-copy h2, .location-card h2 { margin: 0; font-family: var(--font-heading); font-size: clamp(29px, 7vw, 44px); line-height: 1.25; letter-spacing: -.045em; }
.section-heading > p:last-child { max-width: 610px; margin: 14px 0 0; color: var(--muted); font-size: 16px; }
.section-kicker { margin: 0 0 12px !important; color: var(--accent) !important; font-size: 11px !important; font-weight: 900; letter-spacing: .16em; }
.intro-grid { display: grid; gap: 28px; }
.intro-body { color: #394556; font-size: 17px; line-height: 1.85; }
.intro-body > p { margin: 0; }
.intro-body blockquote { display: flex; align-items: flex-start; gap: 13px; margin: 28px 0 0; padding: 20px; border-left: 4px solid var(--accent); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; background: var(--accent-soft); }
.intro-body blockquote svg { margin-top: 2px; color: var(--accent); }
.intro-body blockquote span { display: grid; gap: 3px; font-weight: 800; }
.intro-body blockquote small { color: var(--muted); font-size: 11px; }
.specialty-grid { display: grid; gap: 14px; }
.specialty-card { position: relative; min-height: 250px; padding: 25px; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.specialty-card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); box-shadow: var(--shadow-sm); }
.card-number { position: absolute; right: 20px; top: 18px; color: #a4acb7; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
.card-icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 15px; color: var(--accent); background: var(--accent-soft); }
.specialty-card h3 { margin: 32px 0 10px; font-size: 21px; line-height: 1.35; letter-spacing: -.025em; }
.specialty-card p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.7; }
.process-section { overflow: hidden; }
.process-list { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; counter-reset: steps; }
.process-item { position: relative; display: grid; grid-template-columns: 46px 1fr; gap: 16px; padding: 0 0 28px; }
.process-item:not(:last-child)::before { content: ""; position: absolute; left: 22px; top: 48px; bottom: 2px; width: 1px; background: var(--line); }
.process-item > span { width: 46px; height: 46px; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--accent) 25%, var(--line)); border-radius: 50%; color: var(--accent); background: #fff; font-weight: 900; }
.process-item h3 { margin: 2px 0 4px; font-size: 18px; }
.process-item p { margin: 0; color: var(--muted); font-size: 14px; }
.career-section { background: var(--ink); color: #fff; }
.career-grid { display: grid; gap: 28px; }
.career-section .section-kicker { color: #a8c8ee !important; }
.career-card { padding: 24px; border: 1px solid rgba(255,255,255,.14); border-radius: var(--radius); background: rgba(255,255,255,.07); }
.career-card ul { display: grid; gap: 15px; margin: 0; padding: 0; list-style: none; }
.career-card li { display: flex; align-items: flex-start; gap: 10px; color: #e8edf4; font-size: 14px; }
.career-card li svg { margin-top: 3px; color: #8fc0f6; }
.registration { margin: 20px 0 0; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.14); color: #aeb9c8; font-size: 12px; }
.faq-grid { display: grid; gap: 24px; }
.faq-list { display: grid; gap: 9px; }
.faq-item { overflow: hidden; border: 1px solid var(--line); border-radius: 15px; background: #fff; }
.faq-item summary { min-height: 64px; display: grid; grid-template-columns: 27px 1fr 20px; align-items: center; gap: 8px; padding: 12px 17px; cursor: pointer; list-style: none; font-weight: 800; line-height: 1.45; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary > span { color: var(--accent); font-weight: 900; }
.faq-item summary svg { transition: transform .2s ease; }
.faq-item[open] summary svg { transform: rotate(90deg); }
.faq-answer { display: grid; grid-template-columns: 27px 1fr; gap: 8px; padding: 0 17px 18px; color: var(--muted); }
.faq-answer > span { color: #9aa4b1; font-weight: 900; }
.faq-answer p { margin: 0; font-size: 14px; }
.location-section { padding-top: 28px; }
.location-card { display: grid; gap: 28px; padding: 28px; border-radius: var(--radius-lg); color: #fff; background: linear-gradient(135deg, var(--accent-strong), var(--accent)); box-shadow: 0 22px 50px color-mix(in srgb, var(--accent) 20%, transparent); }
.location-card > div > p:last-child { margin: 12px 0 0; color: rgba(255,255,255,.78); }
.location-card .section-kicker { color: rgba(255,255,255,.67) !important; }
.location-card dl { display: grid; gap: 13px; margin: 0; }
.location-card dl > div { display: grid; grid-template-columns: 24px 1fr; gap: 12px; padding: 16px; border: 1px solid rgba(255,255,255,.14); border-radius: 14px; background: rgba(255,255,255,.09); }
.location-card dt { color: rgba(255,255,255,.7); font-size: 11px; }
.location-card dd { margin: 2px 0 0; font-size: 14px; font-weight: 700; }
.location-card dd a { display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; text-decoration: underline; text-underline-offset: 3px; }
.contact-section { padding-bottom: 92px; }
.contact-grid { display: grid; gap: 34px; }
.contact-copy h2 { margin-top: 0; }
.contact-copy > p:not(.section-kicker) { margin: 18px 0 0; color: var(--muted); }
.direct-contact { display: grid; gap: 10px; margin-top: 28px; }
.direct-contact a { min-height: 64px; display: flex; align-items: center; gap: 13px; padding: 13px 16px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.direct-contact a > svg { color: var(--accent); }
.direct-contact span { display: grid; line-height: 1.35; }
.direct-contact small { color: var(--muted); font-size: 11px; }
.direct-contact strong { margin-top: 2px; font-size: 15px; }
.contact-form { position: relative; display: grid; gap: 16px; padding: 22px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; box-shadow: var(--shadow-sm); }
.form-row { display: grid; gap: 16px; }
.contact-form > label, .form-row label { display: grid; gap: 7px; color: #313d4d; font-size: 13px; font-weight: 800; }
.contact-form label > span[aria-hidden] { color: var(--danger); }
.contact-form input:not([type="checkbox"]), .contact-form textarea { width: 100%; min-height: 50px; padding: 12px 14px; border: 1px solid #cfd7e1; border-radius: 11px; color: var(--ink); background: #fff; font-size: 16px; font-weight: 500; outline: none; }
.contact-form textarea { resize: vertical; min-height: 116px; }
.contact-form input::placeholder, .contact-form textarea::placeholder { color: #9aa5b2; }
.contact-form input:focus, .contact-form textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 11%, transparent); }
.contact-form .consent { display: grid; grid-template-columns: 20px 1fr; align-items: flex-start; gap: 9px; font-weight: 500; line-height: 1.55; }
.consent input { width: 18px; height: 18px; margin: 2px 0 0; accent-color: var(--accent); }
.consent a { color: var(--accent-strong); font-weight: 800; text-decoration: underline; text-underline-offset: 2px; }
.form-status { min-height: 23px; margin: -4px 0 0; color: var(--muted); font-size: 12px; text-align: center; }
.form-status.is-error { color: var(--danger); }
.form-status.is-success { color: var(--success); font-weight: 700; }
.customization-band { color: #fff; background: #0d1727; }
.customization-band .container { display: grid; gap: 14px; padding-block: 22px; }
.customization-band div > div { display: grid; gap: 5px; }
.customization-band span { width: fit-content; padding: 3px 7px; border-radius: 5px; color: #0d1727; background: #d8bb7b; font-size: 9px; font-weight: 900; letter-spacing: .12em; }
.customization-band strong { font-size: 14px; }
.customization-band a { display: inline-flex; align-items: center; gap: 6px; color: #bcd8f5; font-size: 13px; font-weight: 800; }
.site-footer { padding: 40px 0 100px; color: #9ca8b7; background: #111b2a; }
.footer-main { display: grid; gap: 22px; padding-bottom: 26px; border-bottom: 1px solid rgba(255,255,255,.1); }
.footer-brand { display: grid; gap: 4px; }
.footer-brand strong { color: #fff; font-size: 19px; }
.footer-brand span { font-size: 12px; }
.footer-links { display: flex; flex-wrap: wrap; gap: 16px; color: #d7dde6; font-size: 12px; font-weight: 700; }
.footer-legal { padding-top: 22px; }
.footer-legal p { margin: 0 0 10px; font-size: 11px; line-height: 1.75; }
.mobile-cta { position: fixed; left: 0; right: 0; bottom: 0; z-index: 90; display: grid; grid-template-columns: .78fr 1.22fr; gap: 8px; padding: 8px max(10px, env(safe-area-inset-left)) calc(8px + env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-right)); border-top: 1px solid var(--line); background: rgba(255,255,255,.96); box-shadow: 0 -10px 30px rgba(18,31,48,.1); backdrop-filter: blur(14px); }
.mobile-cta a { min-height: 48px; display: flex; align-items: center; justify-content: center; gap: 7px; border: 1px solid var(--line); border-radius: 12px; font-size: 14px; font-weight: 900; }
.mobile-cta .mobile-cta-primary { color: #fff; border-color: var(--accent); background: var(--accent); }
.demo-switcher { position: fixed; right: 12px; bottom: 76px; z-index: 95; display: flex; align-items: flex-end; gap: 5px; padding: 9px; border: 1px solid var(--line); border-radius: 14px; background: rgba(255,255,255,.96); box-shadow: var(--shadow-lg); backdrop-filter: blur(12px); }
.demo-switcher label { display: grid; gap: 3px; }
.demo-switcher label span { padding-left: 3px; color: var(--muted); font-size: 9px; font-weight: 900; letter-spacing: .08em; }
.demo-switcher select { min-height: 38px; padding: 0 30px 0 10px; border: 1px solid var(--line); border-radius: 9px; color: var(--ink); background: #fff; font-size: 12px; font-weight: 800; }
.demo-switcher button { width: 36px; height: 36px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 9px; color: var(--muted); background: var(--surface-muted); }

.template-page, .privacy-page, .not-found-page { min-height: 100vh; padding: 56px 0 100px; background: var(--surface-muted); }
.simple-header { margin-bottom: 30px; }
.simple-header a { display: inline-flex; align-items: center; gap: 6px; color: var(--accent-strong); font-weight: 800; }
.simple-header h1 { margin: 28px 0 10px; font-family: var(--font-heading); font-size: clamp(34px, 8vw, 56px); line-height: 1.15; letter-spacing: -.05em; }
.simple-header p { max-width: 720px; margin: 0; color: var(--muted); }
.template-gallery { display: grid; gap: 16px; }
.template-tile { display: grid; gap: 18px; padding: 22px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; }
.template-swatch { height: 150px; overflow: hidden; border-radius: 14px; position: relative; }
.template-swatch::after { content: ""; position: absolute; width: 40%; height: 120%; right: 8%; top: 10%; border-radius: 50% 50% 12px 12px; background: rgba(255,255,255,.7); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
.template-swatch.trust-blue { background: linear-gradient(135deg,#f7fbff,#dceafa); }
.template-swatch.warm-care { background: linear-gradient(135deg,#fffaf2,#eadbc0); }
.template-swatch.premium-navy { background: linear-gradient(135deg,#0e1a2e,#243c5f); }
.template-swatch.clean-minimal { border: 1px solid #ddd; background: linear-gradient(90deg,#fff 0 58%,#ededeb 58%); }
.template-swatch.local-friendly { background: linear-gradient(135deg,#dff8f1,#fff5ef); }
.template-tile h2 { margin: 0; font-size: 21px; }
.template-tile p { margin: 5px 0 0; color: var(--muted); font-size: 14px; }
.template-tile a { display: inline-flex; align-items: center; gap: 6px; color: var(--accent); font-size: 13px; font-weight: 900; }
.policy-card { max-width: 850px; padding: 26px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; }
.policy-card h2 { margin: 30px 0 8px; font-size: 20px; }
.policy-card h2:first-child { margin-top: 0; }
.policy-card p, .policy-card li { color: #465366; font-size: 14px; }
.policy-card ul { padding-left: 20px; }

.reveal { animation: fade-up .5s ease both; }
@keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }

@media (min-width: 520px) {
  .hero-actions { display: flex; flex-wrap: wrap; }
  .button { min-width: 170px; }
  .form-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .template-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .container { width: min(calc(100% - 64px), var(--container)); }
  .site-header { height: 76px; }
  .nav-toggle { display: none; }
  .main-nav { position: static; display: flex; align-items: center; gap: 2px; padding: 0; border: 0; background: transparent; box-shadow: none; transform: none; visibility: visible; opacity: 1; }
  .main-nav a { min-height: 42px; padding: 0 11px; font-size: 13px; }
  .main-nav .nav-cta { margin: 0 0 0 8px; padding-inline: 17px; }
  .hero { min-height: 690px; display: grid; align-items: center; padding: 72px 0 82px; }
  .hero-grid { grid-template-columns: minmax(0, 1.18fr) minmax(330px, .82fr); gap: clamp(45px, 7vw, 92px); }
  .hero-copy { padding-block: 20px; }
  .hero h1 { font-size: clamp(48px, 5.2vw, 68px); }
  .hero-lead { font-size: 18px; }
  .profile-card { width: 100%; }
  .section { padding: 108px 0; }
  .intro-grid { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 9%; align-items: start; }
  .section-heading { margin-bottom: 48px; }
  .specialty-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .process-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
  .process-item { grid-template-columns: 1fr; padding: 0; }
  .process-item:not(:last-child)::before { left: 48px; right: -18px; top: 23px; bottom: auto; width: auto; height: 1px; }
  .process-item > span { position: relative; z-index: 1; }
  .process-item h3 { margin-top: 18px; }
  .career-grid { grid-template-columns: .85fr 1.15fr; gap: 9%; align-items: center; }
  .faq-grid { grid-template-columns: .75fr 1.25fr; gap: 9%; align-items: start; }
  .location-card { grid-template-columns: .95fr 1.05fr; align-items: center; padding: 44px; }
  .contact-grid { grid-template-columns: .85fr 1.15fr; gap: 9%; align-items: start; }
  .contact-form { padding: 30px; }
  .customization-band .container { grid-template-columns: 1fr auto; align-items: center; }
  .footer-main { grid-template-columns: 1fr auto; align-items: center; }
  .mobile-cta { display: none; }
  .site-footer { padding-bottom: 45px; }
  .demo-switcher { right: 20px; bottom: 20px; }
  .template-gallery { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 1080px) {
  .main-nav a { padding-inline: 15px; }
  .specialty-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .template-gallery { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}

@media (max-width: 374px) {
  .container { width: min(calc(100% - 28px), var(--container)); }
  .hero { padding-top: 40px; }
  .hero h1 { font-size: 33px; }
  .hero-lead { font-size: 16px; }
  .profile-info { padding: 18px; }
  .section { padding: 64px 0; }
  .contact-form { padding: 18px; }
  .demo-switcher { left: 10px; right: 10px; justify-content: space-between; }
  .demo-switcher label { flex: 1; }
  .demo-switcher select { width: 100%; }
}
`;

# Design QA — 20260922-kimdaekyung

## Reference and implementation

- Hero reference: `C:\Users\pjmsm\AppData\Local\Temp\codex-clipboard-5799d2a4-e28a-4146-ba76-ff88fbdd4890.png` (1670 × 1009)
- About reference: `C:\Users\pjmsm\AppData\Local\Temp\codex-clipboard-a102d4d1-61de-40ba-a03c-308a4da99cbc.png` (1658 × 885)
- Hero implementation: `outputs/design-qa-20260922-kimdaekyung/implementation-hero-1670x1009-fix.png` (captured CSS viewport 1670 × 1009; screenshot output 1655 × 1000)
- Final deployed evidence: `outputs/design-qa-20260922-kimdaekyung/implementation-hero-1280x720-final.png` (CSS viewport 1280 × 720; screenshot output 1265 × 712)
- About implementation: `outputs/design-qa-20260922-kimdaekyung/implementation-about-1440x1009.png` (1440 × 1009)
- Side-by-side evidence: `outputs/design-qa-20260922-kimdaekyung/comparison-hero-fix.png`, `outputs/design-qa-20260922-kimdaekyung/comparison-hero-badge-fix.png`, `outputs/design-qa-20260922-kimdaekyung/comparison-about.png`
- Current visual-review references: `C:\Users\pjmsm\AppData\Local\Temp\codex-clipboard-d927fefe-6d17-408d-b77c-2b92ac76fd4f.png`, `C:\Users\pjmsm\AppData\Local\Temp\codex-clipboard-72977f27-744b-4cb2-a446-c352d10da252.png`
- Current-run 김경현 comparison capture: `outputs/watermark-audit-20260922/01-kimgyeonghyeon-before.png`
- Current local implementation: `outputs/watermark-audit-20260922/07-kimdaekyung-wide-watermark-photo-local.png` (CSS viewport 1280 × 720; screenshot output 1265 × 712; DPR 1.75)
- Current deployed implementation: `outputs/watermark-audit-20260922/08-kimdaekyung-wide-watermark-photo-deployed.png` (Cloudflare version `797a17c6-b381-41a7-926f-44fa18f612b6`)
- Responsive viewports checked: 320 × 900, 360 × 900, 390 × 900, 768 × 900, 1440 × 1009

## Comparison result

- The stacked HAEON logo is visible at the top-left and enlarged to remain legible beside the adviser identity.
- The forest-green identity panel, adviser portrait, warm brand watermark, heading hierarchy, direct-contact buttons, and compact topic chips preserve the supplied visual direction.
- The blue `명장 우수인증설계사` badge is a fully opaque foreground asset. It is positioned independently beside the contact actions and no longer inherits the gold watermark treatment or increases the desktop hero height. Final deployed geometry reported zero overlap with every topic chip, contact action, and disclosure note.
- The desktop hero grid, copy rhythm, and adviser card were checked against the live 김경현 template at `https://김경현.kr`; both resolve to the same 1120px content container at the inspected desktop CSS viewport.
- For the 김대경 variant, the 24px column gap and viewport-bounded watermark layer make the gold panel begin directly beside the portrait and continue to the browser's right edge. The copy begins 64px inside that layer, matching the reference's visible inner-left breathing room.
- The gold circular mark and the complete `HAEON / YOU FIRST` wordmark are visible together. At the 1280px audit viewport the layer spans 912px without creating horizontal overflow.
- The main portrait is cropped at 108% scale with its focal point held at 50% 35%, reducing the visible white studio background while preserving the face, hands, and suit.
- The adviser introduction keeps the portrait dominant while reducing copy size and spacing.
- `1:1`, `정직`, `동행`, and `경력` are arranged as a 2 × 2 grid at desktop and mobile widths; the career value reads `2018년 1월 ~ 현재`.
- Long Korean copy remained visible at every required breakpoint, the profile image retained alternative text, and the floating contact controls did not cover the inspected content.
- The FAQ disclosure opened successfully and the browser console reported no warnings or errors.

## Iteration history

1. Added the completed-folder profile data, portrait, HAEON brand assets, forest palette, and career content.
2. Reduced adviser-introduction typography and spacing, then placed career beside the three service principles.
3. Responded to visual review by enlarging the top-left logo and changing the principle/career area from one four-column row to two columns across two rows.
4. Added the supplied blue `명장 우수인증설계사` badge from `D:\보험페이지 제작\1. 진행전\소스` to the hero's right-hand area.
5. Visual review exposed two regressions: the badge was placed in normal flow, which stretched the hero, and it appeared visually mixed with the watermark layer.
6. Moved the badge row to an absolute desktop foreground layer (`z-index: 3`, `bottom: 24px`), restored full opacity with no filter or blend mode, and reduced it to 120px so it remains separate from the topic chips, three contact actions, and disclosure note.
7. Re-ran source validation, type checking, automated tests, breakpoint checks, interaction checks, and full/focused side-by-side visual comparison. The supplied reference was density-normalized from 1669 × 1009 to the 1655 × 1000 screenshot output only for the full comparison montage; no layout dimensions were inferred from that scaling.
8. Rechecked the live 김경현 hero at the same 1280 × 720 CSS viewport. The earlier 김대경 adjustment widened only the grid track, so it did not create the visible full-bleed watermark section or the requested inner-left padding.
9. Expanded the 김대경 watermark layer from the portrait edge to the viewport edge, added a 64px content inset, retained the full `HAEON / YOU FIRST` mark, and enlarged the portrait by 8% to reduce unused white background.
10. Kept the blue certification badge as a separate foreground image and tightened medium-desktop contact-button spacing so the badge has zero overlap with chips, actions, the disclosure note, and floating controls.
11. `npm run check` passed all 224 checks and `npm run test:e2e` passed all 29 browser scenarios, including the required five widths and 200% text enlargement.
12. Re-opened the Cloudflare deployment with a cache-busting query. Computed production values matched local: 64px copy inset, 108% portrait crop, full visible watermark layer, zero badge overlap, and no horizontal overflow.

## Final result

passed

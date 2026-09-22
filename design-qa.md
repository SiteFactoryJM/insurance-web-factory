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
- Current local hero implementation: `outputs/watermark-audit-20260922/12-kimdaekyung-badge-photo-local.png`
- Current local about implementation: `outputs/watermark-audit-20260922/09-kimdaekyung-about-values-left-local.png`
- Current deployed implementation: `outputs/watermark-audit-20260922/13-kimdaekyung-badge-photo-deployed.png` (Cloudflare version `7c73bf7b-abe1-453b-898e-2b70a7fccbd0`)
- Responsive viewports checked: 320 × 900, 360 × 900, 390 × 900, 768 × 900, 1440 × 1009

## Comparison result

- The stacked HAEON logo is visible at the top-left and enlarged to remain legible beside the adviser identity.
- The forest-green identity panel, adviser portrait, warm brand watermark, heading hierarchy, direct-contact buttons, and compact topic chips preserve the supplied visual direction.
- The blue `명장 우수인증설계사` mark is a fully opaque 96px foreground badge in a white card, anchored 16px from the portrait's top-left corner. It now moves only with the portrait and cannot collide with the topic chips, contact actions, disclosure note, or gold watermark.
- The desktop hero grid, copy rhythm, and adviser card were checked against the live 김경현 template at `https://김경현.kr`; both resolve to the same 1120px content container at the inspected desktop CSS viewport.
- For the 김대경 variant, the 24px column gap and clipped hero-copy panel keep the gold treatment inside the main content area. The copy begins 64px inside that panel, matching the reference's visible inner-left breathing room without overlapping the adviser card.
- The gold watermark now uses the live 김경현 site rules without a 김대경-specific scale or focal-point override. Direct production comparison returned identical values for both sites: `background-position: 50% 40%`, `background-size: cover`, `opacity: 0.82`, and the same radial mask.
- The main portrait is cropped at 108% scale with its focal point held at 50% 35%, reducing the visible white studio background while preserving the face, hands, and suit.
- The adviser introduction keeps the portrait dominant while reducing copy size and spacing.
- `1:1`, `정직`, `동행`, and `경력` are arranged as a 2 × 2 grid at desktop and mobile widths; the desktop group is pulled 40px left and the career value reads `2018년 1월 ~ 현재`.
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
9. Enlarged the portrait by 8% to reduce unused white background, then bounded the 김대경 watermark layer to the hero-copy panel so it no longer extends into the adviser card or beyond the content container.
10. Kept the blue certification badge as a separate foreground image and tightened medium-desktop contact-button spacing so the badge has zero overlap with chips, actions, the disclosure note, and floating controls.
11. `npm run check` passed all 224 checks and `npm run test:e2e` passed all 29 browser scenarios, including the required five widths and 200% text enlargement.
12. Aligned the watermark panel's top edge to the portrait (`y = 145px`), positioned the background from the panel top, retained the 64px copy inset and complete `HAEON / YOU FIRST` mark, and pulled the four adviser values 40px left.
13. Re-opened Cloudflare version `0bfeacd7-9876-4826-9554-841074fd819b` with a cache-busting query. Production geometry matched local: portrait and watermark top at `144.57px`, copy and watermark from `424.57px` through `1192.57px`, 108% portrait crop, 40px left-shifted adviser values, zero badge overlap, and no horizontal overflow.
14. Removed the unstable badge placement from the hero-copy/contact area and rendered the badge inside the portrait figure instead.
15. Fixed the badge at 96px in a white card, 16px from the portrait's top-left corner, where the studio background is clear and the subject's face remains unobstructed.
16. Removed the 김대경-specific watermark scale and position override. The deployed 김대경 watermark now matches the live 김경현 site across position, size, opacity, and mask values.
17. Re-ran `npm run check` (224/224) and `npm run test:e2e` (29/29), including the 1046px regression width, the five required responsive widths, and 200% text enlargement.
18. Verified Cloudflare version `7c73bf7b-abe1-453b-898e-2b70a7fccbd0`: badge width 96px, portrait inset 16px × 16px, no horizontal overflow, and exact 김경현 watermark-style parity.

## Final result

passed

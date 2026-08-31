import type { SiteConfig } from "../../types.js";
import { escapeHtml } from "../../utils/html.js";
import { icon } from "../../utils/icons.js";

export function renderTrustBlueHero(site: SiteConfig, actions: string, profile: string): string {
  return `<section class="hero hero-trust-blue" id="home">
    <div class="container hero-grid">
      <div class="hero-copy reveal">
        ${site.hero.eyebrow ? `<p class="eyebrow">${icon("shield", 18)}${escapeHtml(site.hero.eyebrow)}</p>` : ""}
        <h1>${escapeHtml(site.hero.headline)}</h1>
        <p class="hero-lead">${escapeHtml(site.hero.subheadline)}</p>
        ${actions}
        ${site.hero.trustNote ? `<p class="trust-note">${icon("check", 18)}${escapeHtml(site.hero.trustNote)}</p>` : ""}
      </div>
      ${profile}
    </div>
  </section>`;
}

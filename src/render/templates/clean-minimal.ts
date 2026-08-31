import type { SiteConfig } from "../../types.js";
import { escapeHtml } from "../../utils/html.js";
import { icon } from "../../utils/icons.js";

export function renderCleanMinimalHero(site: SiteConfig, actions: string, profile: string): string {
  return `<section class="hero hero-clean-minimal" id="home">
    <div class="container hero-grid">
      <div class="hero-copy reveal">
        <span class="minimal-index">01 / PERSONAL ADVISER</span>
        ${site.hero.eyebrow ? `<p class="eyebrow">${icon("spark", 18)}${escapeHtml(site.hero.eyebrow)}</p>` : ""}
        <h1>${escapeHtml(site.hero.headline)}</h1>
        <p class="hero-lead">${escapeHtml(site.hero.subheadline)}</p>
        ${actions}
        ${site.hero.trustNote ? `<p class="trust-note">${icon("check", 18)}${escapeHtml(site.hero.trustNote)}</p>` : ""}
      </div>
      ${profile}
    </div>
  </section>`;
}

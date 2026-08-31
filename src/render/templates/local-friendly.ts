import type { SiteConfig } from "../../types.js";
import { escapeHtml } from "../../utils/html.js";
import { icon } from "../../utils/icons.js";

export function renderLocalFriendlyHero(site: SiteConfig, actions: string, profile: string): string {
  const region = site.agent.regions[0] ?? "우리 지역";
  return `<section class="hero hero-local-friendly" id="home">
    <div class="container hero-grid">
      <div class="hero-copy reveal">
        <div class="local-badge">${icon("map", 18)}${escapeHtml(region)}에서 가까이</div>
        ${site.hero.eyebrow ? `<p class="eyebrow">${escapeHtml(site.hero.eyebrow)}</p>` : ""}
        <h1>${escapeHtml(site.hero.headline)}</h1>
        <p class="hero-lead">${escapeHtml(site.hero.subheadline)}</p>
        ${actions}
        ${site.hero.trustNote ? `<p class="trust-note">${icon("check", 18)}${escapeHtml(site.hero.trustNote)}</p>` : ""}
      </div>
      ${profile}
    </div>
  </section>`;
}

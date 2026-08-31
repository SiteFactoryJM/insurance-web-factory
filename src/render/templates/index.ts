import type { SiteConfig } from "../../types.js";
import { renderCleanMinimalHero } from "./clean-minimal.js";
import { renderLocalFriendlyHero } from "./local-friendly.js";
import { renderPremiumNavyHero } from "./premium-navy.js";
import { renderTrustBlueHero } from "./trust-blue.js";
import { renderWarmCareHero } from "./warm-care.js";

export function renderHero(site: SiteConfig, actions: string, profile: string): string {
  switch (site.template) {
    case "warm-care": return renderWarmCareHero(site, actions, profile);
    case "premium-navy": return renderPremiumNavyHero(site, actions, profile);
    case "clean-minimal": return renderCleanMinimalHero(site, actions, profile);
    case "local-friendly": return renderLocalFriendlyHero(site, actions, profile);
    default: return renderTrustBlueHero(site, actions, profile);
  }
}

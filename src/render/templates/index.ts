import type { SiteConfig } from "../../types.js";
import { renderCleanMinimalPage } from "./clean-minimal.js";
import { renderLocalFriendlyPage } from "./local-friendly.js";
import { renderPremiumNavyPage } from "./premium-navy.js";
import { renderTrustBluePage } from "./trust-blue.js";
import { renderWarmCarePage } from "./warm-care.js";
export function renderThemePage(site: SiteConfig): string {
  switch (site.template) {
    case "warm-care": return renderWarmCarePage(site);
    case "premium-navy": return renderPremiumNavyPage(site);
    case "clean-minimal": return renderCleanMinimalPage(site);
    case "local-friendly": return renderLocalFriendlyPage(site);
    default: return renderTrustBluePage(site);
  }
}

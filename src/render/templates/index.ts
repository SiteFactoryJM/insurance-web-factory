import type { SiteConfig } from "../../types.js";
import { renderCalmPage } from "../calm-page.js";
export function renderThemePage(site: SiteConfig): string { return renderCalmPage(site); }

import { domainIndex, siteConfigs } from "./generated/sites.generated.js";
import type { SiteConfig } from "./types.js";

const PREVIEW_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function cleanHost(host: string): string {
  return host.toLowerCase().split(":")[0].replace(/^www\./, "");
}

function isPreviewHost(host: string): boolean {
  return PREVIEW_HOSTS.has(host) || host.endsWith(".workers.dev") || host.endsWith(".pages.dev");
}

export function resolveSite(request: Request, demoSiteId = "demo-agent"): SiteConfig | undefined {
  const url = new URL(request.url);
  const host = cleanHost(url.hostname);
  const requested = url.searchParams.get("site");

  if (isPreviewHost(host)) {
    const previewId = requested && siteConfigs[requested] ? requested : demoSiteId;
    return siteConfigs[previewId] ?? Object.values(siteConfigs)[0];
  }

  const siteId = domainIndex[host];
  return siteId ? siteConfigs[siteId] : undefined;
}

export function getPublishedSites(): SiteConfig[] {
  return Object.values(siteConfigs).filter((site) => site.status === "published");
}

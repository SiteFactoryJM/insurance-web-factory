import { appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadProductionSites, normalizeHost } from "./production-sites.mjs";

export function renderProductionSiteList(productionSites) {
  const lines = ["Production sites"];
  for (const site of productionSites) {
    lines.push(`- ${site.id}`);
    for (const domain of site.domains ?? []) lines.push(`  - ${normalizeHost(domain)}`);
  }
  return lines.join("\n");
}

export function renderProductionSiteSummary(productionSites) {
  const domains = productionSites.flatMap((site) => site.domains ?? []);
  return [
    "### Production targets",
    "",
    `Sites: ${productionSites.length}`,
    `Domains: ${domains.length}`,
    "",
    ...productionSites.flatMap((site) => [
      `- \`${site.id}\``,
      ...(site.domains ?? []).map((domain) => `  - \`${normalizeHost(domain)}\``),
    ]),
    "",
  ].join("\n");
}

async function main() {
  const { productionSites } = await loadProductionSites();
  console.log(renderProductionSiteList(productionSites));
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, renderProductionSiteSummary(productionSites));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

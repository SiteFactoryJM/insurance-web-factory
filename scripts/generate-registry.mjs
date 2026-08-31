import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = path.join(root, "sites");
const outputPath = path.join(root, "src", "generated", "sites.generated.ts");

const normalizeDomain = (value) => String(value ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");

const entries = await readdir(sitesDir, { withFileTypes: true });
const sites = [];
for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const configPath = path.join(sitesDir, entry.name, "site.json");
  try {
    const site = JSON.parse(await readFile(configPath, "utf8"));
    sites.push(site);
  } catch (error) {
    throw new Error(`사이트 설정을 읽지 못했습니다: ${path.relative(root, configPath)}\n${error instanceof Error ? error.message : error}`);
  }
}

sites.sort((a, b) => String(a.id).localeCompare(String(b.id)));
const siteConfigs = Object.fromEntries(sites.map((site) => [site.id, site]));
const domainIndex = {};
for (const site of sites) {
  if (site.status !== "published") continue;
  for (const domain of site.domains ?? []) {
    const normalized = normalizeDomain(domain);
    if (!normalized) continue;
    if (domainIndex[normalized] && domainIndex[normalized] !== site.id) {
      throw new Error(`도메인 중복: ${normalized} (${domainIndex[normalized]}, ${site.id})`);
    }
    domainIndex[normalized] = site.id;
  }
}

const content = `/* This file is generated. Do not edit directly. */\nimport type { SiteConfig } from "../types.js";\n\nexport const siteConfigs = ${JSON.stringify(siteConfigs, null, 2)} as unknown as Record<string, SiteConfig>;\n\nexport const domainIndex = ${JSON.stringify(domainIndex, null, 2)} as Record<string, string>;\n`;
await writeFile(outputPath, content, "utf8");
console.log(`Generated ${path.relative(root, outputPath)}: ${sites.length} site(s), ${Object.keys(domainIndex).length} domain(s)`);

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectProductionDomains, loadSites, normalizeHost, repositoryRoot } from "./production-sites.mjs";

export function validateProductionConfig(config, sites) {
  assert.equal(config?.name, "insurance-web-factory", "Production Worker name must be insurance-web-factory");
  assert.notEqual(config?.name, "insurance-web-factory-demo", "Production config must not target the demo Worker");
  assert.equal(config?.workers_dev, false, "Production workers_dev must be false");
  assert.ok(Array.isArray(config?.routes), "Production routes must be an array");

  const { productionSites, routes } = collectProductionDomains(sites);
  const expected = routes.map(({ host }) => host).sort();
  const actual = config.routes.map((route) => {
    assert.equal(route?.custom_domain, true, `Route must be a custom domain: ${JSON.stringify(route)}`);
    return normalizeHost(route?.pattern);
  }).sort();

  assert.ok(productionSites.length > 0, "At least one production site is required");
  assert.ok(actual.length > 0, "At least one production domain is required");
  assert.deepEqual(actual, expected, "Generated production routes do not exactly match published non-demo sites");
  assert.equal(new Set(actual).size, actual.length, "Generated production routes contain duplicates");
  return { sites: productionSites.length, domains: actual.length };
}

function parseGeneratedConfig(text) {
  return JSON.parse(text.replace(/^\s*\/\/[^\n]*\n/, ""));
}

async function main() {
  const [sites, raw] = await Promise.all([
    loadSites(repositoryRoot),
    readFile(path.join(repositoryRoot, "wrangler.domains.jsonc"), "utf8"),
  ]);
  const result = validateProductionConfig(parseGeneratedConfig(raw), sites);
  console.log(`Production config validated: ${result.sites} site(s), ${result.domains} domain(s), workers_dev=false`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

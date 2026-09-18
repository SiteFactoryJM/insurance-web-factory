import assert from "node:assert/strict";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadProductionSites, normalizeHost } from "./production-sites.mjs";

const EXPECTED = [
  ["/", 200],
  ["/health", 200],
  ["/privacy", 200],
  ["/robots.txt", 200],
  ["/sitemap.xml", 200],
  ["/studio", 404],
  ["/proposal", 404],
  ["/templates", 404],
  ["/api/consultations", 410],
];

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

async function request(url, expectedStatus, fetchImpl) {
  const response = await fetchImpl(url, {
    method: "GET",
    headers: { "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, expectedStatus, `${new URL(url).pathname}: expected HTTP ${expectedStatus}, got ${response.status}`);
  return response;
}

export async function verifyDomain(site, domain, { fetchImpl = fetch } = {}) {
  const host = normalizeHost(domain);
  const origin = `https://${host}`;
  let homeHtml = "";
  for (const [pathname, status] of EXPECTED) {
    const url = new URL(pathname, origin);
    url.searchParams.set("verify", process.env.GITHUB_SHA?.slice(0, 12) || "local");
    const response = await request(url, status, fetchImpl);
    if (pathname === "/") homeHtml = await response.text();
  }
  const marker = String(site.agent?.name ?? "").trim();
  assert.ok(marker, `[${site.id}] agent.name is required for production identity verification`);
  assert.ok(homeHtml.includes(marker) || homeHtml.includes(escapeHtml(marker)), `[${site.id}] ${host}: homepage did not contain the expected public adviser name`);
  return { siteId: site.id, host };
}

export async function verifyProductionSites(productionSites, {
  fetchImpl = fetch,
  attempts = Number(process.env.PRODUCTION_VERIFY_ATTEMPTS || 10),
  delayMs = Number(process.env.PRODUCTION_VERIFY_DELAY_MS || 15_000),
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) {
  const results = [];
  for (const site of productionSites) {
    for (const domain of site.domains ?? []) {
      let lastError;
      for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
          results.push(await verifyDomain(site, domain, { fetchImpl }));
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          console.log(`Production verification waiting (${site.id} / ${normalizeHost(domain)} / ${attempt}/${attempts}): ${error instanceof Error ? error.message : error}`);
          if (attempt < attempts) await sleepImpl(delayMs);
        }
      }
      if (lastError) throw lastError;
    }
  }
  return results;
}

async function main() {
  const { productionSites } = await loadProductionSites();
  const results = await verifyProductionSites(productionSites);
  const lines = ["### Production verification", "", `Verified domains: ${results.length}`, "", ...results.map((item) => `- ✅ \`${item.host}\` → \`${item.siteId}\``), ""];
  const summary = lines.join("\n");
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

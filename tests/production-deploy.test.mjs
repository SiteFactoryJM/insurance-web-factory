import test from "node:test";
import assert from "node:assert/strict";
import { buildProductionWranglerConfig } from "../scripts/generate-wrangler-domains.mjs";
import { collectProductionDomains, normalizeHost, selectProductionSites } from "../scripts/production-sites.mjs";
import { validateProductionConfig } from "../scripts/validate-production-config.mjs";
import { verifyDomain } from "../scripts/verify-production.mjs";

const site = (id, overrides = {}) => ({
  id,
  status: "published",
  domains: [`${id}.example.com`],
  demo: { enabled: false },
  agent: { name: `${id}-name` },
  ...overrides,
});

test("production selection excludes draft and demo sites", () => {
  const sites = [site("live"), site("draft", { status: "draft" }), site("demo", { demo: { enabled: true } })];
  assert.deepEqual(selectProductionSites(sites).map((item) => item.id), ["live"]);
});

test("production config keeps both root and www custom domains and disables workers.dev", () => {
  const sites = [site("agent-kim", { domains: ["kiminsurance.kr", "www.kiminsurance.kr"] })];
  const config = buildProductionWranglerConfig(sites);
  assert.equal(config.name, "insurance-web-factory");
  assert.equal(config.workers_dev, false);
  assert.deepEqual(config.routes, [
    { pattern: "kiminsurance.kr", custom_domain: true },
    { pattern: "www.kiminsurance.kr", custom_domain: true },
  ]);
  assert.deepEqual(validateProductionConfig(config, sites), { sites: 1, domains: 2 });
});


test("IDN production domains are normalized to ASCII hostnames", () => {
  assert.equal(normalizeHost("박종민.kr"), "xn--lg3bvb647c.kr");
});

test("production domain family cannot be split across different customers", () => {
  assert.throws(() => collectProductionDomains([
    site("agent-a", { domains: ["example.com"] }),
    site("agent-b", { domains: ["www.example.com"] }),
  ]), /host family conflict/i);
});

test("production config must exactly match published non-demo routes", () => {
  const sites = [site("live")];
  const config = buildProductionWranglerConfig(sites);
  config.routes.push({ pattern: "draft.example.com", custom_domain: true });
  assert.throws(() => validateProductionConfig(config, sites), /do not exactly match/i);
});

test("production verifier checks public routes, private demo routes and retired API", async () => {
  const calls = [];
  const statuses = new Map([
    ["/", 200], ["/health", 200], ["/privacy", 200], ["/robots.txt", 200], ["/sitemap.xml", 200],
    ["/studio", 404], ["/proposal", 404], ["/templates", 404], ["/api/consultations", 410],
  ]);
  const current = site("agent-kim", { domains: ["kiminsurance.kr"], agent: { name: "김설계" } });
  const fetchImpl = async (url) => {
    const pathname = new URL(url).pathname;
    calls.push(pathname);
    const status = statuses.get(pathname) ?? 500;
    return new Response(pathname === "/" ? "<html>김설계</html>" : "ok", { status });
  };
  const result = await verifyDomain(current, "kiminsurance.kr", { fetchImpl });
  assert.deepEqual(result, { siteId: "agent-kim", host: "kiminsurance.kr" });
  assert.deepEqual(calls, [...statuses.keys()]);
});

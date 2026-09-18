import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function normalizeHost(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.port || url.username || url.password) return "";
    return url.hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return "";
  }
}

export function canonicalHost(value) {
  return normalizeHost(value).replace(/^www\./, "");
}

export function isProductionSite(site) {
  return site?.status === "published" && site?.demo?.enabled !== true;
}

export function selectProductionSites(sites) {
  return [...sites]
    .filter(isProductionSite)
    .map((site) => ({ ...site, domains: [...(site.domains ?? [])] }))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

export function collectProductionDomains(sites, { requireTargets = true } = {}) {
  const productionSites = selectProductionSites(sites);
  const exactOwners = new Map();
  const canonicalOwners = new Map();
  const routes = [];

  for (const site of productionSites) {
    const id = String(site.id ?? "").trim();
    const seenForSite = new Set();
    for (const rawDomain of site.domains ?? []) {
      const host = normalizeHost(rawDomain);
      if (!host || !host.includes(".") || /\s|:/.test(host)) {
        throw new Error(`[${id}] Invalid production domain: ${rawDomain}`);
      }
      if (seenForSite.has(host)) throw new Error(`[${id}] Duplicate production domain: ${host}`);
      seenForSite.add(host);

      const exactOwner = exactOwners.get(host);
      if (exactOwner && exactOwner !== id) {
        throw new Error(`Production domain conflict: ${host} (${exactOwner}, ${id})`);
      }
      exactOwners.set(host, id);

      const canonical = canonicalHost(host);
      const canonicalOwner = canonicalOwners.get(canonical);
      if (canonicalOwner && canonicalOwner !== id) {
        throw new Error(`Production host family conflict: ${canonical} (${canonicalOwner}, ${id})`);
      }
      canonicalOwners.set(canonical, id);
      routes.push({ host, siteId: id });
    }
  }

  if (requireTargets && (!productionSites.length || !routes.length)) {
    throw new Error("No published non-demo production site/domain is configured.");
  }
  return { productionSites, routes };
}

export async function loadSites(root = repositoryRoot) {
  const sitesDir = path.join(root, "sites");
  const entries = await readdir(sitesDir, { withFileTypes: true });
  const sites = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const file = path.join(sitesDir, entry.name, "site.json");
    const site = JSON.parse(await readFile(file, "utf8"));
    sites.push(site);
  }
  return sites;
}

export async function loadProductionSites(root = repositoryRoot, options) {
  return collectProductionDomains(await loadSites(root), options);
}

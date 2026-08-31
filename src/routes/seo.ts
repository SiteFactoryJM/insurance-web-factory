import type { SiteConfig } from "../types.js";

export function renderRobots(site: SiteConfig, origin: string): string {
  if (site.seo.noIndex || site.status !== "published") return "User-agent: *\nDisallow: /\n";
  return `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
}

export function renderSitemap(site: SiteConfig, origin: string): string {
  if (site.seo.noIndex || site.status !== "published") return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>";
  const lastmod = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>`;
}

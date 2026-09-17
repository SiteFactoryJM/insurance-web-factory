import { renderGuidedStudioPage } from './render/guided-studio-page.js';
import { renderProposalPage } from './render/proposal-page.js';
import { renderNotFoundPage, renderPrivacyPage, renderSitePage, renderTemplateGallery } from './render/page.js';
import { handleConsultation } from './routes/consultation.js';
import { renderRobots, renderSitemap } from './routes/seo.js';
import { resolveSite } from './site-resolver.js';
import type { Env } from './types.js';
const STATIC_PREFIXES = ['/assets/', '/sites/'];
const STATIC_FILES = new Set(['/favicon.ico', '/favicon.svg']);
function html(body: string, status = 200, cacheControl = 'public, max-age=0, must-revalidate'): Response {
  return new Response(body, {status,headers:{'content-type':'text/html; charset=utf-8','cache-control':cacheControl}});
}
function text(body: string, contentType: string, cacheControl = 'public, max-age=300'): Response {
  return new Response(body,{headers:{'content-type':contentType,'cache-control':cacheControl}});
}
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('x-content-type-options','nosniff'); headers.set('x-frame-options','DENY');
  headers.set('referrer-policy','strict-origin-when-cross-origin');
  headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');
  headers.set('cross-origin-opener-policy','same-origin');
  headers.set('content-security-policy',[
    "default-src 'self'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'",
    "img-src 'self' data: https:", "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
    "font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com", "script-src 'self' 'unsafe-inline'", "connect-src 'self'",
  ].join('; '));
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (STATIC_PREFIXES.some(prefix => url.pathname.startsWith(prefix)) || STATIC_FILES.has(url.pathname)) return env.ASSETS.fetch(request);
  if (url.pathname === '/health') return new Response(JSON.stringify({ok:true,service:'insurance-web-factory',time:new Date().toISOString()}),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
  const site = resolveSite(request,env.DEMO_SITE_ID ?? 'demo-agent');
  if (!site) return html(renderNotFoundPage(),404,'no-store');
  if (url.pathname === '/api/consultations') return handleConsultation(request,env,site);
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method Not Allowed',{status:405});
  const demoPage = (render: () => string) => site.demo?.enabled ? html(render(),200,'no-store') : html(renderNotFoundPage(),404,'no-store');
  switch (url.pathname) {
    case '/': return html(renderSitePage(site,request));
    case '/studio': return demoPage(() => renderGuidedStudioPage(site));
    case '/proposal': return demoPage(renderProposalPage);
    case '/templates': return demoPage(() => renderTemplateGallery(site,request));
    case '/privacy': return html(renderPrivacyPage(site,request));
    case '/robots.txt': return text(renderRobots(site,url.origin),'text/plain; charset=utf-8');
    case '/sitemap.xml': return text(renderSitemap(site,url.origin),'application/xml; charset=utf-8');
    default: return html(renderNotFoundPage(),404,'no-store');
  }
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try { return withSecurityHeaders(await handleRequest(request,env)); }
    catch(error) { console.error('Unhandled request error',error); return withSecurityHeaders(new Response('Internal Server Error',{status:500})); }
  },
};

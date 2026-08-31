import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../.preview-dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const port = Number(process.env.PORT ?? 8787);
const mime = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".css": "text/css", ".js": "text/javascript" };

const assets = {
  async fetch(request) {
    const url = new URL(request.url);
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const target = path.resolve(publicDir, relative);
    if (!target.startsWith(publicDir)) return new Response("Not found", { status: 404 });
    try {
      const info = await stat(target);
      if (!info.isFile()) throw new Error();
      return new Response(await readFile(target), { headers: { "content-type": mime[path.extname(target).toLowerCase()] ?? "application/octet-stream" } });
    } catch { return new Response("Not found", { status: 404 }); }
  },
};

const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(",") : value);
  const init = { method: req.method, headers };
  if (body && req.method !== "GET" && req.method !== "HEAD") { init.body = body; init.duplex = "half"; }
  const request = new Request(`http://127.0.0.1:${port}${req.url ?? "/"}`, init);
  const response = await worker.fetch(request, { ASSETS: assets, DEMO_SITE_ID: "demo-agent" });
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
});

server.listen(port, "127.0.0.1", () => console.log(`Local preview: http://127.0.0.1:${port}`));

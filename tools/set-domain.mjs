// Herramienta de desarrollo: cuando Momo's tenga dominio, ejecuta
//   node tools/set-domain.mjs https://momosbarbershop.es
// Rellena la URL canónica, las versiones por idioma (hreflang), og:url y
// og:image absolutos, genera sitemap.xml y añade el Sitemap a robots.txt.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(arg)) {
  console.error("Uso: node tools/set-domain.mjs https://tudominio.es");
  process.exit(1);
}
const base = arg + "/";
const file = path.join(ROOT, "index.html");
let h = fs.readFileSync(file, "utf8");

// quita lo que hubiera de una ejecución anterior
h = h.replace(/\n  <!-- dominio:inicio -->[\s\S]*?<!-- dominio:fin -->/, "");
const head = `
  <!-- dominio:inicio -->
  <link rel="canonical" href="${base}">
  <link rel="alternate" hreflang="es" href="${base}">
  <link rel="alternate" hreflang="en" href="${base}?lang=en">
  <link rel="alternate" hreflang="fr" href="${base}?lang=fr">
  <link rel="alternate" hreflang="ca" href="${base}?lang=ca">
  <link rel="alternate" hreflang="x-default" href="${base}">
  <meta property="og:url" content="${base}">
  <!-- dominio:fin -->`;
h = h.replace(/  <!-- DOMINIO: se rellena[^\n]*-->/, (m) => m + head);
h = h.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${base}assets/img/og-momos.jpg">`);
h = h.replace(/"image": "[^"]*local-sala\.webp"/, `"image": "${base}assets/img/local-sala.webp"`);
h = h.replace(/"logo": "[^"]*logo-momos-512\.png"/, `"logo": "${base}assets/img/logo-momos-512.png"`);
if (!/"url": "https?:/.test(h)) h = h.replace(`"name": "MOMO'S BARBERSHOP",`, `"name": "MOMO'S BARBERSHOP",\n    "url": "${base}",`);
fs.writeFileSync(file, h);

const today = new Date().toISOString().slice(0, 10);
const alt = ["es", "en", "fr", "ca"].map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${l === "es" ? base : base + "?lang=" + l}"/>`).join("\n");
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${base}</loc>
    <lastmod>${today}</lastmod>
${alt}
  </url>
</urlset>
`);
let robots = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8").replace(/\nSitemap:.*\n?/g, "\n").trimEnd();
fs.writeFileSync(path.join(ROOT, "robots.txt"), robots + `\nSitemap: ${base}sitemap.xml\n`);
console.log("Dominio aplicado:", base);

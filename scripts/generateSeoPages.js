import fs from "fs";
import { scrapData } from "../src/data/scrapData.js";
import { serviceData } from "../src/data/serviceData.js";
import { locationData } from "../src/data/locationData.js";

const baseUrl = "https://www.scrapiz.in";
const today = new Date().toISOString().split("T")[0];

const urls = [];

// ---------- SERVICE PAGES ----------
// {scrap}-scrap-{service}-{location}

Object.keys(scrapData).forEach(material => {
  Object.keys(serviceData).forEach(service => {
    Object.keys(locationData).forEach(city => {

      const slug = `${material}-scrap-${service}-${city}`;
      const url = `${baseUrl}/${slug}`;

      urls.push(url);

    });
  });
});

// ---------- SELL PAGES ----------
// sell-{scrap}-scrap-{location}

Object.keys(scrapData).forEach(material => {
  Object.keys(locationData).forEach(city => {

    const slug = `sell-${material}-scrap-${city}`;
    const url = `${baseUrl}/${slug}`;

    urls.push(url);

  });
});

console.log(`Generated ${urls.length} URLs`);

// ---------- SITEMAP ----------

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join("")}

</urlset>
`;

fs.writeFileSync("./public/sitemap-seo-pages.xml", sitemap);

// ---------- MARKDOWN ----------

const md = urls.map(url => `- ${url}`).join("\n");
fs.writeFileSync("./seo-pages.md", md);



console.log("✅ sitemap-seo-pages.xml generated");
console.log("✅ seo-pages.md generated");


export { urls };
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

// =====================================================
// 🚀 SCRAP RATE PAGES
// =====================================================

// ---------- SCRAP RATE (NO LOCATION) ----------
// {scrap}-scrap-rate

Object.keys(scrapData).forEach(material => {

  const slug = `${material}-scrap-rate`;
  const url = `${baseUrl}/${slug}`;

  urls.push(url);

});

// ---------- SCRAP RATE + LOCATION ----------
// {scrap}-scrap-rate-{location}

Object.keys(scrapData).forEach(material => {
  Object.keys(locationData).forEach(city => {

    const slug = `${material}-scrap-rate-${city}`;
    const url = `${baseUrl}/${slug}`;

    urls.push(url);

  });
});

// =====================================================
// 🚀 SERVICE + LOCATION PAGES (/services/...)
// =====================================================

// Primary service slugs (no aliases)
const serviceSlugs = [
  "scrap-collection",
  "demolition-service",
  "dismantling",
  "paper-shredding",
  "society-tie-up",
  "junk-removal-service",
  "vehicle-scrapping",
];

// /services (default Mumbai listing)
urls.push(`${baseUrl}/services`);

// /services/{service-slug} (no location)
serviceSlugs.forEach(serviceSlug => {
  urls.push(`${baseUrl}/services/${serviceSlug}`);
});

// /services/{service-slug}-{location-slug}
serviceSlugs.forEach(serviceSlug => {
  Object.values(locationData).forEach(loc => {
    const slug = `${serviceSlug}-${loc.slug}`;
    urls.push(`${baseUrl}/services/${slug}`);
  });
});

// =====================================================

console.log(`Generated ${urls.length} URLs`);

// ---------- REMOVE DUPLICATES (IMPORTANT) ----------
const uniqueUrls = [...new Set(urls)];

// ---------- SITEMAP ----------
// ---------- CONFIG ----------
const CHUNK_SIZE = 200;
const OUTPUT_DIR = "./public";

// ---------- SPLIT INTO CHUNKS ----------
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

const chunks = chunkArray(uniqueUrls, CHUNK_SIZE);

console.log(`📦 Total sitemap files: ${chunks.length}`);

// ---------- GENERATE SITEMAP FILES ----------
const sitemapFiles = [];

chunks.forEach((chunk, index) => {
  const fileName = `sitemap-${index + 1}.xml`;
  const filePath = `${OUTPUT_DIR}/${fileName}`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${chunk.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join("")}

</urlset>`;

  fs.writeFileSync(filePath, sitemap);
  sitemapFiles.push(`${baseUrl}/${fileName}`);

  console.log(`✅ Generated ${fileName} (${chunk.length} URLs)`);
});

// ---------- GENERATE SITEMAP INDEX ----------
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${sitemapFiles.map(url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
`).join("")}

</sitemapindex>`;

fs.writeFileSync(`${OUTPUT_DIR}/sitemap.xml`, sitemapIndex);

console.log("🔥 sitemap.xml (index) generated");

// ---------- OPTIONAL MARKDOWN ----------
const md = uniqueUrls.map(url => `- ${url}`).join("\n");
fs.writeFileSync("./seo-pages.md", md);

console.log("✅ seo-pages.md generated");
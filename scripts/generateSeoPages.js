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

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${uniqueUrls.map(url => `
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

const md = uniqueUrls.map(url => `- ${url}`).join("\n");
fs.writeFileSync("./seo-pages.md", md);

console.log("✅ sitemap-seo-pages.xml generated");
console.log("✅ seo-pages.md generated");

export { uniqueUrls as urls };
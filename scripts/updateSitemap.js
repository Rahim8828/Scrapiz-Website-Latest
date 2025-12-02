import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗺️  Sitemap Update Script\n');
console.log('='.repeat(60));

const today = new Date().toISOString().split('T')[0];

// All routes from App.jsx
const routes = {
  main: [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/locations', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  ],
  
  services: [
    { path: '/services/scrap-collection', priority: '0.9', changefreq: 'weekly' },
    { path: '/services/demolition-service', priority: '0.8', changefreq: 'weekly' },
    { path: '/services/dismantling', priority: '0.8', changefreq: 'weekly' },
    { path: '/services/paper-shredding', priority: '0.8', changefreq: 'weekly' },
    { path: '/services/society-tie-up', priority: '0.8', changefreq: 'weekly' },
    { path: '/services/junk-removal-service', priority: '0.8', changefreq: 'weekly' },
    { path: '/services/vehicle-scrapping', priority: '0.8', changefreq: 'weekly' },
  ],
  
  mainLocations: [
    { path: '/bandra', priority: '0.7', changefreq: 'monthly' },
    { path: '/bandra-east', priority: '0.7', changefreq: 'monthly' },
    { path: '/jogeshwari', priority: '0.7', changefreq: 'monthly' },
    { path: '/kandivali', priority: '0.7', changefreq: 'monthly' },
    { path: '/mahim', priority: '0.7', changefreq: 'monthly' },
    { path: '/dharavi', priority: '0.7', changefreq: 'monthly' },
    { path: '/dharavi-koliwada', priority: '0.7', changefreq: 'monthly' },
    { path: '/goregaon', priority: '0.7', changefreq: 'monthly' },
    { path: '/nalasopara', priority: '0.7', changefreq: 'monthly' },
  ],
  
  extraLocations: [
    { path: '/scrap-dealer-in-andheri', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-andheri-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-jogeshwari-west', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-jogeshwari-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-goregaon-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-goregaon-west', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-malad-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-malad-west', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-kandivali-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-kandivali-west', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-sion', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-kurla', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-chembur', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-ghatkopar-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-ghatkopar-west', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-vidyavihar', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-mulund', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-bhandup', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-vikhroli', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-wadala', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-lower-parel', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-worli', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-byculla', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-grant-road', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-cst', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-colaba', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-fort', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-dadar-east', priority: '0.6', changefreq: 'monthly' },
    { path: '/scrap-dealer-in-dadar-west', priority: '0.6', changefreq: 'monthly' },
  ],
  
  scrapCategories: [
    { path: '/sell-aluminium-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-copper-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-brass-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-iron-steel-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-stainless-steel-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-e-waste-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-ac-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-refrigerator-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-washing-machine-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
    { path: '/sell-microwave-scrap-mumbai', priority: '0.8', changefreq: 'weekly' },
  ],
  
  blog: [
    { path: '/blog/top-10-benefits-of-selling-your-scrap-online-with-scrapiz', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/selling-scrap-online-with-scrapiz-how-it-makes-scrap-selling-easy', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/sell-scrap-online-in-mumbai', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/sell-my-unused-junk-for-cash-in-mumbai', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/reliable-scrap-buyer-near-me-for-home-pick-up', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/sell-scrap-online-in-mumbai-instant-pickup-call-now', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/best-price-for-scrap-metal-near-me-sell-now', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog/sell-scrap-without-leaving-home-in-mumbai', priority: '0.6', changefreq: 'monthly' },
  ],
  
  legal: [
    { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
    { path: '/request-account-deletion', priority: '0.2', changefreq: 'yearly' },
  ],
};

// Generate XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Helper function to add URL
const addUrl = (path, priority, changefreq) => {
  xml += `  <url>
    <loc>https://www.scrapiz.in${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
  
`;
};

// Add all routes
console.log('\n📝 Generating sitemap...\n');

console.log('✅ Main Pages: ' + routes.main.length);
routes.main.forEach(r => addUrl(r.path, r.priority, r.changefreq));

console.log('✅ Service Pages: ' + routes.services.length);
routes.services.forEach(r => addUrl(r.path, r.priority, r.changefreq));

console.log('✅ Main Location Pages: ' + routes.mainLocations.length);
routes.mainLocations.forEach(r => addUrl(r.path, r.priority, r.changefreq));

console.log('✅ Extra Location Pages: ' + routes.extraLocations.length);
routes.extraLocations.forEach(r => addUrl(r.path, r.priority, r.changefreq));

console.log('✅ Scrap Category Pages: ' + routes.scrapCategories.length);
routes.scrapCategories.forEach(r => addUrl(r.path, r.priority, r.changefreq));

console.log('✅ Blog Posts: ' + routes.blog.length);
routes.blog.forEach(r => addUrl(r.path, r.priority, r.changefreq));

console.log('✅ Legal Pages: ' + routes.legal.length);
routes.legal.forEach(r => addUrl(r.path, r.priority, r.changefreq));

xml += `</urlset>`;

// Write to file
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

// Calculate totals
const totalUrls = 
  routes.main.length + 
  routes.services.length + 
  routes.mainLocations.length + 
  routes.extraLocations.length + 
  routes.scrapCategories.length + 
  routes.blog.length + 
  routes.legal.length;

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`\n✅ Total URLs: ${totalUrls}`);
console.log(`✅ Last Modified: ${today}`);
console.log(`✅ Sitemap saved to: public/sitemap.xml`);
console.log('\n✨ Sitemap updated successfully!\n');

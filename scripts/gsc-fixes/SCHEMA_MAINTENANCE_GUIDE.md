# Schema Markup Maintenance Guide

## Quick Reference for Maintaining Valid Structured Data

---

## 🔍 Regular Audits

### Monthly Check
Run the source audit to verify all pages have valid schema:

```bash
node scripts/gsc-fixes/audit-source-schema.js
```

### After Adding New Pages
Always add appropriate schema markup to new pages. Use existing pages as templates.

---

## 📋 Schema Templates

### LocalBusiness Schema (for service/location pages)

```javascript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness", // or "RecyclingCenter", "Service"
  "name": "Scrapiz",
  "description": "Your page description",
  "url": "https://www.scrapiz.in/your-page",
  "telephone": "+91-8828700630",
  "email": "contact@scrapiz.in",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop No. 07, Dharavi",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400017",
    "addressCountry": "IN"
  },
  "priceRange": "₹₹",
  "image": "https://www.scrapiz.in/image.webp",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.0XXX,
    "longitude": 72.XXXX
  }
};
```

### FAQPage Schema

```javascript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};
```

### Combined Schema (using @graph)

```javascript
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "Service Name",
      "description": "Service description",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Scrapiz",
        "telephone": "+91-8828700630",
        "email": "contact@scrapiz.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shop No. 07, Dharavi",
          "addressLocality": "Mumbai",
          "addressRegion": "Maharashtra",
          "postalCode": "400017",
          "addressCountry": "IN"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Mumbai"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ]
};
```

---

## ✅ Required Fields Checklist

### LocalBusiness
- [ ] `@type`: "LocalBusiness" or subtype
- [ ] `name`: Business name
- [ ] `address`: Complete PostalAddress
  - [ ] `streetAddress`
  - [ ] `addressLocality`
  - [ ] `addressRegion`
  - [ ] `postalCode`
  - [ ] `addressCountry`
- [ ] `telephone`: Contact number
- [ ] `email`: Contact email (recommended)
- [ ] `url`: Page URL (recommended)

### FAQPage
- [ ] `@type`: "FAQPage"
- [ ] `mainEntity`: Array of Questions
  - [ ] Each has `@type`: "Question"
  - [ ] Each has `name` (question text)
  - [ ] Each has `acceptedAnswer`
    - [ ] `@type`: "Answer"
    - [ ] `text`: Answer content

### Service
- [ ] `@type`: "Service"
- [ ] `name`: Service name
- [ ] `description`: Service description
- [ ] `provider`: LocalBusiness object
- [ ] `areaServed`: Geographic area

---

## 🚨 Common Mistakes to Avoid

### 1. Incomplete Address
❌ **Wrong:**
```javascript
"address": {
  "@type": "PostalAddress",
  "addressLocality": "Mumbai"
}
```

✅ **Correct:**
```javascript
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Shop No. 07, Dharavi",
  "addressLocality": "Mumbai",
  "addressRegion": "Maharashtra",
  "postalCode": "400017",
  "addressCountry": "IN"
}
```

### 2. Missing @type in Nested Objects
❌ **Wrong:**
```javascript
"acceptedAnswer": {
  "text": "Answer text"
}
```

✅ **Correct:**
```javascript
"acceptedAnswer": {
  "@type": "Answer",
  "text": "Answer text"
}
```

### 3. Invalid JSON in JSX
❌ **Wrong:**
```javascript
<script type="application/ld+json">{jsonLd}</script>
```

✅ **Correct:**
```javascript
<script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

---

## 🧪 Testing Your Schema

### 1. Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Paste your page URL or HTML
- Check for errors and warnings

### 2. Schema Markup Validator
- URL: https://validator.schema.org/
- Paste your schema JSON
- Verify structure is valid

### 3. Google Search Console
- Navigate to Enhancements > Structured Data
- Monitor for errors
- Check rich results eligibility

---

## 🔧 Automated Fixes

If you encounter schema issues, run the automated fix script:

```bash
node scripts/gsc-fixes/fix-all-schema-issues.js
```

This will:
- Add missing address fields
- Enhance incomplete schemas
- Add missing required properties
- Create backups before changes

---

## 📊 Monitoring

### Weekly
- Check Google Search Console for structured data errors
- Review any new warnings or issues

### Monthly
- Run full schema audit
- Test sample pages with Rich Results Test
- Update schema if business information changes

### After Updates
- Always test schema after:
  - Adding new pages
  - Modifying existing pages
  - Changing business information
  - Updating contact details

---

## 🆘 Troubleshooting

### Schema Not Showing in Google
1. Verify schema is valid (use validators)
2. Check robots.txt isn't blocking
3. Ensure page is indexed
4. Wait 1-2 weeks for Google to process
5. Submit URL for re-indexing in GSC

### Validation Errors
1. Run audit script to identify issues
2. Check for missing required fields
3. Verify JSON syntax is correct
4. Ensure @type values are valid
5. Test with online validators

### Rich Results Not Appearing
1. Verify schema type is eligible for rich results
2. Check Google's rich results guidelines
3. Ensure all required fields are present
4. Monitor Search Console for issues
5. Be patient - can take weeks to appear

---

## 📚 Resources

### Official Documentation
- Schema.org: https://schema.org/
- Google Search Central: https://developers.google.com/search/docs/appearance/structured-data
- JSON-LD: https://json-ld.org/

### Testing Tools
- Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/
- Google Search Console: https://search.google.com/search-console

### Our Scripts
- Audit: `scripts/gsc-fixes/audit-source-schema.js`
- Fix: `scripts/gsc-fixes/fix-all-schema-issues.js`
- Report: `scripts/gsc-fixes/SCHEMA_FIX_REPORT.md`

---

## 💡 Best Practices

1. **Be Consistent** - Use the same address format across all pages
2. **Be Complete** - Include all required fields, not just minimum
3. **Be Accurate** - Ensure information matches your actual business
4. **Be Current** - Update schema when business details change
5. **Be Tested** - Always validate before deploying
6. **Be Monitored** - Regularly check for issues in GSC

---

## 🎯 Quick Commands

```bash
# Audit all schema
node scripts/gsc-fixes/audit-source-schema.js

# Fix common issues
node scripts/gsc-fixes/fix-all-schema-issues.js

# Check specific page (requires dev server)
node scripts/gsc-fixes/audit-and-fix-schema.js
```

---

**Last Updated:** December 1, 2025  
**Maintained By:** Development Team  
**Questions?** Review SCHEMA_FIX_REPORT.md or contact the team.

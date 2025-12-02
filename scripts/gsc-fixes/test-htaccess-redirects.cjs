/**
 * Test script to verify .htaccess redirect rules
 * Tests that old service page URLs redirect to new /services/ URLs
 */

const fs = require('fs');
const path = require('path');

// Read .htaccess file
const htaccessPath = path.join(__dirname, '../../public/.htaccess');
const htaccessContent = fs.readFileSync(htaccessPath, 'utf8');

// Test cases: [oldUrl, expectedNewUrl]
const redirectTests = [
  // Service page redirects
  ['/scrap-collection-page', '/services/scrap-collection'],
  ['/scrap-collection-page/', '/services/scrap-collection'],
  ['/scrap-collection', '/services/scrap-collection'],
  ['/demolition-service-page', '/services/demolition-service'],
  ['/demolition-service-page/', '/services/demolition-service'],
  ['/demolition-service', '/services/demolition-service'],
  ['/demolition', '/services/demolition-service'],
  ['/dismantling-page', '/services/dismantling'],
  ['/dismantling-service', '/services/dismantling'],
  ['/paper-shredding-page', '/services/paper-shredding'],
  ['/paper-shredding-service', '/services/paper-shredding'],
  ['/society-tie-up-page', '/services/society-tie-up'],
  ['/society-tieup', '/services/society-tie-up'],
  ['/junk-removal-service-page', '/services/junk-removal-service'],
  ['/junk-removal', '/services/junk-removal-service'],
  ['/vehicle-scrapping-page', '/services/vehicle-scrapping'],
  ['/vehicle-scrap', '/services/vehicle-scrapping'],
  
  // Old WordPress redirects
  ['/contact-us', '/contact'],
  ['/terms-conditions', '/terms-and-conditions'],
  ['/scrapiz-koliwada', '/dharavi-koliwada'],
  ['/scrapiz-nala-sopara', '/nalasopara'],
  ['/scrapiz-dharavi', '/dharavi'],
  ['/scrapiz-bandra-east', '/bandra-east'],
  ['/scrapiz-bandra', '/bandra'],
  ['/scrapiz-kandivali', '/kandivali'],
  ['/scrapiz-goregaon', '/goregaon'],
];

console.log('🔍 Testing .htaccess Redirect Rules\n');
console.log('=' .repeat(80));

let passCount = 0;
let failCount = 0;

// Extract redirect rules from .htaccess (exclude HTTPS redirect)
const redirectRules = [];
const rewriteRuleRegex = /RewriteRule\s+\^([^\s]+)\s+([^\s]+)\s+\[R=301,L\]/g;
let match;

while ((match = rewriteRuleRegex.exec(htaccessContent)) !== null) {
  let pattern = match[1];
  const target = match[2];
  
  // Skip HTTPS redirect and trailing slash rules
  if (target.includes('%{HTTP_HOST}') || target === '/$1') {
    continue;
  }
  
  // Remove $ from end of pattern if present
  pattern = pattern.replace(/\$$/, '');
  
  redirectRules.push({ pattern, target });
}

console.log(`\n📋 Found ${redirectRules.length} redirect rules in .htaccess\n`);

// Debug: print first few rules
if (redirectRules.length > 0) {
  console.log('Sample rules:');
  redirectRules.slice(0, 3).forEach(rule => {
    console.log(`  Pattern: "${rule.pattern}" → Target: "${rule.target}"`);
  });
  console.log();
}

// Test each redirect
redirectTests.forEach(([oldUrl, expectedNewUrl]) => {
  // Remove leading slash for pattern matching
  const urlPath = oldUrl.replace(/^\//, '');
  
  // Find matching rule
  const matchingRule = redirectRules.find(rule => {
    // Convert Apache regex pattern to JavaScript regex
    // /? means optional slash in Apache regex
    let jsPattern = rule.pattern
      .replace(/\(\.\*\)/g, '.*')
      .replace(/\(\.\+\)/g, '.+')
      .replace(/\//g, '\\/')   // escape slashes first
      .replace(/\\\\\//g, '\\/')  // fix double escaping
      .replace(/\\\\\?/g, '?');   // ? after escaped / means optional
    
    const regex = new RegExp(`^${jsPattern}$`);
    return regex.test(urlPath);
  });
  
  if (matchingRule) {
    if (matchingRule.target === expectedNewUrl) {
      console.log(`✅ PASS: ${oldUrl} → ${expectedNewUrl}`);
      passCount++;
    } else {
      console.log(`❌ FAIL: ${oldUrl} → Expected: ${expectedNewUrl}, Got: ${matchingRule.target}`);
      failCount++;
    }
  } else {
    console.log(`❌ FAIL: ${oldUrl} → No redirect rule found`);
    failCount++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`   📈 Total: ${redirectTests.length}`);
console.log(`   🎯 Success Rate: ${((passCount / redirectTests.length) * 100).toFixed(1)}%\n`);

// Verify redirect properties
console.log('🔍 Verifying Redirect Properties:\n');

const checks = {
  'All redirects are 301 (permanent)': htaccessContent.match(/R=301/g)?.length || 0,
  'No 302 (temporary) redirects': !(htaccessContent.includes('R=302')),
  'Trailing slash handling present': htaccessContent.includes('RewriteRule ^(.+)/$ /$1 [R=301,L]'),
  'HTTPS enforcement present': htaccessContent.includes('RewriteCond %{HTTPS} off'),
  'React Router handler is last': htaccessContent.indexOf('REACT ROUTER HANDLER') > htaccessContent.lastIndexOf('RewriteRule'),
};

Object.entries(checks).forEach(([check, result]) => {
  if (typeof result === 'boolean') {
    console.log(`${result ? '✅' : '❌'} ${check}`);
  } else {
    console.log(`✅ ${check}: ${result} rules`);
  }
});

console.log('\n' + '='.repeat(80));

// Check for redirect chains
console.log('\n🔗 Checking for Redirect Chains:\n');

const chainWarnings = [];
redirectRules.forEach(rule1 => {
  redirectRules.forEach(rule2 => {
    if (rule1 !== rule2) {
      // Check if rule1's target matches rule2's pattern
      const targetPath = rule1.target.replace(/^\//, '');
      const jsPattern = rule2.pattern
        .replace(/\(\.\*\)/g, '.*')
        .replace(/\?/g, '\\?')
        .replace(/\//g, '\\/')
        .replace(/\(\.\+\)/g, '.+');
      
      const regex = new RegExp(`^${jsPattern}$`);
      if (regex.test(targetPath)) {
        chainWarnings.push(`⚠️  Potential chain: ${rule1.pattern} → ${rule1.target} → ${rule2.target}`);
      }
    }
  });
});

if (chainWarnings.length === 0) {
  console.log('✅ No redirect chains detected');
} else {
  console.log(`⚠️  Found ${chainWarnings.length} potential redirect chains:`);
  chainWarnings.forEach(warning => console.log(warning));
}

console.log('\n' + '='.repeat(80));

// Exit with appropriate code
process.exit(failCount > 0 ? 1 : 0);

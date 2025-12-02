import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Analyze build output
function analyzeDirectory(dir, baseDir = dir) {
  let files = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(analyzeDirectory(fullPath, baseDir));
      } else {
        const relativePath = fullPath.replace(baseDir + '/', '');
        files.push({
          path: relativePath,
          size: stat.size,
          ext: extname(item)
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// Group files by type
function groupByType(files) {
  const groups = {
    js: [],
    css: [],
    images: [],
    fonts: [],
    html: [],
    other: []
  };
  
  files.forEach(file => {
    const ext = file.ext.toLowerCase();
    if (['.js', '.mjs'].includes(ext)) {
      groups.js.push(file);
    } else if (ext === '.css') {
      groups.css.push(file);
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].includes(ext)) {
      groups.images.push(file);
    } else if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
      groups.fonts.push(file);
    } else if (ext === '.html') {
      groups.html.push(file);
    } else {
      groups.other.push(file);
    }
  });
  
  return groups;
}

// Calculate total size
function calculateTotalSize(files) {
  return files.reduce((sum, file) => sum + file.size, 0);
}

// Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main audit function
function auditPageWeight() {
  console.log('🔍 Auditing Page Weight and Resources...\n');
  
  const distPath = join(__dirname, '../dist');
  const publicPath = join(__dirname, '../public');
  
  // Analyze dist folder
  console.log('📦 Analyzing dist folder...');
  const distFiles = analyzeDirectory(distPath);
  const distGroups = groupByType(distFiles);
  
  // Analyze public folder (for images not in dist)
  console.log('📦 Analyzing public folder...');
  const publicFiles = analyzeDirectory(publicPath);
  const publicGroups = groupByType(publicFiles);
  
  // Combine results
  const allGroups = {
    js: [...distGroups.js],
    css: [...distGroups.css],
    images: [...distGroups.images, ...publicGroups.images],
    fonts: [...distGroups.fonts, ...publicGroups.fonts],
    html: [...distGroups.html],
    other: [...distGroups.other, ...publicGroups.other]
  };
  
  // Calculate totals
  const totals = {
    js: calculateTotalSize(allGroups.js),
    css: calculateTotalSize(allGroups.css),
    images: calculateTotalSize(allGroups.images),
    fonts: calculateTotalSize(allGroups.fonts),
    html: calculateTotalSize(allGroups.html),
    other: calculateTotalSize(allGroups.other)
  };
  
  const totalSize = Object.values(totals).reduce((sum, size) => sum + size, 0);
  const totalFiles = Object.values(allGroups).reduce((sum, group) => sum + group.length, 0);
  
  // Print report
  console.log('\n📊 Page Weight Analysis Report\n');
  console.log('=' .repeat(60));
  
  console.log('\n📈 Summary:');
  console.log(`Total Files: ${totalFiles}`);
  console.log(`Total Size: ${formatBytes(totalSize)}`);
  console.log(`Target: < 2 MB (${totalSize > 2 * 1024 * 1024 ? '❌ EXCEEDS' : '✅ MEETS'})`);
  console.log(`HTTP Requests Target: < 50 (${totalFiles > 50 ? '❌ EXCEEDS' : '✅ MEETS'})`);
  
  console.log('\n📦 Breakdown by Type:');
  console.log('-'.repeat(60));
  
  Object.entries(totals).forEach(([type, size]) => {
    const count = allGroups[type].length;
    const percentage = ((size / totalSize) * 100).toFixed(1);
    console.log(`${type.toUpperCase().padEnd(10)} ${count.toString().padStart(4)} files  ${formatBytes(size).padStart(12)}  (${percentage}%)`);
  });
  
  // Show largest files
  console.log('\n🔝 Top 20 Largest Files:');
  console.log('-'.repeat(60));
  
  const allFiles = Object.values(allGroups).flat();
  const sortedFiles = allFiles.sort((a, b) => b.size - a.size).slice(0, 20);
  
  sortedFiles.forEach((file, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${formatBytes(file.size).padStart(10)}  ${file.path}`);
  });
  
  // Identify optimization opportunities
  console.log('\n💡 Optimization Opportunities:');
  console.log('-'.repeat(60));
  
  const opportunities = [];
  
  // Check for large JS files
  const largeJsFiles = allGroups.js.filter(f => f.size > 200 * 1024);
  if (largeJsFiles.length > 0) {
    opportunities.push(`⚠️  ${largeJsFiles.length} JavaScript file(s) exceed 200 KB`);
    largeJsFiles.forEach(f => {
      opportunities.push(`   - ${f.path}: ${formatBytes(f.size)}`);
    });
  }
  
  // Check for large images
  const largeImages = allGroups.images.filter(f => f.size > 100 * 1024);
  if (largeImages.length > 0) {
    opportunities.push(`⚠️  ${largeImages.length} image(s) exceed 100 KB`);
    largeImages.forEach(f => {
      opportunities.push(`   - ${f.path}: ${formatBytes(f.size)}`);
    });
  }
  
  // Check for unoptimized image formats
  const nonWebPImages = allGroups.images.filter(f => 
    ['.jpg', '.jpeg', '.png'].includes(f.ext.toLowerCase())
  );
  if (nonWebPImages.length > 0) {
    opportunities.push(`⚠️  ${nonWebPImages.length} image(s) not in WebP format`);
  }
  
  // Check total image size
  if (totals.images > 1 * 1024 * 1024) {
    opportunities.push(`⚠️  Total image size (${formatBytes(totals.images)}) exceeds 1 MB`);
  }
  
  // Check for duplicate or similar files
  const fileNames = allFiles.map(f => f.path.split('/').pop());
  const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    opportunities.push(`⚠️  Potential duplicate files detected: ${duplicates.length}`);
  }
  
  if (opportunities.length === 0) {
    console.log('✅ No major optimization opportunities found!');
  } else {
    opportunities.forEach(opp => console.log(opp));
  }
  
  // Recommendations
  console.log('\n📋 Recommendations:');
  console.log('-'.repeat(60));
  
  const recommendations = [];
  
  if (totalSize > 2 * 1024 * 1024) {
    recommendations.push('1. Reduce total page weight to under 2 MB');
  }
  
  if (totalFiles > 50) {
    recommendations.push('2. Reduce HTTP requests to under 50');
  }
  
  if (largeJsFiles.length > 0) {
    recommendations.push('3. Split large JavaScript bundles');
  }
  
  if (largeImages.length > 0) {
    recommendations.push('4. Compress large images further');
  }
  
  if (nonWebPImages.length > 0) {
    recommendations.push('5. Convert remaining images to WebP format');
  }
  
  if (allGroups.fonts.length > 5) {
    recommendations.push('6. Reduce number of font files');
  }
  
  if (recommendations.length === 0) {
    console.log('✅ All targets met! No further optimization needed.');
  } else {
    recommendations.forEach(rec => console.log(rec));
  }
  
  console.log('\n' + '='.repeat(60));
  
  return {
    totalSize,
    totalFiles,
    totals,
    groups: allGroups,
    meetsWeightTarget: totalSize <= 2 * 1024 * 1024,
    meetsRequestTarget: totalFiles <= 50
  };
}

// Run audit
try {
  const results = auditPageWeight();
  
  // Exit with error code if targets not met
  if (!results.meetsWeightTarget || !results.meetsRequestTarget) {
    console.log('\n❌ Optimization targets not met. Further optimization required.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All optimization targets met!\n');
    process.exit(0);
  }
} catch (error) {
  console.error('Error during audit:', error);
  process.exit(1);
}

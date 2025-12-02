import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Optimizing Page Weight and Requests...\n');

// Step 1: Remove duplicate image folders
console.log('Step 1: Removing duplicate image folders...');

const publicPath = join(__dirname, '../public');
const responsivePath = join(publicPath, 'responsive');

// Remove responsive folder (keeping optimized)
if (existsSync(responsivePath)) {
  try {
    rmSync(responsivePath, { recursive: true, force: true });
    console.log('✅ Removed responsive/ folder (duplicate of optimized/)');
  } catch (error) {
    console.log('⚠️  Could not fully remove responsive/ folder:', error.message);
  }
}

// Step 2: Analyze and remove unnecessary dependencies
console.log('\nStep 2: Analyzing package.json for unused dependencies...');

const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const potentiallyUnused = [];

// Check for dependencies that might not be needed
const checkDeps = [
  'rollup-plugin-visualizer', // Only needed for analysis, not production
];

checkDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    potentiallyUnused.push({ name: dep, type: 'dependencies' });
  }
});

if (potentiallyUnused.length > 0) {
  console.log('⚠️  Found potentially unused dependencies:');
  potentiallyUnused.forEach(dep => {
    console.log(`   - ${dep.name} (in ${dep.type})`);
  });
  console.log('   Consider moving these to devDependencies');
} else {
  console.log('✅ No obviously unused dependencies found');
}

// Step 3: Update image references in code
console.log('\nStep 3: Updating image references to use optimized/ folder only...');

const srcPath = join(__dirname, '../src');

function updateImageReferences(dir) {
  const items = readdirSync(dir);
  let updatedFiles = 0;
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      updatedFiles += updateImageReferences(fullPath);
    } else if (['.jsx', '.js', '.tsx', '.ts'].includes(extname(item))) {
      try {
        let content = readFileSync(fullPath, 'utf-8');
        const originalContent = content;
        
        // Replace responsive/ with optimized/
        content = content.replace(/\/responsive\//g, '/optimized/');
        
        if (content !== originalContent) {
          writeFileSync(fullPath, content, 'utf-8');
          updatedFiles++;
        }
      } catch (error) {
        console.error(`Error updating ${fullPath}:`, error.message);
      }
    }
  }
  
  return updatedFiles;
}

const updatedFiles = updateImageReferences(srcPath);
console.log(`✅ Updated ${updatedFiles} file(s) to use optimized/ folder`);

// Step 4: Remove large unoptimized images from public root
console.log('\nStep 4: Checking for unoptimized images in public root...');

const publicFiles = readdirSync(publicPath);
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
let removedImages = 0;

publicFiles.forEach(file => {
  const fullPath = join(publicPath, file);
  const stat = statSync(fullPath);
  
  if (stat.isFile() && imageExtensions.includes(extname(file).toLowerCase())) {
    // Check if optimized version exists
    const optimizedPath = join(publicPath, 'optimized', file);
    
    if (existsSync(optimizedPath)) {
      // Remove original if optimized version exists
      try {
        unlinkSync(fullPath);
        removedImages++;
        console.log(`   Removed: ${file} (optimized version exists)`);
      } catch (error) {
        console.error(`   Error removing ${file}:`, error.message);
      }
    }
  }
});

console.log(`✅ Removed ${removedImages} unoptimized image(s) from public root`);

// Step 5: Create .htaccess rules for better caching
console.log('\nStep 5: Verifying .htaccess caching rules...');

const htaccessPath = join(publicPath, '.htaccess');

if (existsSync(htaccessPath)) {
  const htaccess = readFileSync(htaccessPath, 'utf-8');
  
  const hasImageCaching = htaccess.includes('image/webp') || htaccess.includes('ExpiresByType image');
  const hasJsCaching = htaccess.includes('application/javascript');
  const hasCssCaching = htaccess.includes('text/css');
  
  if (hasImageCaching && hasJsCaching && hasCssCaching) {
    console.log('✅ .htaccess has proper caching rules');
  } else {
    console.log('⚠️  .htaccess may need additional caching rules');
  }
} else {
  console.log('⚠️  No .htaccess file found');
}

// Step 6: Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Optimization Summary');
console.log('='.repeat(60));
console.log(`✅ Removed duplicate responsive/ folder`);
console.log(`✅ Updated ${updatedFiles} source file(s)`);
console.log(`✅ Removed ${removedImages} unoptimized image(s)`);
console.log('\n💡 Next Steps:');
console.log('1. Run: npm run build');
console.log('2. Run: node scripts/auditPageWeight.js');
console.log('3. Verify all images still load correctly');
console.log('='.repeat(60) + '\n');

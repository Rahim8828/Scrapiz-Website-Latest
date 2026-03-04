import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🖼️  Assets Image Optimization Pipeline\n');
console.log('='.repeat(60));

// Configuration
const config = {
  inputDir: path.join(__dirname, '../src/assets'),
  outputDir: path.join(__dirname, '../public/assets-optimized'),
  quality: 85, // WebP quality (0-100)
  formats: ['webp'], // Output formats
  // Responsive breakpoints (widths in pixels)
  breakpoints: [320, 640, 768, 1024, 1280, 1920],
  // Minimum compression ratio to consider optimization successful
  minCompressionRatio: 0.6
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Get all image files from assets directory
const getImageFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
      // Skip SVG files as they're already optimized
      files.push({ name: item, path: fullPath });
    }
  }
  
  return files;
};

// Optimize a single image
const optimizeImage = async (imagePath, imageName) => {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const originalSize = fs.statSync(imagePath).size;
    
    console.log(`\n📸 Processing: ${imageName}`);
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(2)} KB`);
    
    const results = {
      original: imageName,
      originalSize,
      optimized: [],
      responsive: []
    };
    
    // Generate base optimized WebP
    const baseName = path.parse(imageName).name;
    const webpPath = path.join(config.outputDir, `${baseName}.webp`);
    
    await image
      .webp({ quality: config.quality, effort: 6 })
      .toFile(webpPath);
    
    const optimizedSize = fs.statSync(webpPath).size;
    const compressionRatio = 1 - (optimizedSize / originalSize);
    
    results.optimized.push({
      path: webpPath,
      size: optimizedSize,
      compressionRatio
    });
    
    console.log(`   ✅ Optimized: ${(optimizedSize / 1024).toFixed(2)} KB (${(compressionRatio * 100).toFixed(1)}% reduction)`);
    
    // Generate responsive sizes (only if original is large enough)
    if (metadata.width > 320) {
      console.log(`   🔄 Generating responsive sizes...`);
      
      for (const width of config.breakpoints) {
        // Only generate if smaller than original
        if (width < metadata.width) {
          const responsivePath = path.join(config.outputDir, `${baseName}-${width}w.webp`);
          
          await sharp(imagePath)
            .resize(width, null, { withoutEnlargement: true })
            .webp({ quality: config.quality, effort: 6 })
            .toFile(responsivePath);
          
          const responsiveSize = fs.statSync(responsivePath).size;
          
          results.responsive.push({
            width,
            path: responsivePath,
            size: responsiveSize
          });
          
          console.log(`      ${width}w: ${(responsiveSize / 1024).toFixed(2)} KB`);
        }
      }
    }
    
    return results;
    
  } catch (error) {
    console.error(`   ❌ Error processing ${imageName}:`, error.message);
    return null;
  }
};

// Main execution
const main = async () => {
  const imageFiles = getImageFiles(config.inputDir);
  
  console.log(`\n📊 Found ${imageFiles.length} images to process\n`);
  
  const allResults = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of imageFiles) {
    const result = await optimizeImage(file.path, file.name);
    if (result) {
      allResults.push(result);
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimized[0]?.size || 0;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Images Processed: ${allResults.length}`);
  console.log(`📦 Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Total Optimized Size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Total Savings: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📉 Average Compression: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  
  // Generate manifest file
  const manifest = {
    generatedAt: new Date().toISOString(),
    config,
    images: allResults.map(r => ({
      original: r.original,
      originalSize: r.originalSize,
      optimized: r.optimized[0]?.path.replace(config.outputDir, ''),
      optimizedSize: r.optimized[0]?.size,
      compressionRatio: r.optimized[0]?.compressionRatio,
      responsive: r.responsive.map(resp => ({
        width: resp.width,
        path: resp.path.replace(config.outputDir, ''),
        size: resp.size
      }))
    }))
  };
  
  fs.writeFileSync(
    path.join(config.outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`\n📄 Manifest saved to: ${path.join(config.outputDir, 'manifest.json')}`);
  console.log('\n✨ Assets optimization complete!\n');
  
  // Auto-generate the image manifest for ResponsiveAssetImage component
  console.log('🔄 Generating image manifest for ResponsiveAssetImage...\n');
  try {
    const { execSync } = await import('child_process');
    execSync('npm run generate:manifest', { stdio: 'inherit' });
  } catch (error) {
    console.error('⚠️  Warning: Could not auto-generate manifest. Run "npm run generate:manifest" manually.');
  }
};

main().catch(console.error);

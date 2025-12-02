import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🖼️  Responsive Image Generator\n');
console.log('='.repeat(60));

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public'),
  outputDir: path.join(__dirname, '../public/responsive'),
  // Responsive breakpoints (widths in pixels)
  breakpoints: [320, 640, 768, 1024, 1280, 1920],
  quality: 85,
  // Skip these files
  skipFiles: ['favicon.svg', 'robots.txt', '.htaccess']
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Get all WebP image files from public directory
const getImageFiles = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile() && /\.webp$/i.test(item)) {
      if (!config.skipFiles.includes(item)) {
        files.push({ name: item, path: fullPath });
      }
    }
  }
  
  return files;
};

// Generate responsive sizes for an image
const generateResponsiveSizes = async (imagePath, imageName) => {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const originalSize = fs.statSync(imagePath).size;
    
    console.log(`\n📸 Processing: ${imageName}`);
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(2)} KB`);
    
    const results = {
      original: imageName,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      originalSize,
      responsive: []
    };
    
    // Generate responsive sizes (only if original is large enough)
    if (metadata.width > 320) {
      console.log(`   🔄 Generating responsive sizes...`);
      
      const baseName = path.parse(imageName).name;
      
      for (const width of config.breakpoints) {
        // Only generate if smaller than original
        if (width < metadata.width) {
          const responsivePath = path.join(config.outputDir, `${baseName}-${width}w.webp`);
          
          await sharp(imagePath)
            .resize(width, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .webp({ quality: config.quality, effort: 6 })
            .toFile(responsivePath);
          
          const responsiveSize = fs.statSync(responsivePath).size;
          const responsiveMetadata = await sharp(responsivePath).metadata();
          
          results.responsive.push({
            width,
            height: responsiveMetadata.height,
            path: responsivePath,
            relativePath: `/responsive/${baseName}-${width}w.webp`,
            size: responsiveSize
          });
          
          console.log(`      ${width}w: ${responsiveMetadata.width}x${responsiveMetadata.height}, ${(responsiveSize / 1024).toFixed(2)} KB`);
        }
      }
    } else {
      console.log(`   ⏭️  Image too small for responsive sizes`);
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
  let totalResponsiveImages = 0;
  
  for (const file of imageFiles) {
    const result = await generateResponsiveSizes(file.path, file.name);
    if (result) {
      allResults.push(result);
      totalResponsiveImages += result.responsive.length;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Source Images Processed: ${allResults.length}`);
  console.log(`📸 Responsive Images Generated: ${totalResponsiveImages}`);
  console.log(`📁 Output Directory: ${config.outputDir}`);
  
  // Generate image map for easy component usage
  const imageMap = {};
  allResults.forEach(result => {
    const baseName = path.parse(result.original).name;
    imageMap[baseName] = {
      original: `/${result.original}`,
      width: result.originalWidth,
      height: result.originalHeight,
      srcSet: result.responsive
        .map(r => `${r.relativePath} ${r.width}w`)
        .join(', '),
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      responsive: result.responsive.map(r => ({
        width: r.width,
        height: r.height,
        src: r.relativePath
      }))
    };
  });
  
  // Save image map
  const imageMapPath = path.join(__dirname, '../src/utils/imageMap.json');
  fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
  
  console.log(`\n📄 Image map saved to: ${imageMapPath}`);
  
  // Generate manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    config,
    totalImages: allResults.length,
    totalResponsiveImages,
    images: allResults
  };
  
  fs.writeFileSync(
    path.join(config.outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`📄 Manifest saved to: ${path.join(config.outputDir, 'manifest.json')}`);
  console.log('\n✨ Responsive image generation complete!\n');
};

main().catch(console.error);

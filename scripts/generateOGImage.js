/**
 * Generate OG Image from SVG
 * Converts og-image.svg to og-image.png for social media
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Note: This requires sharp package
// Run: npm install sharp --save-dev

async function generateOGImage() {
  try {
    console.log('🎨 Generating OG Image...');
    
    // Try to import sharp
    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch (error) {
      console.log('⚠️ Sharp not installed. Installing now...');
      console.log('Run: npm install sharp --save-dev');
      console.log('');
      console.log('📝 Alternative: Open public/og-image.svg in browser and save as PNG');
      console.log('   Or use: https://cloudconvert.com/svg-to-png');
      process.exit(0);
    }
    
    const svgPath = join(__dirname, '../public/og-image.svg');
    const pngPath = join(__dirname, '../public/og-image.png');
    
    const svgBuffer = readFileSync(svgPath);
    
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png()
      .toFile(pngPath);
    
    console.log('✅ OG Image generated successfully!');
    console.log(`   Output: public/og-image.png`);
    console.log(`   Size: 1200x630px`);
    
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    console.log('');
    console.log('📝 Manual options:');
    console.log('   1. Open public/og-image.svg in Chrome/Firefox');
    console.log('   2. Right-click → Save As → PNG');
    console.log('   3. Or use: https://cloudconvert.com/svg-to-png');
    process.exit(1);
  }
}

generateOGImage();


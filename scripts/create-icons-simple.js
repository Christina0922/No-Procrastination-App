// 간단한 아이콘 생성 스크립트 (CommonJS)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

console.log('🎨 Generating PWA icons from SVG...');

if (!fs.existsSync(svgPath)) {
  console.error('❌ icon.svg not found!');
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

Promise.all([
  sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'))
    .then(() => console.log('✅ Generated icon-192.png (192x192)')),
  
  sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'))
    .then(() => console.log('✅ Generated icon-512.png (512x512)'))
])
.then(() => {
  console.log('✨ All icons generated successfully!');
})
.catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});


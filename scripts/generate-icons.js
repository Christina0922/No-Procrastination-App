/**
 * PWA 아이콘 생성 스크립트
 * SVG를 사용하여 미루기 방지 앱 아이콘을 생성하고 PNG로 변환합니다.
 */
import sharp from 'sharp';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// public 디렉토리가 없으면 생성
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// SVG 아이콘 생성 (미루기 방지 앱 테마: 체크마크 + 시계)
const createSVG = (size) => {
  const center = size / 2;
  const radius = size * 0.35;
  
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2196f3;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4caf50;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 배경 원 -->
  <circle cx="${center}" cy="${center}" r="${size * 0.48}" fill="url(#grad)"/>
  
  <!-- 체크마크 (완료 표시) -->
  <path d="M ${center - radius * 0.4} ${center} 
           L ${center - radius * 0.1} ${center + radius * 0.3}
           L ${center + radius * 0.4} ${center - radius * 0.2}"
        stroke="white" 
        stroke-width="${size * 0.08}" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
  
  <!-- 시계 아이콘 (시간 관리) -->
  <circle cx="${center}" cy="${center}" r="${radius * 0.7}" 
          stroke="white" 
          stroke-width="${size * 0.04}" 
          fill="none" 
          opacity="0.3"/>
  <line x1="${center}" y1="${center}" 
        x2="${center}" y2="${center - radius * 0.4}" 
        stroke="white" 
        stroke-width="${size * 0.04}" 
        stroke-linecap="round"/>
  <line x1="${center}" y1="${center}" 
        x2="${center + radius * 0.3}" y2="${center}" 
        stroke="white" 
        stroke-width="${size * 0.04}" 
        stroke-linecap="round"/>
</svg>`;
};

// PNG 아이콘 생성
const generateIcon = async (size, filename) => {
  try {
    const svg = createSVG(size);
    const svgBuffer = Buffer.from(svg);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, filename));
    
    console.log(`✅ Generated ${filename} (${size}x${size})`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return false;
  }
};

// 아이콘 생성
const generateIcons = async () => {
  console.log('🎨 Generating PWA icons...');
  console.log(`📁 Output directory: ${publicDir}`);
  
  const results = await Promise.all([
    generateIcon(192, 'icon-192.png'),
    generateIcon(512, 'icon-512.png')
  ]);
  
  if (results.every(r => r)) {
    console.log('✨ All icons generated successfully!');
    console.log('📱 Icons are ready for PWA installation.');
  } else {
    console.error('⚠️ Some icons failed to generate.');
    process.exit(1);
  }
};

generateIcons().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

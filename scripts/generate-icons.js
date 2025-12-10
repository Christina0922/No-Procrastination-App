/**
 * PWA 아이콘 생성 스크립트
 * "미뤄?" + 알람시계 디자인으로 아이콘을 생성합니다.
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

// SVG 아이콘 생성 (미뤄? + 알람시계 디자인)
const createSVG = (size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 텍스트와 아이콘 크기 조정
  const fontSize1 = size * 0.18; // "미뤄?" 텍스트
  const fontSize2 = size * 0.12; // "인생 비어" 텍스트
  const clockSize = size * 0.35; // 시계 크기
  const clockY = centerY - size * 0.05; // 시계 Y 위치
  const text1Y = size * 0.22; // "미뤄?" Y 위치
  const text2Y = size * 0.85; // "인생 비어" Y 위치
  
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 -->
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  
  <!-- "미뤄?" 텍스트 -->
  <text x="${centerX}" y="${text1Y}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize1}" 
        font-weight="bold" 
        fill="#ff6b6b" 
        text-anchor="middle" 
        dominant-baseline="middle">미뤄?</text>
  
  <!-- 알람시계 -->
  <g transform="translate(${centerX}, ${clockY})">
    <!-- 시계 본체 (노란색/금색) -->
    <circle cx="0" cy="0" r="${clockSize * 0.4}" 
            fill="#ffd700" 
            stroke="#333" 
            stroke-width="${size * 0.01}"/>
    
    <!-- 시계 얼굴 (흰색) -->
    <circle cx="0" cy="0" r="${clockSize * 0.32}" 
            fill="#ffffff" 
            stroke="#333" 
            stroke-width="${size * 0.008}"/>
    
    <!-- 시계 벨 (위쪽 두 개) -->
    <circle cx="${-clockSize * 0.25}" cy="${-clockSize * 0.45}" 
            r="${clockSize * 0.12}" 
            fill="#ffd700" 
            stroke="#333" 
            stroke-width="${size * 0.01}"/>
    <circle cx="${clockSize * 0.25}" cy="${-clockSize * 0.45}" 
            r="${clockSize * 0.12}" 
            fill="#ffd700" 
            stroke="#333" 
            stroke-width="${size * 0.01}"/>
    
    <!-- 시계 손 (4시 방향) -->
    <!-- 시침 (짧은 바늘) -->
    <line x1="0" y1="0" 
          x2="${clockSize * 0.15 * Math.cos(-Math.PI / 3)}" 
          y2="${clockSize * 0.15 * Math.sin(-Math.PI / 3)}" 
          stroke="#333" 
          stroke-width="${size * 0.015}" 
          stroke-linecap="round"/>
    
    <!-- 분침 (긴 바늘) -->
    <line x1="0" y1="0" 
          x2="${clockSize * 0.25 * Math.cos(-Math.PI / 2)}" 
          y2="${clockSize * 0.25 * Math.sin(-Math.PI / 2)}" 
          stroke="#333" 
          stroke-width="${size * 0.012}" 
          stroke-linecap="round"/>
    
    <!-- 시계 중심점 -->
    <circle cx="0" cy="0" r="${size * 0.015}" fill="#333"/>
    
    <!-- 그림자 효과 -->
    <ellipse cx="${size * 0.01}" cy="${clockSize * 0.5 + size * 0.01}" 
             rx="${clockSize * 0.3}" 
             ry="${clockSize * 0.1}" 
             fill="#888" 
             opacity="0.3"/>
  </g>
  
  <!-- "인생 비어" 텍스트 -->
  <text x="${centerX}" y="${text2Y}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize2}" 
        font-weight="bold" 
        fill="#000000" 
        text-anchor="middle" 
        dominant-baseline="middle">인생 비어</text>
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

// 아이콘 생성 (다양한 사이즈)
const generateIcons = async () => {
  console.log('🎨 Generating PWA icons with "미뤄?" design...');
  console.log(`📁 Output directory: ${publicDir}`);
  
  const sizes = [
    { size: 192, filename: 'icon-192.png' },
    { size: 512, filename: 'icon-512.png' },
    { size: 180, filename: 'icon-180.png' }, // iOS
    { size: 167, filename: 'icon-167.png' }, // iOS
    { size: 152, filename: 'icon-152.png' }, // iOS
    { size: 120, filename: 'icon-120.png' }, // iOS
    { size: 87, filename: 'icon-87.png' },  // iOS
    { size: 80, filename: 'icon-80.png' },   // iOS
    { size: 76, filename: 'icon-76.png' },   // iOS
    { size: 60, filename: 'icon-60.png' },   // iOS
    { size: 58, filename: 'icon-58.png' },   // iOS
    { size: 40, filename: 'icon-40.png' },   // iOS
    { size: 29, filename: 'icon-29.png' },   // iOS
    { size: 20, filename: 'icon-20.png' }   // iOS
  ];
  
  const results = await Promise.all(
    sizes.map(({ size, filename }) => generateIcon(size, filename))
  );
  
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

// Script para criar ícones placeholder SVG para PWA
// Execute: node create-placeholder-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, 'public');

// Cores AlphaClean
const bgColor = '#022744';
const accentColor = '#9BD60C';

function createSVGIcon(size) {
  const fontSize = size * 0.35;
  const circleRadius = size * 0.3;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${circleRadius}" fill="${accentColor}" opacity="0.2"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${accentColor}" text-anchor="middle" dominant-baseline="middle">AC</text>
</svg>`;
}

// Criar diretório public se não existir
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Gerar ícones SVG
sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(publicDir, filename);

  fs.writeFileSync(filepath, svg);
  console.log(`✓ Criado ${filename}`);
});

// Criar apple-touch-icon
const appleSVG = createSVGIcon(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleSVG);
console.log('✓ Criado apple-touch-icon.svg');

console.log('\n✅ Ícones placeholder criados com sucesso!');
console.log('📝 IMPORTANTE: Substitua os arquivos .svg por .png usando o logo real da AlphaClean');
console.log('📖 Consulte generate-pwa-icons.md para instruções detalhadas');

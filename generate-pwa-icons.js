const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tamanhos de ícones necessários para PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Tamanho especial para Apple Touch Icon
const appleTouchIconSize = 180;

async function generateIcons(inputImage, outputPrefix) {
  console.log(`\nGerando ícones a partir de: ${inputImage}`);
  console.log(`Prefixo de saída: ${outputPrefix}`);

  const publicDir = path.join(__dirname, 'public');

  // Criar diretório public se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Gerar ícones PWA nos tamanhos padrão
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `${outputPrefix}-${size}x${size}.png`);

      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Criado: ${outputPrefix}-${size}x${size}.png`);
    }

    // Gerar Apple Touch Icon
    const appleTouchIconPath = path.join(publicDir, `${outputPrefix}-apple-touch-icon.png`);
    await sharp(inputImage)
      .resize(appleTouchIconSize, appleTouchIconSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(appleTouchIconPath);

    console.log(`✓ Criado: ${outputPrefix}-apple-touch-icon.png`);

    // Gerar favicon 32x32
    const faviconPath = path.join(publicDir, `${outputPrefix}-favicon.png`);
    await sharp(inputImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);

    console.log(`✓ Criado: ${outputPrefix}-favicon.png`);

    console.log(`\n✅ Todos os ícones gerados com sucesso para ${outputPrefix}!`);
  } catch (error) {
    console.error(`❌ Erro ao gerar ícones: ${error.message}`);
    throw error;
  }
}

async function main() {
  const publicDir = path.join(__dirname, 'public');

  const greenLogo = path.join(publicDir, 'alpha-logo-green.png');
  const blueLogo = path.join(publicDir, 'alpha-logo-blue.png');

  console.log('='.repeat(60));
  console.log('🎨 Gerador de Ícones PWA - AlphaClean');
  console.log('='.repeat(60));

  // Verificar se as imagens existem
  if (!fs.existsSync(greenLogo)) {
    console.error(`❌ Arquivo não encontrado: ${greenLogo}`);
    process.exit(1);
  }

  if (!fs.existsSync(blueLogo)) {
    console.error(`❌ Arquivo não encontrado: ${blueLogo}`);
    process.exit(1);
  }

  // Gerar ícones para ambos os logos
  await generateIcons(greenLogo, 'icon-green');
  await generateIcons(blueLogo, 'icon-blue');

  console.log('\n' + '='.repeat(60));
  console.log('✨ Processo concluído! Todos os ícones foram gerados.');
  console.log('='.repeat(60));
  console.log('\nÍcones gerados:');
  console.log('  - icon-green-[tamanho].png (versão verde)');
  console.log('  - icon-blue-[tamanho].png (versão azul)');
  console.log('  - icon-green-apple-touch-icon.png');
  console.log('  - icon-blue-apple-touch-icon.png');
  console.log('  - icon-green-favicon.png');
  console.log('  - icon-blue-favicon.png');
  console.log('\nTamanhos gerados: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512');
}

main().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});

# Guia para Gerar Ícones PWA

## Opção 1: Ferramenta Online (Mais Fácil)

1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload do logo AlphaClean em alta resolução (PNG ou SVG, mínimo 512x512px)
3. Selecione todas as plataformas
4. Baixe o arquivo ZIP com todos os ícones
5. Extraia os arquivos para `AlphaClean/public/`

## Opção 2: Usando ImageMagick (Linha de Comando)

### Instalar ImageMagick
- Windows: https://imagemagick.org/script/download.php#windows
- Mac: `brew install imagemagick`
- Linux: `sudo apt-get install imagemagick`

### Gerar todos os tamanhos

```bash
# Navegue até a pasta AlphaClean
cd AlphaClean/public

# A partir de um logo de alta resolução (exemplo: logo.png de 1024x1024)
magick logo.png -resize 72x72 icon-72x72.png
magick logo.png -resize 96x96 icon-96x96.png
magick logo.png -resize 128x128 icon-128x128.png
magick logo.png -resize 144x144 icon-144x144.png
magick logo.png -resize 152x152 icon-152x152.png
magick logo.png -resize 192x192 icon-192x192.png
magick logo.png -resize 384x384 icon-384x384.png
magick logo.png -resize 512x512 icon-512x512.png

# Gerar apple-touch-icon
magick logo.png -resize 180x180 apple-touch-icon.png

# Gerar favicon
magick logo.png -resize 32x32 favicon-32x32.png
magick logo.png -resize 16x16 favicon-16x16.png
magick logo.png favicon-32x32.png favicon-16x16.png favicon.ico
```

## Opção 3: Usando Sharp (Node.js)

Crie um script `generate-icons.js` na raiz do projeto:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = './public/logo.png'; // Seu logo em alta resolução

async function generateIcons() {
  for (const size of sizes) {
    await sharp(inputFile)
      .resize(size, size)
      .toFile(`./public/icon-${size}x${size}.png`);
    console.log(`✓ Gerado icon-${size}x${size}.png`);
  }

  // Apple touch icon
  await sharp(inputFile)
    .resize(180, 180)
    .toFile('./public/apple-touch-icon.png');
  console.log('✓ Gerado apple-touch-icon.png');

  console.log('\n✅ Todos os ícones foram gerados com sucesso!');
}

generateIcons().catch(console.error);
```

Execute:
```bash
npm install sharp --save-dev
node generate-icons.js
```

## Tamanhos Necessários

- 72x72 - Android Chrome (ldpi)
- 96x96 - Android Chrome (mdpi)
- 128x128 - Android Chrome (hdpi)
- 144x144 - Android Chrome (xhdpi)
- 152x152 - iPad touch icon
- 192x192 - Android Chrome (xxhdpi) - **OBRIGATÓRIO para PWA**
- 384x384 - Android Chrome splash
- 512x512 - Android Chrome splash - **OBRIGATÓRIO para PWA**
- 180x180 - Apple touch icon (iPhone/iPad)

## Dicas de Design

1. **Fundo Sólido**: Use a cor #022744 (azul Alpha Clean) como fundo
2. **Safe Zone**: Mantenha elementos importantes a pelo menos 10% das bordas
3. **Simplicidade**: Ícones devem ser legíveis em tamanhos pequenos
4. **Contraste**: Use o verde #9BD60C para destacar elementos principais
5. **Formato**: PNG com transparência ou fundo sólido

## Screenshots (Opcional, mas recomendado)

Para melhorar a experiência de instalação:

- **Mobile**: 390x844px (portrait)
- **Desktop**: 1920x1080px (landscape)

Salve como:
- `public/screenshot-mobile-1.png`
- `public/screenshot-desktop-1.png`

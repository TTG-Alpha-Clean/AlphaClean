# PWA (Progressive Web App) - AlphaClean

## O que foi implementado

O AlphaClean agora é um **Progressive Web App** completo, permitindo que os usuários instalem o aplicativo em seus dispositivos como se fosse um app nativo.

## Funcionalidades PWA Ativadas

### ✅ Instalação
- **Instalar no Desktop**: Windows, Mac, Linux
- **Adicionar à Tela Inicial**: Android e iOS
- **Atalhos de App**: Ícone na tela inicial como app nativo

### ✅ Cache Inteligente
- **Fontes Google**: Cache de 1 ano
- **Imagens**: Cache de 24 horas com estratégia StaleWhileRevalidate
- **CSS/JS**: Cache de 24 horas
- **API Calls**: NetworkFirst com fallback de cache (timeout 10s)

### ✅ Offline Support
- **Páginas visitadas**: Funcionam offline
- **Assets estáticos**: Carregam do cache
- **Limitação**: Operações que requerem backend não funcionarão offline

### ✅ Atalhos do App
Quando instalado, o app oferece atalhos rápidos:
1. **Novo Agendamento** → `/cliente`
2. **Meus Carros** → `/cliente/carros`
3. **Serviços** → `/servicos`

## Como Testar o PWA

### 1. Build de Produção (IMPORTANTE!)

O PWA **não funciona em modo de desenvolvimento** (`npm run dev`). Você precisa fazer build:

```bash
cd AlphaClean
npm run build
npm start
```

### 2. Acessar via HTTPS

PWA requer **HTTPS** (exceto localhost). Opções:

#### Opção A: Localhost (Mais fácil para teste)
```bash
# Após build, acesse:
http://localhost:3000
```

#### Opção B: Cloudflare Tunnel (Produção)
```bash
cloudflare-tunnel-d2 tunnel --url http://localhost:3000
```

### 3. Testar Instalação no Navegador

#### Google Chrome (Desktop)
1. Abra `http://localhost:3000` (após build)
2. Na barra de endereços, clique no ícone de **instalação** (ícone de computador/celular)
3. Ou: Menu (⋮) → **Instalar AlphaClean**
4. O app abrirá em uma janela separada, sem barra de navegador

#### Google Chrome (Android)
1. Abra o site no Chrome mobile
2. Aguarde o banner "Adicionar à tela inicial"
3. Ou: Menu (⋮) → **Adicionar à tela inicial**
4. O app aparecerá como ícone no menu de apps

#### Safari (iOS)
1. Abra o site no Safari
2. Toque no botão **Compartilhar** (ícone de quadrado com seta)
3. Role para baixo → **Adicionar à Tela de Início**
4. **Nota**: Push notifications não funcionam no iOS

#### Edge (Windows/Mac)
1. Similar ao Chrome
2. Menu (⋯) → **Aplicativos** → **Instalar AlphaClean**

### 4. Verificar Service Worker

No Chrome DevTools:

1. Pressione **F12**
2. Vá para aba **Application**
3. No menu esquerdo:
   - **Service Workers**: Deve aparecer `/sw.js` ativo
   - **Manifest**: Verifique metadados do app
   - **Cache Storage**: Veja os caches criados

### 5. Testar Offline

1. No Chrome DevTools → **Application** → **Service Workers**
2. Marque a caixa **Offline**
3. Recarregue a página
4. O app deve carregar páginas visitadas anteriormente

## Arquivos Gerados

Após o build, os seguintes arquivos são criados automaticamente:

```
public/
├── sw.js              # Service Worker principal (gerado automaticamente)
├── workbox-*.js       # Bibliotecas Workbox (geradas automaticamente)
├── manifest.json      # Metadados PWA (você criou)
├── icon-*.svg         # Ícones do app (placeholder - SUBSTITUIR!)
└── apple-touch-icon.svg
```

**IMPORTANTE**: Os arquivos `sw.js` e `workbox-*.js` são gerados pelo `next-pwa` durante o build e já estão no `.gitignore`. Não edite manualmente!

## Substituir Ícones Placeholder

Os ícones SVG atuais são **placeholders temporários**. Para usar o logo real:

### Método 1: Ferramenta Online (Recomendado)
1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Upload do logo AlphaClean (PNG de alta resolução, mínimo 512x512px)
3. Baixe o ZIP com todos os tamanhos
4. Substitua os arquivos em `public/`
5. Atualize `manifest.json` para usar `.png` em vez de `.svg`

### Método 2: Script Automático
```bash
cd AlphaClean
node generate-icons.js
```

Consulte [generate-pwa-icons.md](./generate-pwa-icons.md) para instruções detalhadas.

## Configurações Principais

### [next.config.mjs](./next.config.mjs)
```javascript
import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',                              // Onde gerar SW
  disable: process.env.NODE_ENV === 'development',  // Desabilita em dev
  register: true,                              // Auto-registra SW
  skipWaiting: true,                           // Ativa novo SW imediatamente
  runtimeCaching: [...]                        // Estratégias de cache
});
```

### [manifest.json](./public/manifest.json)
```json
{
  "name": "AlphaClean - Lavagem de Carros",
  "short_name": "AlphaClean",
  "display": "standalone",                     // Modo app nativo
  "background_color": "#022744",               // Azul Alpha
  "theme_color": "#022744",                    // Cor da barra de status
  "icons": [...],                              // Ícones em vários tamanhos
  "shortcuts": [...]                           // Atalhos rápidos
}
```

### [src/app/layout.tsx](./src/app/layout.tsx)
```typescript
export const metadata: Metadata = {
  manifest: "/manifest.json",                  // Referência ao manifest
  applicationName: "AlphaClean",
  appleWebApp: {
    capable: true,                             // Suporte iOS
    statusBarStyle: "default",
    title: "AlphaClean",
  },
  // ...
};
```

## Estratégias de Cache Implementadas

| Recurso | Estratégia | Cache Time | Descrição |
|---------|-----------|------------|-----------|
| Google Fonts (webfonts) | CacheFirst | 1 ano | Fontes são imutáveis |
| Google Fonts (CSS) | StaleWhileRevalidate | 1 semana | CSS pode mudar |
| Imagens (JPG, PNG, SVG) | StaleWhileRevalidate | 24 horas | Mostra cache, atualiza em background |
| Next.js Images | StaleWhileRevalidate | 24 horas | Imagens otimizadas |
| JavaScript | StaleWhileRevalidate | 24 horas | Scripts de app |
| CSS | StaleWhileRevalidate | 24 horas | Estilos |
| API Calls (GET) | NetworkFirst | 24 horas | Prioriza rede, fallback cache |
| Outras páginas | NetworkFirst | 24 horas | Prioriza rede |

## Troubleshooting

### PWA não aparece como instalável
1. ✅ Verifique se está usando **HTTPS** ou **localhost**
2. ✅ Rode `npm run build && npm start` (não `npm run dev`)
3. ✅ Verifique no DevTools → Application → Manifest
4. ✅ Certifique-se que tem ícones 192x192 e 512x512

### Service Worker não registra
1. ✅ Limpe cache: DevTools → Application → Clear storage
2. ✅ Verifique se `NODE_ENV=production` (dev desabilita PWA)
3. ✅ Veja erros no Console
4. ✅ Desregistre SW antigos: Application → Service Workers → Unregister

### Cache não atualiza
1. ✅ Force atualização: Application → Service Workers → Update
2. ✅ Marque "Update on reload"
3. ✅ Limpe cache manualmente: Application → Cache Storage → Delete

### Ícones não aparecem
1. ✅ Verifique se os arquivos existem em `public/`
2. ✅ Valide `manifest.json` no DevTools
3. ✅ Use PNG em vez de SVG para melhor compatibilidade
4. ✅ Certifique-se dos tamanhos corretos (192x192, 512x512)

## Melhorias Futuras (Opcional)

### Push Notifications
Adicione notificações push para:
- Lembrete de agendamentos
- Status de serviço concluído
- Promoções e ofertas

```javascript
// Exemplo básico (requer backend)
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission();
}
```

### Background Sync
Envie dados quando voltar online:
```javascript
// Em sw.js customizado
self.addEventListener('sync', event => {
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
});
```

### Add to Home Screen Banner
Customize o prompt de instalação:
```javascript
// Em layout.tsx
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar seu próprio botão de instalação
});
```

## Recursos

- [Next.js PWA Docs](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox Docs](https://developer.chrome.com/docs/workbox/)
- [Can I Use PWA](https://caniuse.com/?search=pwa)

## Compatibilidade

| Navegador | Desktop | Mobile | Notificações |
|-----------|---------|--------|--------------|
| Chrome | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ⚠️ Limitado | ⚠️ Limitado | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ |

⚠️ Safari (iOS): Suporta instalação, mas não push notifications

## Checklist de Deployment

Antes de fazer deploy em produção:

- [ ] Substituir ícones placeholder por logos reais da AlphaClean
- [ ] Adicionar screenshots (opcional, mas recomendado)
- [ ] Testar instalação em múltiplos navegadores
- [ ] Verificar HTTPS funcionando (Cloudflare Tunnel)
- [ ] Validar manifest.json: https://manifest-validator.appspot.com/
- [ ] Testar offline mode
- [ ] Lighthouse PWA audit (score > 90)
- [ ] Atualizar `start_url` em manifest.json se necessário
- [ ] Configurar cache headers no servidor

## Lighthouse PWA Audit

Para validar a qualidade do PWA:

1. Chrome DevTools → **Lighthouse** (aba)
2. Selecione **Progressive Web App**
3. Clique em **Generate report**
4. **Meta**: Score > 90

---

**Implementado em**: 2025-10-22
**Versão**: 1.0.0
**Status**: ✅ Pronto para testes

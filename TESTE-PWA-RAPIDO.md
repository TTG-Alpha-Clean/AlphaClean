# 🚀 Teste Rápido do PWA - AlphaClean

## ⚡ Início Rápido (5 minutos)

### 1. Build e Start (2 min)

```bash
cd AlphaClean
npm run build
npm start
```

Aguarde mensagem:
```
✓ Ready in XXXms
○ Local:   http://localhost:3000
```

### 2. Abra no Chrome (1 min)

```
http://localhost:3000
```

### 3. Verifique PWA (2 min)

#### Verificar Service Worker:
1. Pressione **F12** (DevTools)
2. Aba **Application**
3. **Service Workers** (menu esquerdo)
4. Deve aparecer: `http://localhost:3000/sw.js` - **activated and is running**

#### Verificar Manifest:
1. Ainda em **Application**
2. **Manifest** (menu esquerdo)
3. Deve mostrar:
   - **Name**: AlphaClean - Lavagem de Carros
   - **Short name**: AlphaClean
   - **Start URL**: /
   - **Theme color**: #022744
   - **Icons**: 8 ícones SVG

#### Verificar Cache:
1. Ainda em **Application**
2. **Cache Storage** (menu esquerdo)
3. Deve aparecer:
   - `alphaclean-v1` (cache estático)
   - `alphaclean-runtime` (cache dinâmico - após navegar)

### 4. Testar Instalação

#### Ícone na Barra de Endereços:
- Procure ícone de **instalação** (⊕ ou 💻)
- Clique → **Instalar**
- O app abre em janela separada, sem barra do navegador!

#### Ou via Menu:
- Menu Chrome (⋮) → **Instalar AlphaClean**

### 5. Testar Offline (Opcional)

1. Navegue por algumas páginas:
   - Login
   - Serviços
   - Registro

2. DevTools → **Application** → **Service Workers**
3. Marque **Offline**
4. Recarregue a página (**Ctrl+R**)
5. **Deve funcionar!** (páginas já visitadas)

## ✅ Checklist de Sucesso

Após seguir os passos, você deve ter:

- [x] Service Worker ativo (`/sw.js`)
- [x] Manifest carregado com metadados AlphaClean
- [x] Caches criados (`alphaclean-v1` e `alphaclean-runtime`)
- [x] Ícone de instalação visível
- [x] PWA instalável e funcionando
- [x] Páginas funcionam offline (após visitar)

## 🐛 Problemas Comuns

### Service Worker não aparece
**Solução**:
```bash
# Certifique-se de estar em modo produção
npm run build && npm start
# (NÃO use npm run dev)
```

### Ícone de instalação não aparece
**Solução**:
1. Verifique console (F12) para erros
2. Certifique-se que manifest.json está acessível: `http://localhost:3000/manifest.json`
3. Limpe cache: DevTools → Application → Clear storage

### Cache não funciona
**Solução**:
```bash
# Force atualização do SW
DevTools → Application → Service Workers → Update
# Ou marque "Update on reload"
```

## 📱 Testar no Mobile (Opcional)

### Android (Chrome):

1. No computador, exponha via Cloudflare Tunnel:
   ```bash
   cloudflare-tunnel-d2 tunnel --url http://localhost:3000
   ```

2. Acesse URL gerada no celular
3. Banner "Adicionar à tela inicial" deve aparecer
4. Ou: Menu → "Adicionar à tela inicial"

### iOS (Safari):

1. Exponha via Cloudflare Tunnel (mesmo processo)
2. Safari → Botão Compartilhar
3. "Adicionar à Tela de Início"

## 🎯 Próximos Testes Completos

Consulte documentação completa:
- [PWA-README.md](./PWA-README.md) - Guia completo
- [PWA-IMPLEMENTACAO-FINAL.md](./PWA-IMPLEMENTACAO-FINAL.md) - Detalhes técnicos

## 🔧 Comando de Teste Completo

```bash
# Limpeza, build e teste
cd AlphaClean
rm -rf .next node_modules/.cache
npm run build
npm start

# Em outro terminal, verifique Service Worker
curl http://localhost:3000/sw.js
curl http://localhost:3000/manifest.json
```

## 📊 Validação Lighthouse (Avançado)

```bash
# No Chrome DevTools
1. Aba Lighthouse
2. Selecione "Progressive Web App"
3. Click "Generate report"
4. Meta: Score > 90
```

---

**Tempo total**: ~5 minutos
**Dificuldade**: Fácil
**Resultado**: PWA funcionando localmente

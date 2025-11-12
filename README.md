# AlphaClean - Frontend

Sistema de gerenciamento de agendamentos para serviços de limpeza automotiva.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Configuração](#configuração)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [PWA (Progressive Web App)](#pwa-progressive-web-app)
- [Contribuindo](#contribuindo)

## Sobre o Projeto

AlphaClean é uma aplicação web moderna construída com Next.js que permite aos clientes agendar serviços de limpeza automotiva e aos administradores gerenciar agendamentos, clientes e serviços. A aplicação oferece uma experiência completa tanto para desktop quanto para dispositivos móveis, incluindo suporte PWA.

## Tecnologias

- **Framework**: [Next.js 15.4.6](https://nextjs.org/) - React Framework com App Router
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/) - Type Safety
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**:
  - [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
  - [Lucide React](https://lucide.dev/) - Ícones
- **Requisições HTTP**: [Axios](https://axios-http.com/) - Cliente HTTP
- **Notificações**: [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- **Gráficos**: [Recharts](https://recharts.org/) - Biblioteca de gráficos
- **QR Code**: [qrcode](https://www.npmjs.com/package/qrcode) - Geração de QR codes
- **Email**: [EmailJS](https://www.emailjs.com/) - Envio de emails
- **PWA**: [next-pwa](https://www.npmjs.com/package/next-pwa) - Progressive Web App

## Estrutura do Projeto

```
AlphaClean/
├── public/                      # Arquivos estáticos
│   ├── manifest.json           # Manifesto PWA
│   ├── sw.js                   # Service Worker
│   └── icon-*.png              # Ícones PWA (múltiplos tamanhos)
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── admin/             # Páginas administrativas
│   │   │   ├── clientes/      # Gerenciamento de clientes
│   │   │   ├── configuracoes/ # Configurações do sistema
│   │   │   ├── manual/        # Manual do administrador
│   │   │   ├── relatorios/    # Relatórios e análises
│   │   │   ├── servicos-site/ # Gerenciamento de serviços
│   │   │   ├── layout.tsx     # Layout do admin
│   │   │   └── page.tsx       # Dashboard admin
│   │   ├── cliente/           # Páginas do cliente
│   │   │   ├── carros/        # Gerenciamento de veículos
│   │   │   ├── configuracoes/ # Configurações do cliente
│   │   │   ├── manual/        # Manual do cliente
│   │   │   └── page.tsx       # Dashboard cliente
│   │   ├── esqueci-senha/     # Recuperação de senha
│   │   ├── login/             # Autenticação
│   │   ├── redefinir-senha/   # Redefinição de senha
│   │   ├── register/          # Cadastro de usuários
│   │   ├── servicos/          # Catálogo de serviços
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Página inicial
│   │   └── register-sw.tsx    # Registro do Service Worker
│   ├── components/            # Componentes reutilizáveis
│   │   ├── forms/            # Formulários
│   │   ├── lists/            # Listas de dados
│   │   ├── modals/           # Modais
│   │   ├── navigation/       # Navegação (headers, menus)
│   │   └── ui/               # Componentes UI básicos
│   ├── lib/                  # Utilitários e helpers
│   └── styles/               # Estilos globais
├── .gitignore                # Arquivos ignorados pelo Git
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
├── tailwind.config.ts        # Configuração Tailwind
└── next.config.js            # Configuração Next.js
```

## Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/TTG-Alpha-Clean/AlphaClean.git
cd AlphaClean
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env.local na raiz do projeto
# Adicione as seguintes variáveis:

NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=seu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=sua_public_key
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com Turbopack
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter ESLint

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | Sim |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | ID do serviço EmailJS | Sim |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | ID do template EmailJS | Sim |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Chave pública EmailJS | Sim |

### Configuração do PWA

O manifesto PWA está localizado em `public/manifest.json` e inclui:
- Configurações de ícones para diferentes tamanhos
- Tema e cores de fundo
- Modo de exibição standalone
- Orientação de tela

## Funcionalidades

### Área do Cliente

- **Dashboard**: Visão geral dos agendamentos
- **Agendamentos**: Criar, visualizar e gerenciar agendamentos
- **Veículos**: Cadastrar e gerenciar veículos
- **Serviços**: Visualizar catálogo de serviços disponíveis
- **Perfil**: Gerenciar dados pessoais e configurações
- **Manual**: Guia de uso da plataforma

### Área do Administrador

- **Dashboard**: Analytics e métricas do negócio
- **Clientes**: Gerenciar usuários e seus dados
- **Agendamentos**: Visualizar e gerenciar todos os agendamentos
- **Serviços**: CRUD de serviços oferecidos
- **Relatórios**: Gerar relatórios de faturamento e performance
- **Configurações**: Configurações do sistema e WhatsApp
- **Manual**: Guia administrativo

### Funcionalidades Gerais

- **Autenticação**: Login, registro e recuperação de senha
- **Notificações**: Sistema de notificações em tempo real
- **PWA**: Instalável como aplicativo nativo
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Dark/Light Mode**: Suporte a temas (quando configurado)

## Arquitetura

### Padrões de Design

1. **Componentização**: Componentes reutilizáveis e modulares
2. **Separation of Concerns**: Separação clara entre UI, lógica e dados
3. **Type Safety**: TypeScript para prevenir erros em tempo de compilação
4. **Server/Client Components**: Otimização de performance com Next.js 15

### Estrutura de Componentes

```typescript
// Exemplo de estrutura de componente
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Lógica do componente
  return (
    // JSX
  );
}
```

### State Management

- **Local State**: React hooks (useState, useReducer)
- **Context API**: Para estados compartilhados entre componentes
- **Server State**: Gerenciado via requisições HTTP com Axios

### Roteamento

O projeto utiliza o App Router do Next.js 15:
- Roteamento baseado em sistema de arquivos
- Layouts compartilhados
- Loading states e error boundaries
- Parallel routes para dashboards

## PWA (Progressive Web App)

### Características

- **Instalável**: Pode ser instalado no dispositivo do usuário
- **Offline**: Service Worker para funcionalidade offline básica
- **Performance**: Cache inteligente de assets
- **Mobile-First**: Otimizado para dispositivos móveis

### Instalação do PWA

1. Acesse a aplicação no navegador
2. Clique no ícone de "Instalar" na barra de endereços
3. Confirme a instalação
4. O app será adicionado à tela inicial

### Service Worker

O Service Worker (`public/sw.js`) gerencia:
- Cache de assets estáticos
- Estratégias de cache (Network First, Cache First)
- Sincronização em background (quando aplicável)

## Boas Práticas Implementadas

### Performance

- **Code Splitting**: Carregamento dinâmico de componentes
- **Image Optimization**: Uso de next/image para otimização
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoization**: React.memo e useMemo quando necessário

### Acessibilidade

- **Semantic HTML**: Uso correto de tags HTML
- **ARIA Labels**: Atributos ARIA para screen readers
- **Keyboard Navigation**: Navegação completa por teclado
- **Color Contrast**: Contraste adequado de cores

### Segurança

- **Environment Variables**: Variáveis sensíveis em .env
- **HTTPS**: Comunicação segura com backend
- **Input Validation**: Validação de dados no cliente
- **XSS Prevention**: Sanitização de inputs

### Code Quality

- **ESLint**: Linting para manter código consistente
- **TypeScript**: Type safety em todo o projeto
- **Component Structure**: Componentes pequenos e focados
- **Naming Conventions**: Nomenclatura clara e consistente

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines

- Siga os padrões de código existentes
- Escreva commits descritivos
- Teste suas alterações antes de commitar
- Atualize a documentação quando necessário

## Licença

Este projeto é privado e proprietário da Alpha Clean.

## Desenvolvedores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Leofrancaa">
        <img src="https://github.com/Leofrancaa.png" width="100px;" alt="Leonardo França"/><br />
        <sub><b>Leonardo Franca</b></sub>
      </a><br />
      <a href="https://github.com/Leofrancaa" title="GitHub">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/guissx">
        <img src="https://github.com/guissx.png" width="100px;" alt="Guilherme"/><br />
        <sub><b>Gustavo Cabral</b></sub>
      </a><br />
      <a href="https://github.com/guissx" title="GitHub">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/GustavoCunh4">
        <img src="https://github.com/GustavoCunh4.png" width="100px;" alt="Gustavo Cunha"/><br />
        <sub><b>Luiz Gustavo Cunha</b></sub>
      </a><br />
      <a href="https://github.com/GustavoCunh4" title="GitHub">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/GustavoD15">
        <img src="https://github.com/GustavoD15.png" width="100px;" alt="Gustavo Dias"/><br />
        <sub><b>Gustavo Diniz</b></sub>
      </a><br />
      <a href="https://github.com/GustavoD15" title="GitHub">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/marialuizaqueiroz">
        <img src="https://github.com/marialuizaqueiroz.png" width="100px;" alt="Maria Luiza Queiroz"/><br />
        <sub><b>Maria Luiza Queiroz</b></sub>
      </a><br />
      <a href="https://github.com/marialuizaqueiroz" title="GitHub">💻</a>
    </td>
  </tr>
</table>

## Contato

**Alpha Clean Team** - [@TTG-Alpha-Clean](https://github.com/TTG-Alpha-Clean)

**Link do Projeto:** [AlphaClean](https://github.com/TTG-Alpha-Clean/AlphaClean)

---

<div align="center">

**Desenvolvido por:**

[Leonardo Franca](https://github.com/Leofrancaa) • [Gustavo Cabral](https://github.com/guissx) • [Luiz Gustavo Cunha](https://github.com/GustavoCunh4) • [Gustavo Diniz](https://github.com/GustavoD15) • [Maria Luiza Queiroz](https://github.com/marialuizaqueiroz)

</div>

# AnyPay - Banking Application

**Projeto desenvolvido para o Hackathon ACG 2024**

Um aplicativo bancário simplificado e moderno com foco em gerenciamento de cartões e contas, construído com as mais recentes tecnologias web.

---

## 👥 Autores

- **Alamo Souza**
- **Luiz Gustavo**
- **Gustavo Ramos**
- **André Dutra**

---

## 📋 Sobre o Projeto

AnyPay é uma aplicação frontend de banco simplificada desenvolvida como parte de um desafio de hackathon. O projeto foca em:

- Gerenciamento de cartões bancários
- Gerenciamento de contas
- Visualização de saldos
- Interface responsiva e mobile-first
- Experiência de usuário moderna e intuitiva

---

## 🚀 Tecnologias

Este projeto utiliza um stack moderno e performático:

- **React 18** com **Vite** - Framework e build tool
- **TypeScript** - Type safety
- **TanStack Router** - Roteamento file-based
- **TanStack Query (React Query)** - Data fetching e cache
- **Zustand** - State management leve
- **Axios** - Cliente HTTP
- **shadcn/ui** - Componentes UI (Radix UI primitives)
- **Tailwind CSS** - Estilização utility-first
- **React Hook Form + Zod** - Gerenciamento e validação de formulários
- **next-themes** - Suporte a dark/light mode

---

## 📁 Estrutura do Projeto

```
/src
  /components       - Componentes React
    /ui            - Componentes shadcn/ui base
    /custom        - Componentes customizados
    /layout        - Layouts (Header, Sidebar, etc.)
    /cards         - Componentes de cartões
    /accounts      - Componentes de contas
  /hooks           - Custom hooks (lógica de negócio)
  /services        - TanStack Query services (cache + fetch)
  /repositories    - Camada de acesso a dados (API calls)
  /models          - Types/Interfaces TypeScript
  /stores          - Zustand global state
  /lib             - Utilitários e configurações
  /routes          - TanStack Router file-based routes
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd bankard-2.0-main

# Instale as dependências
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview da Build de Produção

```bash
npm run preview
```

---

## 🧪 Testes

```bash
npm run test
```

---

## 🎨 Adicionando Componentes UI

Este projeto usa shadcn/ui. Para adicionar novos componentes:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

---

## 📱 Design Responsivo

Todo o projeto foi desenvolvido com abordagem **mobile-first**, garantindo uma experiência perfeita em todos os dispositivos:

- Mobile: 320px+
- Tablet: 640px+ (sm)
- Desktop: 1024px+ (lg)

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas simplificada:

```
View (Components) → Hooks → Services (TanStack Query) → Repositories → API
```

### Padrões de Código

- **No Zod for API**: Apenas TypeScript types para respostas de API
- **Zod only for forms**: Validação de input do usuário
- **Mobile-first**: Sempre começar com layout mobile
- **Keep it simple**: Evitar over-engineering

---

## 🔗 Roteamento

O projeto usa **TanStack Router** com roteamento baseado em arquivos. As rotas são gerenciadas automaticamente através de arquivos na pasta `src/routes`.

Para adicionar uma nova rota, basta criar um novo arquivo em `./src/routes/` e o TanStack Router irá gerar automaticamente a configuração.

---

## 📚 Documentação Adicional

Para mais detalhes sobre a arquitetura e padrões do projeto, consulte o arquivo [CLAUDE.md](./CLAUDE.md).

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um hackathon educacional.

---

## 🤝 Contribuições

Projeto desenvolvido durante o Hackathon ACG 2025 pela equipe mencionada acima.

---

**Desenvolvido com ❤️ para o Hackathon ACG 2025**

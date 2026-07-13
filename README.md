# Pista de Presentes do Noah 🏎️

Lista de presentes para o aniversário de 2 aninhos do Noah — tema Carros / Relâmpago McQueen. Os convidados escolhem um presentinho, marcam como comprado e o site atualiza a "pista" em tempo real.

## Tecnologias

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **canvas-confetti** (animação de confete na confirmação)
- **Docker / Docker Compose** (desenvolvimento local)
- Deploy: **Vercel**

## Estrutura do projeto

```
.
├── prisma/
│   ├── schema.prisma        # Models Item e Purchase
│   └── seed.ts              # Carga inicial dos presentes
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Fonte + metadata/SEO
│   │   ├── page.tsx         # Home (server component, busca itens)
│   │   ├── globals.css      # Estilos globais
│   │   ├── api/purchases/   # Rota POST de confirmação de compra
│   │   ├── robots.ts        # robots.txt
│   │   ├── sitemap.ts       # sitemap.xml
│   │   ├── manifest.ts      # PWA manifest
│   │   └── icon.svg         # Favicon
│   ├── components/          # CategoryHeader, GiftBoard, GiftCard, etc.
│   └── lib/                 # prisma, types, format, categories
├── docker-compose.yml
├── Dockerfile
├── vercel.json
└── next.config.mjs
```

## Como rodar (local, com Docker)

```bash
docker compose up --build
```

Acesse: http://localhost:3000

## Como rodar (local, sem Docker)

> Requer Node 20+ e um Postgres acessível.

```bash
npm install
cp .env.example .env        # ajuste DATABASE_URL
npm run prisma:push         # cria as tabelas
npm run seed                # carrega os presentes
npm run dev
```

## Como gerar o build

```bash
npm run build
npm run start
```

## Variáveis de ambiente

| Variável              | Descrição                                            | Exemplo                                            |
| --------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| `DATABASE_URL`        | Connection string do Postgres                        | `postgresql://postgres:postgres@localhost:5432/db` |
| `NEXT_PUBLIC_SITE_URL`| URL pública do site (SEO/OG/sitemap)                 | `https://meu-projeto.vercel.app`                   |

Veja `.env.example`. **Nunca** commite `.env` com valores reais.

## Como publicar na Vercel

1. Faça push do repositório para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente (`DATABASE_URL` e `NEXT_PUBLIC_SITE_URL`).
   - Recomendado: crie um **Vercel Postgres** ou use Neon/Supabase e cole a connection string em `DATABASE_URL`.
4. Deploy. A Vercel executa `npm install` (que dispara `postinstall: prisma generate`) e `npm run build`.
5. Após o primeiro deploy, sincronize o banco e carregue os presentes:

```bash
npm install -g vercel
vercel link
vercel env pull .env              # baixa as envs da Vercel para .env local
npm run db:deploy                 # prisma db push + seed
```

## Scripts

| Script             | Descrição                              |
| ------------------ | -------------------------------------- |
| `dev`              | Ambiente de desenvolvimento            |
| `build`            | `prisma generate` + build de produção  |
| `start`            | Sobe o servidor de produção            |
| `lint`             | ESLint (flat config)                   |
| `typecheck`        | `tsc --noEmit`                          |
| `prisma:push`      | Sincroniza o schema com o banco        |
| `db:deploy`        | `prisma db push` + seed                |
| `seed`             | Carrega os presentes                   |

## Observações

- Itens sem `imageUrl` exibem um placeholder visual (emoji da categoria) — não é necessário fazer upload de imagens.
- Os preços foram removidos da interface; o campo `priceCents` permanece no banco por compatibilidade.

---

Feito com 💛 para o Noah virar 2 em grande estilo. 🏎️🏁
# Memorial Digital CIPASO

> Centro de Investigação Parapsicológica de Sorocaba — acervo histórico e memorial digital

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## Sobre

Site estático que preserva o acervo do CIPASO (1989–2016) e o trabalho do Prof. Valter Álfredo
Franceschini: 240 colunas de parapsicologia publicadas no Diário de Sorocaba e no Jornal
Ipanema entre 1997 e 2006, artigos transcritos e registros audiovisuais.

Não há banco de dados nem backend: o conteúdo vive no repositório e é transformado em JSON por
scripts de geração durante o build.

### O que o site faz

- **Acervo consultável** — busca, filtro por origem, ordenação cronológica e leitor de PDF no navegador.
- **Catalogação automática** — o texto dos PDFs é lido para extrair título, data e veículo de publicação.
- **Artigos** — Markdown em `posts/`, renderizado sem `dangerouslySetInnerHTML`.
- **Tema claro/escuro** — aplicado antes da primeira pintura, sem flash.
- **Acessibilidade** — navegação por teclado, foco visível, contraste AA verificado (axe-core sem violações).
- **SEO** — canônicas, Open Graph, JSON-LD (Organization, Article, BreadcrumbList) e sitemaps gerados.
- **PWA** — instalável, com o shell da aplicação em cache (o acervo fica sob demanda).

---

## Uso

```bash
npm install
npm run dev        # http://localhost:5173
```

### Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção em dist/
npm run preview    # testa o build local
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run generate   # regenera acervo, blog e sitemaps
npm run catalog    # relê os PDFs e atualiza os metadados do acervo
npm run assets     # regera ícones do PWA e imagem Open Graph
```

---

## Estrutura

```
posts/                        artigos em Markdown (fonte do blog)
public/uploads/               acervo digitalizado (PDFs, vídeo)
public/.htaccess              rotas do SPA, cache e cabeçalhos no Apache
scripts/
  generateFilesJson.js        varre uploads/ e monta o acervo
  catalogPublications.js      extrai título, data e veículo dos PDFs
  generateBlogJson.js         lê posts/*.md e monta o blog
  generateSitemap.js          sitemaps de páginas, artigos e PDFs
  generateBrandAssets.js      ícones do PWA e imagem Open Graph
src/
  components/                 layout, UI, acervo e blog
  data/                       JSON gerado + citações + overrides do acervo
  lib/                        utilidades, tema, markdown e movimento
  pages/                      Home, Acervo, Blog, BlogPost, About, Legal, NotFound
  index.css                   design system (tokens, tipografia, componentes)
```

Para editar conteúdo, veja **[README-EDICAO.md](README-EDICAO.md)**.

---

## Deploy

Push na `main` dispara `.github/workflows/deploy.yml`: lint, build e envio de `dist/` por FTP
para a Hostinger. O deploy nativo por Git da Hostinger não resolve sozinho porque não executa
`npm run build` — o build fica no CI e só o resultado é publicado.

- Envio incremental: a cada deploy sobem apenas os arquivos alterados.
- `uploads/` fica fora do envio automático (67 MB já presentes no servidor, e nada é apagado lá).
  Ao adicionar itens ao acervo, rode o workflow manualmente marcando **sincronizar_acervo**.
- Ao final, o workflow confere se `https://cipaso.com` responde 200.

Secrets: `HOSTINGER_HOST`, `HOSTINGER_USER` e `HOSTINGER_PASS` (credenciais de FTP).
Opcionais: secret `HOSTINGER_FTP_PORT` (padrão 21) e variables `HOSTINGER_FTP_PATH`
(padrão `public_html/`) e `HOSTINGER_FTP_PROTOCOL` (padrão `ftps`).

---

## Decisões técnicas

- **Sem backend** — acervo histórico não muda com frequência; build estático elimina superfície de ataque e custo.
- **Dados gerados no build** — o repositório é a fonte da verdade; o gerador falha o build se `posts/` tiver arquivos inválidos, em vez de publicar um blog vazio.
- **Metadados do acervo em camadas** — `acervo.overrides.json` (manual) tem prioridade sobre `acervo.catalogo.json` (extraído dos PDFs), que tem prioridade sobre o nome do arquivo.
- **Rotas com carregamento sob demanda** — só a home entra no bundle inicial.
- **Movimento contido** — animações curtas, com respeito a `prefers-reduced-motion`.

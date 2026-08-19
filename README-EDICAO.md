# Guia de edição — Memorial CIPASO

O site é estático: não há banco de dados nem painel administrativo. Todo o conteúdo vem de
arquivos do repositório, e scripts de geração transformam esses arquivos nos dados que a
aplicação consome.

```
posts/*.md                     → src/data/blog.json        (artigos)
public/uploads/**              → src/data/files.json       (acervo)
src/data/acervo.catalogo.json  → metadados lidos dos PDFs
src/data/acervo.overrides.json → correções manuais do acervo
src/data/quotes.ts             → citações do dia
```

Depois de qualquer alteração de conteúdo, rode `npm run generate` (o `npm run dev` e o
`npm run build` já fazem isso automaticamente).

---

## 1. Publicar um artigo

Crie um arquivo `.md` em `posts/` com frontmatter:

```md
---
titulo: Título do artigo
slug: titulo-do-artigo
resumo: Uma linha que aparece na listagem e nos resultados de busca.
autor: Prof. Valter Franceschini
data: 2026-01-24
categoria: pesquisa
tags: parapsicologia, mente, pesquisa
---

Texto do artigo em Markdown: parágrafos, `## títulos`, listas com `-`,
citações com `>`, **negrito** e [links](https://exemplo.com).
```

Regras que o gerador aplica:

- `categoria` precisa ser `pesquisa`, `desenvolvimento` ou `institucional`.
- `data` no formato `AAAA-MM-DD`.
- `slug` define a URL (`/blog/slug`); se omitido, é derivado do título.
- O tempo de leitura é calculado automaticamente.
- Se houver arquivos em `posts/` e nenhum for válido, o build falha — em vez de publicar
  um blog vazio silenciosamente.

Verifique com `npm run update-blog`.

---

## 2. Adicionar itens ao acervo

1. Coloque o arquivo na pasta correspondente:

```
public/uploads/
├── documentos/   → PDFs de texto
├── imagens/      → JPG, PNG, WebP
├── audios/       → MP3, WAV, M4A
├── videos/       → MP4, WebM
├── hemeroteca/   → recortes de jornal
└── publicacoes/  → colunas e publicações em PDF
```

2. Rode `npm run update-files`. O item aparece no acervo automaticamente — nada precisa
   ser registrado à mão.

### De onde vêm título, data e origem

Os PDFs das colunas contêm o texto original. O comando `npm run catalog` lê cada PDF e grava
`src/data/acervo.catalogo.json` com título, data de publicação, veículo e um resumo. Rode-o
sempre que adicionar novos PDFs:

```bash
npm run catalog       # lê os PDFs e atualiza o catálogo
npm run update-files  # regenera o acervo com os novos metadados
```

### Corrigir metadados à mão

Para ajustar qualquer item, edite `src/data/acervo.overrides.json` usando o **nome do arquivo**
como chave. O que estiver aqui tem prioridade sobre o catálogo automático:

```json
{
  "paraps01-05.pdf": {
    "titulo": "Erros ou experiências de aprendizado?",
    "data": "2001-03-28",
    "descricao": "Coluna sobre o medo de errar como causa da inação.",
    "serie": "Diário de Sorocaba"
  }
}
```

Use `"data": null` quando não houver data conhecida.

---

## 3. Citações do dia

Edite `src/data/quotes.ts`. A citação exibida é escolhida pelo dia do ano — todos os
visitantes veem a mesma no mesmo dia.

```ts
export const quotes: Quote[] = [
  { id: 1, content: 'Texto da citação.', author: 'Prof. Valter Franceschini' }
]
```

---

## 4. Aparência

As cores e a tipografia ficam em `src/index.css`, no bloco de variáveis `:root` (tema claro)
e `.dark` (tema escuro):

```css
:root {
  --paper: #f7f4ef;      /* fundo */
  --ink: #16181a;        /* texto */
  --brand: #5cbdbf;      /* turquesa institucional */
  --brand-ink: #0e6a6d;  /* turquesa com contraste para texto e botões */
}
```

Ao mudar qualquer cor, confira o contraste (mínimo 4.5:1 para texto). As fontes são
`Sutro W01` (títulos) e `Inter` (texto).

Para trocar as fotos do Prof. Valter, substitua os arquivos em `src/assets/png/vaf/`.

Se o logotipo mudar, rode `npm run assets` para regerar os ícones do PWA e a imagem de
compartilhamento (`public/og-image.png`).

---

## 5. Comandos

```bash
npm run dev        # servidor local
npm run build      # build de produção em dist/
npm run preview    # testa o build local
npm run lint       # análise estática
npm run typecheck  # checagem de tipos
npm run generate   # regenera acervo, blog e sitemaps
npm run catalog    # relê os PDFs e atualiza o catálogo do acervo
npm run assets     # regera ícones PWA e imagem Open Graph
```

---

## 6. Publicação

O deploy é automático: todo push na branch `main` dispara o workflow
`.github/workflows/deploy.yml`, que roda lint, build e envia `dist/` por FTP para a Hostinger.

- O envio é incremental: só sobe o que mudou desde o último deploy.
- O acervo (`uploads/`) **não** vai no deploy do dia a dia. Depois de adicionar arquivos novos,
  abra **Actions → Deploy cipaso.com → Run workflow** e marque *sincronizar_acervo*.
- Ao final, o workflow confere se `https://cipaso.com` responde 200.

Secrets no repositório: `HOSTINGER_HOST`, `HOSTINGER_USER` e `HOSTINGER_PASS` (FTP).
Se a porta de FTP não for a 21, crie o secret `HOSTINGER_FTP_PORT`. Se o site não estiver em
`public_html/`, crie a variable `HOSTINGER_FTP_PATH`.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Aminus é um app desktop interno (Electron 36 + React 19 + Vite 6) para consultar e editar dados do ERP: produtos, reservas, pedidos, notas fiscais, clientes, fotos de catálogo, cadastro web e disparo de WhatsApp. A UI e os comentários são em português.

- Todo o código é **JavaScript (ESM)**, tipado só com **JSDoc** (`@typedef`, `@param`). Não há TypeScript nem `tsconfig`. Quando precisar de tipos, siga o padrão de JSDoc já usado.
- O estilo é **CSS puro** em [src/styles/](src/styles/), com um arquivo por página ou componente. Não há Tailwind.
- O MongoDB não é mais usado. As fotos já vivem no MySQL `catalog` (veja abaixo).

## Comandos

```bash
npm run dev:electron   # desenvolvimento: Vite (5173) + Electron, que carrega http://localhost:5173
npm run dev            # só o Vite (o renderer sem window.api não funciona fora do Electron)
npm run build          # build do renderer para dist/ (o app empacotado carrega dist/index.html)
npm run lint           # ESLint
npm run release        # build + electron-forge make (instalador Squirrel no Windows)
npm run publish-app    # build + publica release no GitHub (Larand26/Aminus); lê GITHUB_TOKEN do .env via dotenv-cli
```

Não há suíte de testes. [electron/test/test.js](electron/test/test.js) é um script manual e desatualizado (ainda usa ids do MongoDB).

Mudanças em `electron/` não recarregam com o HMR do Vite (o watcher ignora a pasta), então é preciso reiniciar o `dev:electron`. Versões: `npm version` gera os commits `X.Y.Z`. O app empacotado se atualiza sozinho pelas releases do GitHub (`update-electron-app`).

## Arquitetura

### Fluxo de uma chamada

```
React page/component
  → src/utils/<Domínio>.js         (wrapper estático: chama window.api.*, normaliza {success, data, error})
  → electron/preload.js            (contextBridge expõe window.api; contextIsolation on, nodeIntegration off)
  → electron/ipc.js                (ipcMain.handle: valida o JWT e checa a role)
  → electron/src/controllers/*     (try/catch fino → {success:false, error, message})
  → electron/src/services/*        (regra de negócio + SQL)
  → electron/src/repositories/*    (só fotos/catalog)
  → electron/src/database/*        (pools)
```

Para criar um endpoint novo é preciso mexer em **três lugares**: o handler em `ipc.js`, o método em `preload.js` e o wrapper em `src/utils/`. Os nomes dos canais são kebab-case (`get-photos`) e os métodos do `window.api` são camelCase (`getPhotos`).

### Auth e roles

O login compara a senha (em maiúsculas) com a tabela `USUARIOS` do MySQL principal. [JwtService](electron/src/services/JwtService.js) assina o token com `JWT_SECRET`. O renderer guarda `token` e `user` no `localStorage` e envia `token` em todo `args`. Em `ipc.js`, cada handler chama `MiddlewaresToken.decodeToken(args.token)`:
- `role === 1` é admin (o único que acessa `get-date-reservation`).
- `role === 2` é vendedor: o handler força `args.filters.sellerName = username` em reservas, notas e pedidos.
- Só as roles `[1, 3]` podem criar, editar ou excluir fotos.

### Três bancos

- **SQL Server (ERP)**, [SQLServerDB.js](electron/src/database/SQLServerDB.js), env `DB_*`: produtos, pedidos, notas, clientes, reservas. As queries base ficam em [electron/src/database/queries/*.sql](electron/src/database/queries/). Os services leem esses arquivos e injetam as condições `WHERE` no lugar do comentário `-- Os filtros serão adicionados aqui pelo Node.js`, usando um `FILTER_MAP` (`{ condition, transform }`) com parâmetros nomeados `@param`.
- **MySQL principal**, `MySQLDB.query` (`execute`), env `MYSQL_*`: usuários/login e contatos do WhatsApp.
- **MySQL `catalog`**, `MySQLDB.catalogQuery` / `catalogTransaction`, env `MYSQL_CATALOG_DATABASE`: catálogo de fotos com as tabelas `products`, `manufacturers`, `colors` e `photos`. Atenção ao nome real da coluna, **`manufactur_code`** (sem "er"), que [PhotoRepository](electron/src/repositories/PhotoRepository.js) expõe com o alias `manufacturer_code`.

### Fotos

- [PhotoRepository](electron/src/repositories/PhotoRepository.js) faz o JOIN produto→fabricante→cor→fotos e agrupa as linhas em `CatalogProduct` com `photos: [{id_photo, url, position}]`.
- [PhotoService](electron/src/services/PhotoService.js) recebe de `photos[]` tanto URLs já gravadas quanto data URLs base64 de fotos novas, na ordem de exibição. Com `sharp`, redimensiona para 1200x1200 e, quando `apply_eva` está ligado, aplica o selo [EVA.svg](electron/src/assets/EVA.svg) na 1ª foto.
- [PhotosApiService](electron/src/services/PhotosApiService.js) é o cliente da photos-api externa (env `PHOTOS_API_URL`, `PHOTOS_API_TOKEN`), que grava no S3 e serve em `GET /images/{chave}`. A chave segue o formato `{manufacturer_code}/{color_code}/{manufacturer_code}_{color_code}_{position}.jpg`. Algumas fotos migradas têm extensão `.png`/`.webp`, por isso `urlMatchesKey` ignora a extensão.
- No front, [src/utils/Photo.js](src/utils/Photo.js) (`getPhotoUrls` ordena por `position`), [src/pages/Photos.jsx](src/pages/Photos.jsx), [src/components/photos/](src/components/photos/) e [PopupEditPhoto.jsx](src/components/popups/PopupEditPhoto.jsx).

### Outras integrações

Frete via Frenet (`FRENET_API_KEY`), WhatsApp via servidor WPPConnect (`WPP_CONNECT_API_URL`, com progresso enviado pelo evento `progressUpdate` / `window.api.onProgressUpdate`), PDF de cubagem com jsPDF, gerado no main process.

### Configuração e ambiente

Cada `electron/src/config/*Config.js` chama [loadEnv.js](electron/src/config/loadEnv.js), que procura o `.env` na raiz do repo, no `cwd`, em `process.resourcesPath` e ao lado do executável. O `.env` vai junto no pacote (`extraFiles` no `package.json`). O renderer não tem acesso a env: tudo que depende de segredo passa pelo IPC.

### Renderer

`HashRouter` (necessário para `loadFile` no app empacotado), com rotas em [src/App.jsx](src/App.jsx). Cada página em [src/pages/](src/pages/) mantém o próprio estado e chama os wrappers de `src/utils/`. Não há store global nem hooks customizados.

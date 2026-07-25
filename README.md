# Formulário de Prospecção de Clientes

Formulário multilíngue (PT/ES/EN) para cadastro de prospects, que gera um
link de convite e grava cada cadastro automaticamente em uma planilha do
Google Sheets.

## Arquivos

- `index.html` — o formulário em si (HTML + Tailwind + JS puro, sem dependências de build).
- `google-apps-script.gs` — script a ser colado no editor do Google Apps Script, vinculado à planilha.

## Passo a passo: conectar a planilha do Google

A planilha usada é esta:
https://docs.google.com/spreadsheets/d/1rLOb7Yd2cCy6AyU0rwTu2GkHbL-1LhKIYb60ktTNJ9Q/edit

1. Abra a planilha e vá em **Extensões > Apps Script**.
2. Apague o conteúdo do arquivo padrão `Code.gs` e cole o conteúdo de
   `google-apps-script.gs` deste repositório.
3. No topo do script, defina um valor para `SHARED_SECRET` (uma senha
   simples qualquer, ex: `mel-2026-x9k`).
4. Clique em **Implantar > Nova implantação**.
   - Tipo: **App da Web**.
   - Executar como: **Eu** (sua conta Google, dona da planilha).
   - Quem pode acessar: **Qualquer pessoa**.
5. Autorize as permissões pedidas (a primeira vez o Google mostra um aviso
   de app não verificado — isso é normal para scripts próprios; clique em
   "Avançado" > "Acessar [nome do script] (não seguro)").
6. Copie a URL gerada, que termina em `/exec`.
7. Abra `index.html` e, no topo da tag `<script>`, preencha:
   ```js
   const CONFIG = {
     GOOGLE_SCRIPT_URL: "COLE_AQUI_A_URL_QUE_TERMINA_EM_/exec",
     SHARED_SECRET: "mel-2026-x9k" // o mesmo valor do passo 3
   };
   ```
8. Pronto. Cada envio (por e-mail ou SMS) grava uma linha na aba
   `Prospects` da planilha, com data/hora, nome, sobrenome, e-mail,
   telefone, região/idioma, tipo de membro, método de envio e o link do
   convite gerado.

**Importante:** sempre que você editar `google-apps-script.gs` depois da
primeira implantação, é preciso ir em **Implantar > Gerenciar implantações**
e publicar uma nova versão — só salvar o script não atualiza o app da Web
já publicado.

## Sobre o "SHARED_SECRET"

Como o `index.html` pode ficar público no GitHub, qualquer pessoa que veja
o código também verá a URL do Apps Script e o valor do `SHARED_SECRET`.
Isso não é uma proteção forte — é só um filtro simples para reduzir envios
automatizados/spam de quem não tem acesso ao código. Para uma proteção
mais séria, seria necessário um backend próprio validando a origem das
requisições.

## Publicando no GitHub

Este formulário não precisa de build (é só HTML/CSS/JS estático), então dá
para publicar direto como GitHub Pages:

1. Crie o repositório no GitHub e suba os arquivos deste projeto.
2. Antes de subir, confira se `CONFIG.GOOGLE_SCRIPT_URL` e
   `CONFIG.SHARED_SECRET` já estão preenchidos com os valores corretos
   (ou deixe-os como placeholders se preferir configurar depois, direto no
   arquivo publicado).
3. Em **Settings > Pages** do repositório, ative o GitHub Pages apontando
   para a branch principal (pasta raiz ou `/docs`, dependendo de onde você
   colocar o `index.html`).
4. O link do GitHub Pages já será o formulário funcionando publicamente.

## O que foi melhorado em relação à versão anterior

- Integração com Google Sheets via Google Apps Script (novo).
- Validação de cada campo com mensagem de erro individual, em vez de um
  único alerta genérico.
- Botões de envio ficam desabilitados e mostram "Enviando..." durante a
  chamada à planilha, evitando cliques duplicados.
- Aviso no modal caso a gravação na planilha falhe, para o vendedor saber
  que precisa anotar o cadastro manualmente.
- Botão "Novo cadastro" no modal para limpar o formulário rapidamente e
  cadastrar o próximo prospect.
- Cópia do link do convite usando a API moderna do clipboard, com
  fallback para navegadores antigos.
- Melhorias de acessibilidade: `label for`, `aria-live` no alerta de erro,
  `role="dialog"` no modal, foco automático ao abrir/fechar o modal.
- Pequena limpeza de código (remoção de textos de tradução não utilizados).

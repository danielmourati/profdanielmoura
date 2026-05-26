## Objetivo

Restringir o acesso às áreas de **Flashcards** e **Avaliação Diagnóstica** apenas a usuários autenticados, e adicionar na seção home de Flashcards um botão "Iniciar treinamento grátis" equivalente ao da seção de diagnóstico. Após o cadastro, o usuário deve ser redirecionado de volta para a área desejada automaticamente.

## Mudanças

### 1. Seção Flashcards na home (`src/components/site/Flashcards.tsx`)
- Adicionar um CTA destacado "Iniciar treinamento grátis" abaixo do título, no mesmo estilo visual do botão da seção de diagnóstico (`FreeEval.tsx`).
- O botão usa `<Link to="/flashcards">` do TanStack Router.

### 2. Guarda de autenticação nas rotas protegidas
Aplicar verificação de login (em `component`, lendo `useAuth()`) nas rotas:
- `src/routes/flashcards.tsx`
- `src/routes/avaliacao.index.tsx`
- `src/routes/avaliacao.$slug.tsx`

Quando `!loading && !user`, renderizar um bloco "Acesso exclusivo para alunos cadastrados" com botões **Entrar** e **Criar conta grátis** apontando para `/login?redirect=<rota-atual>`.

### 3. Redirect-back no login (`src/routes/login.tsx`)
- Ler `?redirect=` da URL (via `useSearch` ou `window.location`).
- Após login OU cadastro bem-sucedido, navegar para o `redirect` (se existir), senão para `/`.
- Isso garante que, ao concluir o cadastro vindo de `/flashcards` ou `/avaliacao`, o usuário cai direto na área desejada.

### 4. (Opcional, recomendado) Auto-confirm de email
Para que o cadastro permita uso imediato sem precisar confirmar email, habilitar `auto_confirm_email` via `configure_auth`. Sem isso, o usuário precisa clicar no link do email antes de logar.

## Detalhes técnicos

- Usar o `useAuth()` existente em `src/lib/auth-context.tsx` (já fornece `user` e `loading`).
- Os CTAs de login preservam a rota de origem via query param `redirect`, padrão recomendado pelo TanStack Router.
- Nenhuma alteração de schema/RLS é necessária — as tabelas já permitem leitura pública; o gating é apenas de UX no frontend.

## Pergunta

Devo habilitar **auto-confirm de email** (usuário acessa imediatamente após cadastro, sem clicar link no email)? Sem isso, o fluxo "concluir cadastro e iniciar imediatamente" exige que o usuário verifique o email primeiro.
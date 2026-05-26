## Plano

### 1. Campo WhatsApp no cadastro
- Adicionar coluna `phone` (text, nullable) na tabela `profiles` via migration.
- Atualizar trigger `handle_new_user` para gravar `phone` de `raw_user_meta_data->>'phone'`.
- Em `src/routes/login.tsx`: novo input de celular/WhatsApp (apenas no modo signup), com máscara simples `(99) 99999-9999` e validação. Passar em `options.data.phone` no `signUp`.

### 2. Área do usuário (`/minha-area`) expandida
Reorganizar `src/routes/minha-area.tsx` em abas/seções:
- **Perfil**: editar `display_name` e `phone` (update em `profiles`). Mostrar email (read-only) + botão "Alterar senha" (envia `resetPasswordForEmail`).
- **Avaliações**: histórico de `assessment_attempts` (já existente) + gráfico de evolução.
- **Flashcards**: nova seção mostrando sessões de flashcards realizadas.
  - Requer nova tabela `flashcard_sessions` (user_id, category_id, level, total, correct, wrong, duration_seconds, created_at) com RLS por usuário.
  - Salvar sessão ao final do teste em `src/routes/flashcards.tsx` (insert quando user logado).

### 3. Admin → Usuários (`/admin/users`)
- Nova rota `src/routes/admin.users.tsx` ligada ao menu lateral em `src/routes/admin.tsx`.
- Listagem de usuários consultando `profiles` + `user_roles` (join) + status de bloqueio.
- Server functions (`createServerFn` + `supabaseAdmin` + middleware admin) para operações privilegiadas:
  - `listUsers` — combina `profiles`, `auth.admin.listUsers()` (para email/banned_until/last_sign_in) e `user_roles`.
  - `resetUserPassword({userId})` — usa `supabaseAdmin.auth.admin.generateLink({type:'recovery'})` e envia por email (ou retorna link).
  - `toggleUserBlock({userId, block})` — `supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: block ? '876000h' : 'none' })`.
  - `deleteUser({userId})` — `supabaseAdmin.auth.admin.deleteUser(userId)` (cascata remove profile/roles via FK ON DELETE).
- Middleware `requireAdmin` que estende `requireSupabaseAuth` e verifica `has_role(userId,'admin')`.
- UI da tabela com colunas: Nome, Email, WhatsApp, Papel, Status, Último acesso, Ações (Reset senha / Bloquear-Desbloquear / Excluir com confirmação).

### 4. Banco de dados (migrations)
```sql
-- 1. Phone em profiles
ALTER TABLE public.profiles ADD COLUMN phone text;

-- 2. Atualizar handle_new_user para incluir phone
-- (recriar função)

-- 3. Tabela flashcard_sessions
CREATE TABLE public.flashcard_sessions (
  id uuid PK default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid,
  category_name text,
  level text,
  total int not null,
  correct int not null,
  wrong int not null,
  duration_seconds int,
  created_at timestamptz default now()
);
GRANT SELECT, INSERT ON public.flashcard_sessions TO authenticated;
GRANT ALL ON public.flashcard_sessions TO service_role;
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
-- Policies: user vê/insere os próprios; admin vê todos.

-- 4. FKs com ON DELETE CASCADE em profiles.id → auth.users(id) e user_roles.user_id → auth.users(id) (se ainda não existir) para que delete user remova dados.
```

### 5. Arquivos a criar/alterar
- **migration** (campos profiles + tabela flashcard_sessions + trigger).
- `src/routes/login.tsx` — input phone.
- `src/routes/minha-area.tsx` — abas Perfil / Avaliações / Flashcards.
- `src/routes/flashcards.tsx` — gravar sessão ao final.
- `src/lib/admin-users.functions.ts` — server fns admin.
- `src/routes/admin.users.tsx` — UI de gestão.
- `src/routes/admin.tsx` — adicionar item "Usuários" no menu.

### Perguntas antes de implementar
1. **Bloqueio**: usar "ban" do Supabase (sem login até desbloqueio) ou apenas flag visual? → Plano usa ban nativo.
2. **Reset de senha** pelo admin: enviar email automaticamente ao usuário, ou copiar link para o admin compartilhar? → Plano sugere envio por email (`resetPasswordForEmail`).
3. **WhatsApp obrigatório** no signup, ou opcional? → Plano sugere opcional.

Se concordar com essas decisões, posso seguir para implementação.
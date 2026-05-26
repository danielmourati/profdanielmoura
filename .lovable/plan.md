## Resumo

Vou ativar o **Lovable Cloud** (banco + autenticação) para sustentar toda a área administrativa, transformar Flashcards, Downloads, Produtos, Depoimentos e Avaliação Diagnóstica em conteúdo dinâmico gerenciado pelo admin, e ajustar o menu/hero conforme pedido.

## Decisões assumidas (já que as perguntas foram puladas)

- **Backend**: Lovable Cloud ativado (Postgres + Auth + Storage).
- **Admin**: login email/senha, gate por tabela `user_roles` com role `admin` (padrão seguro, sem escalonamento de privilégio).
- **Aluno/Concurseiro**: cadastro **opcional** — pode fazer avaliação anônima (sem histórico) ou logado (histórico salvo).
- **Avaliação Diagnóstica**: admin cria provas com categoria, dificuldade, lista de perguntas (múltipla escolha com alternativa correta) e faixas de score customizáveis com mensagens de feedback.

Se preferir outra configuração, me avise ao revisar o plano.

---

## 1. Ajustes rápidos no site público

- Remover **"Apostila ACS 2026"** do menu principal (`Nav.tsx`). A seção `Apostila.tsx` continua no site, só o item de menu sai.
- Reduzir o título principal do Hero para **80px** no desktop (mantendo escala responsiva menor em mobile/tablet).

## 2. Lovable Cloud — modelagem do banco

Tabelas no schema `public` (todas com RLS + grants):

```text
profiles               id (uuid = auth.users.id), display_name, created_at
user_roles             id, user_id, role ('admin' | 'user')  [unique user_id+role]

flashcard_categories   id, name, slug, order_index, created_at
flashcards             id, category_id, question, answer,
                       difficulty ('facil'|'medio'|'dificil'), order_index

products               id, title, description, price_cents, image_url,
                       checkout_url, badge, features (jsonb), active, order_index

downloads              id, title, description, file_url, file_size, file_type,
                       icon, order_index, active

testimonials           id, name, role, content, avatar_url, rating,
                       order_index, active

assessments            id, title, description, slug, active, created_at
assessment_questions   id, assessment_id, question, options (jsonb [{id,text}]),
                       correct_option_id, order_index
score_bands            id, assessment_id, min_score, max_score,
                       label, message, color
assessment_attempts    id, user_id (nullable), assessment_id, score,
                       total_questions, correct_count, band_label,
                       answers (jsonb), created_at
```

**RLS resumida**:
- Leitura pública (anon + authenticated) das tabelas de conteúdo (`flashcard_*`, `products`, `downloads`, `testimonials`, `assessments`, `assessment_questions`, `score_bands`) filtrando `active = true` onde aplicável.
- Escrita (insert/update/delete) **apenas** para `has_role(auth.uid(), 'admin')`.
- `assessment_attempts`: insert permitido para qualquer um (anon ou auth); select restrito ao próprio usuário (`user_id = auth.uid()`) e ao admin.
- `profiles`: select/update apenas pelo dono; insert via trigger no signup.
- Função `has_role(uuid, app_role)` security definer (padrão Lovable) para checagens sem recursão.

**Storage**: bucket `downloads` (público) e bucket `products` (público) para upload de arquivos e imagens pelo admin.

**Seed**: migra os dados estáticos atuais (flashcards, depoimentos, produtos, download Excel) para as tabelas para o site não ficar vazio.

## 3. Autenticação

- Páginas públicas: `/login` (email/senha + signup do aluno) e `/reset-password`.
- Listener `onAuthStateChange` no root + invalidação de cache.
- O primeiro admin é promovido manualmente via SQL após signup (instrução incluída no plano de execução).

## 4. Área Admin (`/admin/*`)

Protegida por layout `_authenticated/_admin` que verifica `has_role(uid,'admin')` via server function. Estrutura:

- `/admin` — dashboard com contadores (flashcards, downloads, tentativas, etc.).
- `/admin/flashcards` — CRUD de categorias e cards, com seletor de dificuldade (Fácil/Médio/Difícil).
- `/admin/products` — CRUD de produtos digitais com upload de imagem.
- `/admin/downloads` — CRUD com upload do arquivo direto pro Storage.
- `/admin/testimonials` — CRUD de depoimentos.
- `/admin/assessments` — CRUD de avaliações:
  - editor de perguntas (múltipla escolha) com alternativa correta;
  - editor de faixas de score (min/max → label + mensagem + cor).
- `/admin/attempts` — histórico de todas as tentativas (filtro por avaliação/aluno).

UI: tabelas (shadcn `table`), `dialog` para criar/editar, `react-hook-form` + `zod` para validação, toasts de feedback.

## 5. Páginas públicas dedicadas

- `/flashcards` — página exclusiva com **3 níveis de dificuldade** (tabs Fácil/Médio/Difícil) + seleção de categoria. A seção atual no Home vira teaser com botão "Treinar agora" linkando para `/flashcards`.
- `/downloads` — página exclusiva listando todos os arquivos cadastrados (Home mantém um destaque com os mais recentes).
- `/avaliacao` — fluxo:
  1. Aluno escolhe avaliação ativa.
  2. (Opcional) faz login para salvar histórico, ou continua anônimo.
  3. Responde questões (uma por vez ou em lista).
  4. Vê resultado: score, acertos/erros, faixa atingida com mensagem ("você foi bem", "quase lá", etc.) e cor.
  5. Se logado: `/minha-area` mostra histórico de tentativas com gráfico de evolução.
- Depoimentos, Produtos e Apostila no Home passam a renderizar dados do banco via TanStack Query.

## 6. Server functions

Todas as leituras públicas via `createServerFn` + `supabaseAdmin` (com filtros seguros). Escritas admin via `createServerFn` + `requireSupabaseAuth` validando role. `assessment_attempts.insert` aceita anônimo e autenticado.

## Detalhes técnicos

- TanStack Start já configurado; usar layouts `_authenticated.tsx` e `_authenticated/_admin.tsx`.
- `attachSupabaseAuth` em `src/start.ts` (verificar se já existe; caso contrário, adicionar).
- Query: `ensureQueryData` no loader + `useSuspenseQuery` no componente.
- Form admin com `react-hook-form` + `zod`.
- Charts do histórico: `recharts` (já comum em Lovable).
- Upload via `supabase.storage.from(bucket).upload(...)` direto do client autenticado admin.

## Entregáveis

1. Lovable Cloud ativado + migrações com tabelas, RLS, grants, função `has_role`, trigger de profile, seeds.
2. Buckets de Storage criados.
3. Páginas de auth (`/login`, `/reset-password`, `/minha-area`).
4. Área `/admin/*` completa com CRUDs.
5. Páginas públicas `/flashcards`, `/downloads`, `/avaliacao`.
6. Home refatorado consumindo o banco; item "Apostila ACS 2026" removido do menu; hero ajustado para 80px.
7. Instruções no chat sobre como promover o primeiro admin.

Posso seguir com a implementação?

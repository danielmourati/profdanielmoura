# Banco de Questões com Filtros, Resolução e Diagnóstico

## Contexto

Hoje `/admin/assessments` gerencia "avaliações diagnósticas" (provas com slug fixo, 20 questões, score_bands). O pedido novo é diferente: um **banco de questões** estilo QConcursos, com muitos metadados (disciplina, órgão, ano, banca, cargo, etc.), filtros para o aluno e diagnóstico automático no fim de uma sessão.

São dois domínios distintos. Em vez de poluir as tabelas existentes, vou criar um sistema novo paralelo: `/admin/questions` (admin) e `/banco-de-questoes` (aluno). As avaliações com slug continuam intactas.

## 1. Banco de dados (migração)

Tabelas novas:

**`questions`** — banco principal
- `statement` (texto), `comment` (explicativo)
- `option_a, option_b, option_c, option_d` (text NOT NULL), `option_e` (text NULL)
- `correct_option` (char, 'a'..'e')
- `discipline, subject, area, exam, organization, city, role, education, banca` (text)
- `year` (int), `difficulty` (enum: facil | medio | dificil)
- `active` (bool, default true)
- timestamps

**`question_attempts`** — uma linha por questão respondida pelo aluno
- `user_id`, `question_id`, `picked_option` (char), `is_correct` (bool)
- `discipline, subject, difficulty` (denormalizados pra agregação rápida)
- `session_id` (uuid — agrupa as questões de uma sessão de estudo)
- `created_at`

RLS:
- `questions`: leitura pública (anon+auth), escrita só admin
- `question_attempts`: insert/select próprio (auth.uid), admin vê tudo

Índices em `discipline`, `subject`, `area`, `organization`, `year`, `difficulty`, `active` pra filtros rápidos.

GRANTs explícitos em ambas (anon select em questions; authenticated CRUD em attempts; service_role tudo).

## 2. Admin — `/admin/questions`

Nova rota usando o `CrudTable` existente, com todos os campos do enunciado. Campos longos (statement, comment, alternativas) como textarea; difficulty/correct_option/active como select/checkbox; year como number.

Link no `/admin/index.tsx` ("Banco de Questões").

## 3. Aluno — `/banco-de-questoes`

Rota nova com `AuthGate`. Layout:

**Topo — filtros** (sidebar à esquerda em desktop, collapsible em mobile):
- Campo de pesquisa (busca em statement)
- Selects: disciplina, assunto, área, certame, órgão, cidade, cargo, ano, escolaridade, dificuldade
- Opções dos selects vêm de `distinct` no banco (uma query agregada inicial)
- Botão "Iniciar sessão" → busca questões filtradas, gera `session_id` (uuid), entra no modo resolução

**Modo resolução** (card único por vez, navegação prev/next):
- Mostra enunciado + alternativas clicáveis (A–E)
- Ao clicar: chama RPC `answer_question(question_id, session_id, picked)` → insere em `question_attempts`, retorna `is_correct + correct_option + comment`
- Mostra feedback: ✓/✗, gabarito destacado, bloco de comentário
- Botão "Próxima"
- Botão "Encerrar sessão" → vai pra tela de diagnóstico

**Diagnóstico final** (mesma rota, após encerrar):
- Lê `question_attempts WHERE session_id = X`
- Calcula: total, acertos, erros, % aproveitamento
- Agrupa por discipline, subject, difficulty (% cada)
- Mostra mensagem do diagnóstico 1/2/3 conforme % global
- CTA: "Ver cursos recomendados" → `/#produtos`

## 4. RPC `answer_question` (SECURITY DEFINER)

Evita que o cliente veja `correct_option` antes de responder. Recebe `(question_id, session_id, picked_option)`, lê a questão, calcula `is_correct`, insere em `question_attempts` com `user_id = auth.uid()`, retorna `{ is_correct, correct_option, comment }`. Sem isso, teríamos que expor o gabarito no select público — má prática (segue mesmo padrão de `submit_assessment` já usado no projeto).

Também crio uma view `questions_public` (sem `correct_option` nem `comment`) pro listing/resolução do aluno.

## 5. Detalhes técnicos

- Diagnóstico calculado client-side a partir dos attempts da sessão (simples).
- Filtros: query com `.ilike` no statement + `.eq` nos demais; só aplicar filtros não-vazios.
- Mensagens dos 3 diagnósticos vão hardcoded no componente (são fixas no enunciado).
- Não mexo no fluxo de `assessments` existente — esse continua sendo a "avaliação diagnóstica de Noções de Informática".

## Fora do escopo

- Cursos recomendados dinâmicos (uso os `products` já existentes, com link genérico)
- Importação em lote de questões (admin cadastra uma por vez via UI)
- Histórico de sessões anteriores na `/minha-area` (posso adicionar depois se quiser)

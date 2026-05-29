## Situação atual

A infraestrutura de avaliação diagnóstica **já está pronta** no projeto:

- Tabelas: `assessments`, `assessment_questions`, `score_bands`, `assessment_attempts`
- RPC seguro `submit_assessment` (corrige no servidor, evita trapaça)
- Rotas públicas: `/avaliacao` (lista) e `/avaliacao/$slug` (faz a prova com barra de progresso, resultado, faixa colorida)
- Admin: `/admin/assessments` (CRUD) e `/admin/assessments/$id` (perguntas + faixas)
- Histórico do usuário em `/minha-area`

Ou seja, **não precisa codar nada novo** — só popular o conteúdo da avaliação "Noções de Informática".

## Plano

### 1. Criar a avaliação via admin
Em `/admin/assessments` cadastrar:
- **Título:** Noções de Informática
- **Slug:** `nocoes-informatica`
- **Descrição:** curta, explicando o objetivo diagnóstico
- **Ativa:** sim

### 2. Definir as 4 faixas de resultado (score em %)
Em `/admin/assessments/{id}`:

| Faixa | Label | Cor | Mensagem |
|---|---|---|---|
| 0–40% | Iniciante | vermelho | Recomendar curso básico + apostila |
| 41–60% | Em desenvolvimento | amarelo | Recomendar flashcards + revisão |
| 61–80% | Intermediário | azul | Sugerir avaliações específicas |
| 81–100% | Avançado | verde | Parabéns + sugerir conteúdos avançados |

### 3. Cadastrar as 20 questões
Cobrindo tópicos clássicos de concurso: hardware, software, Windows, Word, Excel, navegadores, e-mail, segurança, redes, atalhos. 4 alternativas (a–d), uma correta.

> Posso gerar as 20 questões prontas (enunciado + alternativas + gabarito) e inserir tudo de uma vez via migração SQL para não ter que digitar uma a uma no admin. Confirme se quer assim.

### 4. Link de acesso na home
Adicionar um destaque/CTA na home (`src/routes/index.tsx`) apontando para `/avaliacao/nocoes-informatica` para o visitante encontrar a avaliação.

## Detalhes técnicos

- O componente `/avaliacao/$slug` lê `assessment_questions_public` (view sem `correct_option_id`) — gabarito nunca vai pro cliente.
- A correção e gravação da tentativa acontecem no RPC `submit_assessment` (SECURITY DEFINER) — já alinhado com a memória do projeto.
- Resultado mostra score %, acertos/total e a faixa correspondente automaticamente.
- Usuário precisa estar logado (já tratado pelo `AuthGate`) — assim a tentativa fica salva no histórico.

## O que decidir antes de implementar

1. **Faixas e mensagens:** confirma as 4 acima ou prefere outras (ex.: 3 faixas, mensagens com link direto pra produtos)?
2. **Questões:** quer que eu gere as 20 questões e insira via SQL, ou prefere cadastrar manualmente pelo admin?
3. **CTA na home:** adiciono um bloco/botão "Faça o diagnóstico gratuito" ou deixo só acessível via `/avaliacao`?
# CRUD completo das questões da Avaliação Diagnóstica

## Objetivo
Permitir que o administrador cadastre, visualize, edite e exclua as questões de cada avaliação diagnóstica na tela **Perguntas & Faixas**.

## Alterações
- Reaproveitar o formulário de pergunta tanto para criação quanto para edição.
- Adicionar uma ação **Editar** em cada questão, carregando no formulário o enunciado, as quatro alternativas e a resposta correta.
- Implementar o salvamento das alterações no banco e atualizar imediatamente a lista exibida.
- Manter a criação atual, com validação de enunciado, alternativas preenchidas e resposta correta.
- Manter a exclusão com confirmação e mensagens claras de sucesso ou erro.
- Exibir estados de salvamento e impedir envios repetidos enquanto a operação estiver em andamento.
- Preservar o gerenciamento existente das faixas de score e o fluxo público de realização da avaliação.

## Validação
- Testar criar, visualizar, editar e excluir uma pergunta como administrador.
- Confirmar que a questão editada aparece corretamente na avaliação do aluno.
- Verificar a tela em desktop e celular e confirmar que não há erros de compilação ou execução.

## Detalhes técnicos
- As operações continuarão protegidas pelas permissões administrativas já aplicadas às questões de avaliação.
- A lista será atualizada pela invalidação da consulta `assessment_questions` após cada alteração.
- A edição preservará o formato atual das alternativas e o campo `order_index` da questão.

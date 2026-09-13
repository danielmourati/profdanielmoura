# Imagem nos flashcards

## Objetivo
Permitir que cada flashcard tenha uma imagem opcional, definida por upload ou por URL, e mostrar essa imagem junto da pergunta durante o treinamento.

## Cadastro administrativo
- Adicionar ao formulário de novo/editar flashcard um campo de upload de imagem e um campo de URL.
- Os dois controles alimentarão a mesma imagem do flashcard; conforme definido, o último preenchido terá prioridade.
- Exibir uma prévia da imagem selecionada e permitir limpar ou substituir a imagem antes de salvar.
- Manter categoria, dificuldade, pergunta, resposta e ordem como já funcionam.

## Treinamento
- Na frente do flashcard, apresentar a pergunta e, quando existir, a imagem associada.
- Manter o verso reservado à resposta e preservar o toque para virar, cronômetro e botões atuais.
- Ajustar a composição para imagens horizontais ou verticais sem deformação e sem ultrapassar o espaço do card.
- Quando não houver imagem, manter a apresentação atual da pergunta.

## Dados e arquivos
- Adicionar um campo opcional de URL de imagem aos flashcards existentes, sem alterar os registros atuais.
- Criar um espaço público específico para as imagens enviadas e permitir upload somente para administradores.
- Manter URLs externas compatíveis com o mesmo campo.

## Validação
- Testar criação e edição por upload e por URL, incluindo a regra “último preenchido vence”.
- Confirmar prévia, substituição e remoção da imagem.
- Verificar pergunta com e sem imagem em telas grandes e pequenas.
- Confirmar que os flashcards continuam sendo filtrados, embaralhados e registrados normalmente.

## Detalhes técnicos
- Alterar a tabela `flashcards` com a coluna opcional `image_url` via migração.
- Estender o formulário reutilizável para suportar o seletor combinado de upload e URL sem duplicar valores salvos.
- Atualizar os tipos gerados e a renderização da frente do flashcard.

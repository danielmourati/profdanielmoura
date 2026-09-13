# Organizar flashcards por categorias

## Objetivo
Deixar os flashcards claramente separados por categoria tanto no painel administrativo quanto no treinamento do aluno, preservando as categorias e os conteúdos já cadastrados.

## Painel administrativo
- Manter o cadastro, edição, ordenação e exclusão de categorias existente.
- Substituir a listagem única de flashcards por grupos identificados pelo nome da categoria.
- Exibir em cada grupo a quantidade de flashcards e suas perguntas, respostas e níveis.
- Permitir expandir e recolher cada categoria para facilitar a navegação em listas grandes.
- Manter as ações de criar, editar e excluir flashcards; o formulário continuará exigindo a escolha da categoria.
- Atualizar imediatamente o grupo correto após salvar, editar ou excluir um flashcard.

## Treinamento do aluno
- Após a escolha do nível, apresentar as categorias como opções visuais separadas e organizadas.
- Mostrar somente categorias que possuem flashcards no nível escolhido, evitando iniciar uma sessão vazia.
- Exibir a quantidade de flashcards disponível em cada categoria.
- Manter a opção “Todas” para treinar todas as categorias disponíveis naquele nível.
- Preservar o fluxo atual: nível → categoria → tempo → iniciar, além da ordem aleatória, cronômetro e histórico.

## Validação
- Conferir criação, edição, mudança de categoria e exclusão no painel.
- Confirmar que os grupos e contadores atualizam sem recarregar a página.
- Testar a seleção por nível e categoria no treinamento em telas grandes e pequenas.
- Garantir que a sessão continua registrando corretamente categoria, nível, acertos, erros e duração.

## Detalhes técnicos
- Reutilizar as tabelas e permissões atuais; nenhuma alteração no banco é necessária.
- Criar uma apresentação administrativa específica para agrupar os registros por `category_id`, mantendo o formulário CRUD existente como base.
- No treinamento, consultar os flashcards disponíveis por nível para calcular categorias e contagens antes do início da sessão.

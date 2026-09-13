# Ajustes de conteúdo, administração e importação

## Resultado esperado

- Exibir somente materiais gratuitos ativos, sem cartões bloqueados para visitantes.
- Tornar os produtos digitais administráveis no site, com controles visuais de **Ativo** e **Em breve**.
- Preservar a dobra “Comece hoje sua preparação em Informática” e acrescentar uma seção de contato logo depois.
- Identificar os alunos no histórico por nome/e-mail e permitir abrir seus dados completos.
- Importar questões em lote por Excel ou CSV e oferecer modelos prontos dos dois formatos.
- Fazer o link “Perguntas & Faixas” abrir corretamente a gestão da avaliação.

## Implementação

### 1. Materiais gratuitos
- Trocar a lista fixa da dobra inicial pela lista cadastrada na administração.
- Consultar apenas arquivos com **Ativo** ligado, tanto na dobra inicial quanto na página exclusiva de downloads.
- Remover da experiência pública a etiqueta e o estado “Bloqueado”; itens inativos continuarão visíveis somente ao administrador.

### 2. Produtos digitais
- Substituir os checkboxes do formulário administrativo por toggles acessíveis e reutilizáveis.
- Adicionar ao produto o campo booleano **Em breve**, com atualização do banco e permissões existentes preservadas.
- Fazer a dobra pública carregar título, descrição, preço, selo, ordem, status e link diretamente dos produtos cadastrados.
- Produto ativo e disponível mantém o clique de compra; produto marcado **Em breve** recebe badge, aparência indisponível e não aceita clique.
- Produto com **Ativo** desligado não aparece para visitantes.

### 3. Contato
- Manter integralmente a dobra “Comece hoje sua preparação em Informática”.
- Criar abaixo dela uma seção de contato com nome, e-mail, WhatsApp, assunto e mensagem.
- Validar os campos e abrir o WhatsApp atual com a mensagem preenchida, além de mostrar os canais já configurados no site.
- Manter o rodapé após a nova seção e atualizar a navegação interna para apontar ao contato correto.

### 4. Histórico e dados do aluno
- Buscar o histórico por uma função administrativa protegida, combinando tentativa, avaliação, nome, e-mail e telefone sem expor acesso privilegiado no navegador.
- Substituir o código abreviado do aluno por nome ou e-mail clicável.
- Criar uma tela administrativa de detalhes do usuário com cadastro, status e históricos de avaliações e flashcards; o identificador técnico não será exibido como rótulo ao administrador.
- Manter reset de senha, bloqueio e exclusão restritos aos administradores.

### 5. Importação do Banco de Questões
- Adicionar na página administrativa do Banco de Questões os comandos **Importar questões** e **Baixar modelo**.
- Disponibilizar modelos equivalentes em `.xlsx` e `.csv`, com todas as colunas atuais: enunciado, alternativas, resposta correta, comentário, disciplina, assunto, área, certame, órgão, cidade, cargo, escolaridade, banca, ano, dificuldade e status.
- Ler os dois formatos, apresentar nome do arquivo e resumo antes da confirmação, validar campos obrigatórios, alternativas, resposta correta, ano e dificuldade.
- Enviar os registros validados por função administrativa protegida, inserir em lote e retornar quantos foram importados e quais linhas precisam de correção.
- Atualizar a tabela imediatamente após uma importação concluída, sem recarregar a página.

### 6. Avaliações: Perguntas & Faixas
- Corrigir a estrutura das rotas para que a lista de avaliações e a tela de gestão sejam páginas irmãs, permitindo que o link atual navegue de fato.
- Preservar a tela existente de perguntas e faixas, incluindo criação e exclusão, e validar o acesso pelo clique na coluna **Gerenciar**.

## Detalhes técnicos

- A alteração de **Em breve** será uma migração do banco, com permissões existentes mantidas.
- Operações que combinam usuários e históricos, além da importação em lote, usarão funções de servidor autenticadas com verificação de papel administrativo.
- Os modelos Excel e CSV serão arquivos estáticos do projeto; o Excel não terá fórmulas e será validado antes da entrega.
- As consultas públicas usarão atualização imediata após salvamento e filtros explícitos de visibilidade.

## Validação

- Confirmar que downloads inativos não aparecem em nenhuma tela pública.
- Alternar **Ativo** e **Em breve** no admin e conferir o reflexo imediato nos cards de produtos.
- Testar envio do formulário de contato em desktop e celular.
- Abrir um aluno pelo histórico e conferir seus dados e tentativas sem mostrar UUID.
- Baixar os dois modelos, importar exemplos válidos e rejeitar planilhas com linhas inválidas.
- Abrir “Perguntas & Faixas”, cadastrar e excluir uma pergunta/faixa e retornar à lista.
- Verificar as telas principais em desktop e celular, além dos erros de execução e compilação.

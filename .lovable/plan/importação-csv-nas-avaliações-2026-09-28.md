# Importação CSV nas avaliações

## Resultado
- Adicionar o comando **Importar CSV** na área de perguntas de cada avaliação.
- Aceitar o modelo enviado com colunas `Pergunta`, `Alternativa_A`, `Alternativa_B`, `Alternativa_C`, `Alternativa_D` e `Resposta_Correta`.
- Vincular automaticamente todas as questões à avaliação atualmente aberta.

## Implementação
- Ler arquivos CSV separados por ponto e vírgula, preservando acentos e textos com pontuação.
- Remover a numeração inicial do enunciado e os prefixos `A)`, `B)`, `C)` e `D)` das alternativas.
- Validar cabeçalhos, campos obrigatórios e resposta correta antes de salvar.
- Mostrar nome do arquivo, quantidade encontrada e erros por linha em uma confirmação.
- Importar em lote por uma função administrativa protegida, continuando a ordem das questões já cadastradas.
- Atualizar a lista imediatamente após a conclusão.

## Validação
- Testar com o arquivo `questoes_redes_ifpi.csv` enviado, contendo 20 questões.
- Confirmar que perguntas, alternativas e gabaritos aparecem corretamente na avaliação.
- Confirmar que arquivos inválidos não são importados parcialmente.

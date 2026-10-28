Contexto do Projeto:
Estou desenvolvendo o Aminus (aplicação desktop em Electron, React, Vite, Tailwind CSS com backend em Node.js/TypeScript).

Objetivo:
Preciso migrar o sistema de gerenciamento de fotos do banco MongoDB antigo para o MySQL, utilizando o banco de dados `catalog` que já está conectado no backend. As imagens agora são servidas/armazenadas via links externos (documentação anexa) e a modelagem lógica relacional está descrita no documento Word anexado.

Preciso de alterações completas tanto no Backend quanto no Frontend:

1. Backend (Node.js/TypeScript):

- Remover dependências, modelos e rotas antigas que utilizavam o MongoDB para fotos.
- Atualizar ou criar os repositories/services para interagir com a tabela/estrutura de fotos no banco MySQL `catalog` (conforme especificação no documento Word).
- Ajustar os endpoints de upload, busca e proxy de imagens para lidar com os novos links e estrutura do MySQL.

2. Frontend (React / Electron IPC):

- Atualizar os componentes React, hooks e chamadas IPC (context-isolated) para consumir a nova API/estrutura de fotos do MySQL.
- Garantir que a exibição das imagens na interface (listagens, detalhes de produtos/itens) trate corretamente os novos links e URLs de imagens.

Por favor, analise a estrutura atual do projeto, verifique os arquivos afetados no back e no front, e implemente as alterações necessárias de forma limpa, tipada com TypeScript e mantendo a integridade da aplicação.

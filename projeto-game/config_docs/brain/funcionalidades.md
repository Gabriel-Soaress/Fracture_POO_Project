# Funcionalidades Planejadas do Sistema (Back-end & Front-end)

Este documento mapeia todas as funcionalidades que serão desenvolvidas no sistema de batalhas por turnos. À medida que o código for sendo implementado, as localizações e exemplos de chamadas devem ser atualizados.

---

## 🔐 Autenticação e Gestão de Contas

### 1. Cadastro de Usuários
*   **Descrição**: Registro de novos usuários no banco de dados com e-mail e senha.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 2. Login e Autenticação
*   **Descrição**: Verificação de credenciais no banco de dados e controle de rotas protegidas por sessão/token.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

---

## 🛡️ Gerenciamento de Personagens (Lobby)

### 1. Criação de Personagem com Validação
*   **Descrição**: Formulário para inserir um personagem no banco com validação matemática rígida de exatamente 20 pontos de atributos (`Força` + `Defesa` + `Agilidade` == 20).
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 2. Listagem de Personagens Ativos
*   **Descrição**: Recuperação do banco de dados e renderização dos personagens ativos pertencentes ao usuário logado.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 3. Inativação Manual de Personagem (Exclusão Lógica)
*   **Descrição**: Botão que realiza um Update de inativação (Soft Delete) no banco de dados para remover o personagem da lista de ativos do usuário.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

---

## 📊 Progressão e Informações (Hub Central)

### 1. Atualização e Redistribuição de Atributos
*   **Descrição**: Acréscimo permanente de atributos quando o personagem sobe de nível, atualizando seus dados no banco de dados.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 2. Consulta Textual e Filtros no Códice
*   **Descrição**: Mecanismo de busca textual no banco de dados por dados sobre inimigos ou termos do lore do jogo, retornando cards dinâmicos na interface.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

---

## ⚔️ Mecânica de Combate (Processo Principal)

### 1. Processamento do Turno do Usuário
*   **Descrição**: Ações ativas de `Atacar` (básico ou habilidades de classe com custo de energia), `Defender` (recupera energia e mitiga dano), `Ação Especial` ou `Usar Item` (cura, energia, vantagem ou desvantagem).
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 2. Processamento do Turno do Inimigo (IA do Boss)
*   **Descrição**: Motor de ações automatizadas do Boss logo após o término do turno do jogador, decidindo entre ataques, especiais ou defesa com base na sua energia e vida restante.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 3. Gestão de Energia e Uso de Itens
*   **Descrição**: Sistema de recurso tático (estamina/mana) onde cada habilidade possui custo de energia, a postura de defesa regenera energia e itens consumíveis do inventário podem ser utilizados em combate.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

### 4. Fluxo de Fim de Combate
*   **Descrição**: Validação de término (HP de algum lado == 0). Em caso de vitória, atribuição de XP. Em caso de derrota, inativação automática (Soft Delete) do personagem no banco.
*   **Localização**: `[PENDENTE - A implementar]`
*   **Chamada de Exemplo**: `[PENDENTE]`

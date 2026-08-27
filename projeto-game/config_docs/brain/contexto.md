# Contexto e Regras do Jogo (Batalhas por Turnos)

Este documento serve como a fonte de verdade para as regras de negócio, decisões arquiteturais e diretrizes de desenvolvimento do jogo de batalhas por turnos desenvolvido para a disciplina de Programação Orientada a Objetos (POO), integrando conceitos de desenvolvimento Web e Banco de Dados.

---

## 📌 Visão Geral do Sistema
O projeto consiste em um jogo de RPG de batalhas por turnos baseado em navegador (Web). O foco principal do sistema é demonstrar a aplicação sólida e clara dos pilares da orientação a objetos (**Herança, Polimorfismo, Encapsulamento e Abstração**) na lógica de combate e nas regras de negócio subjacentes, fugindo de sistemas gerenciais tradicionais.

---

## ⚙️ Fluxo e Regras de Negócio do Domínio

### 1. Autenticação e Acesso
*   **Cadastro**: Usuários devem registrar uma conta fornecendo `email` e `senha`.
*   **Login**: Autenticação que carrega o estado atual de progresso do usuário a partir do banco de dados e bloqueia rotas não autorizadas.

### 2. Painel de Seleção (Lobby)
*   **Listagem de Personagens**: Exibe apenas os personagens ativos vinculados à conta do usuário.
*   **Inativação Manual**: Permite que o usuário remova (inative via Soft Delete) personagens indesejados.
*   **Criação de Personagens**:
    *   Requer preenchimento de **Nome**, seleção de **Raça/Classe** (via dropdown) e distribuição de atributos.
    *   **Regra Matemática Obrigatória**: O jogador deve distribuir **exatamente 20 pontos** iniciais entre os atributos `Força`, `Defesa` e `Agilidade`.
    *   **Validação**: O sistema deve impedir envios com valores em branco, atributos negativos ou qualquer somatório de atributos que divirja exatamente de 20 pontos.

### 3. Hub Central do Personagem
*   **Visualização de Status**: Exibição da vida (HP), nível, atributos atuais e barra de experiência (XP).
*   **Evolução de Nível (Update)**: Ao acumular XP suficiente e subir de nível, o sistema habilita uma interface para o usuário distribuir novos pontos de atributos permanentemente.
*   **Códice de Pesquisa**: Campo de busca textual com filtros. Permite pesquisar termos relacionados ao lore do jogo (ex: inimigos, regras de combate) com consultas dinâmicas ao banco de dados e retorno em formato de cards.

### 4. Motor de Batalha (O Processo Principal)
*   **Layout de Combate**: Exibição lateralizada do HP e status do Personagem (esquerda) contra os do Chefe/Boss (direita).
*   **O Turno do Jogador**: Botões de ação como `Atacar` e `Defender`. O dano e a eficácia da defesa são calculados usando POO com base nos atributos das entidades envolvidas.
*   **O Turno do Sistema**: Processamento automático da ação do Boss e atualização da interface de forma sequencial.
*   **Fim de Combate**:
    *   **Vitória**: Concessão de pontos de XP e redirecionamento de volta ao Hub Central.
    *   **Derrota**: Ocorre a **inativação automática (Soft Delete)** do personagem no banco de dados. O usuário é redirecionado de volta ao Painel de Seleção para criar ou selecionar outro personagem.

---

## 🎨 Diretrizes de Desenvolvimento e Código

*   **Nomenclatura Obrigatória em PT-BR**: Todas as pastas, nomes de arquivos de código, classes, métodos, atributos, funções, variáveis e componentes do frontend e backend devem ser nomeados obrigatoriamente em **Português do Brasil (PT-BR)**.
    *   *Exceção*: Termos puramente técnicos padrão de mercado de dependências que não aceitam tradução direta (ex: comandos SQL, métodos HTTP, bibliotecas, hooks do React como `useState`, middlewares do Express).
*   **Abordagem Educacional e Mentoria**: A IA de apoio não criará arquivos nem inserirá códigos diretamente no backend por conta própria sem consulta prévia do desenvolvedor. A IA atuará como guia pedagógica e revisora, auxiliando o desenvolvedor a codificar e aprender POO de forma prática.

---

## 📈 Histórico de Decisões Cruciais

| Data | Decisão / Mudança | Justificativa | Autor |
| :--- | :--- | :--- | :--- |
| 13/08/2026 | Migração de escopo do index experimental para o Jogo de Batalhas por Turnos | O projeto final real do repositório será desenvolvido dentro da pasta `projeto-game`. O `index.js` na raiz foi desconsiderado para o escopo principal. | IA (Antigravity) |
| 13/08/2026 | Arquitetura de exclusão e tratamento de derrota via Soft Delete | Para atender ao requisito de exclusão de registros e criar consequências no jogo, a derrota inativa permanentemente o personagem de forma lógica no banco de dados. | IA (Antigravity) |
| 18/08/2026 | Definição de Nome do Jogo e Pasta de Entregas | Criação da pasta `entregas/` e documentação inicial da Sprint 1 definindo o nome oficial do projeto como "Fracture: The Vaslen Echoes" sob estética medieval. | IA (Antigravity) |
| 25/08/2026 | Levantamento e Mapeamento de Requisitos (Sprint 2) | Definição detalhada de 13 requisitos funcionais, 5 requisitos não funcionais, 9 regras de negócio e modelagem do motor de combate baseada em POO. | IA (Antigravity) |
| 27/08/2026 | Adoção de Nomenclatura em PT-BR e Foco Educativo | Toda a nomenclatura customizada do projeto deve ser em PT-BR para simplificar a apresentação acadêmica. O papel da IA será focado em mentoria e revisão, sem gerar códigos diretamente no backend. | Usuário & IA |
| 27/08/2026 | Criação dos Diretórios do Backend | Inicialização física da estrutura de pastas em 'projeto-game/backend/src/' em português, seguindo o padrão de arquitetura em camadas. | IA & Usuário |

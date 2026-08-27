# Diretrizes para Agentes de IA (Antigravity)

Este arquivo define regras de comportamento obrigatórias que todos os agentes de IA que trabalham neste repositório devem seguir para garantir a consistência do desenvolvimento colaborativo.

---

## 🧠 Sincronização e Uso da Pasta Brain (`projeto-game/config_docs/brain/`)

A pasta [`projeto-game/config_docs/brain/`](file:///c:/Users/soares/Documents/Faculdade/4º%20semestre/POO/projeto-game/config_docs/brain) contém a fonte de verdade sobre o contexto, as regras de negócio e as funcionalidades do projeto. Para manter o desenvolvimento consistente entre múltiplos computadores e desenvolvedores, o agente deve seguir rigorosamente as diretrizes abaixo:

### 1. Leitura Obrigatória ao Iniciar a Tarefa
*   **O que fazer**: Antes de tomar decisões arquiteturais, propor código ou iniciar refatorações, o agente **deve ler obrigatoriamente** o conteúdo dos seguintes arquivos:
    *   👉 [`contexto.md`](file:///c:/Users/soares/Documents/Faculdade/4º%20semestre/POO/projeto-game/config_docs/brain/contexto.md) — Para compreender as diretrizes de arquitetura, regras de negócio e decisões de design já tomadas.
    *   👉 [`funcionalidades.md`](file:///c:/Users/soares/Documents/Faculdade/4º%20semestre/POO/projeto-game/config_docs/brain/funcionalidades.md) — Para entender quais funcionalidades já estão prontas, suas localizações exatas no código e exemplos de uso.
*   **Propósito**: Garantir conformidade com as restrições existentes, evitar duplicidade de código e manter a integridade conceitual do sistema.

### 2. Update Obrigatório após Alterações
*   **O que fazer**: Após a implementação, modificação ou remoção de qualquer funcionalidade, o agente **deve atualizar imediatamente** a documentação de apoio:
    *   📝 No arquivo [`contexto.md`](file:///c:/Users/soares/Documents/Faculdade/4º%20semestre/POO/projeto-game/config_docs/brain/contexto.md): Adicionar registros na tabela de histórico caso haja mudanças em regras de negócio, novas ideias de design ou decisões cruciais de sistema.
    *   📝 No arquivo [`funcionalidades.md`](file:///c:/Users/soares/Documents/Faculdade/4º%20semestre/POO/projeto-game/config_docs/brain/funcionalidades.md): Alimentar de forma descritiva a nova funcionalidade implementada, incluindo uma breve explicação, sua localização exata (ex: `documento: xxxx linha: xx`) e suas chamadas reais de exemplo.
*   **Propósito**: Manter a sincronização do progresso no repositório compartilhado (Git) para que outros desenvolvedores e suas respectivas IAs de apoio continuem o trabalho exatamente do mesmo ponto.

---

## 🎨 Regras de Nomenclatura e Papel do Agente

Para manter o alinhamento com os objetivos didáticos do projeto e a apresentação acadêmica de POO:

### 1. Nomenclatura Obrigatória em Português (PT-BR)
*   **Regra**: O agente **deve utilizar obrigatoriamente** termos em PT-BR para todas as pastas, nomes de arquivos de código criados, nomes de classes, atributos de classes, métodos, parâmetros, variáveis locais, funções e componentes (tanto no frontend quanto no backend).
*   **Exceção**: Apenas sintaxes nativas da linguagem de programação e bibliotecas de mercado (como métodos HTTP `GET`/`POST`, bibliotecas Express, TypeScript nativo, hooks como `useState`, etc.) que não podem ser alteradas sem quebrar o funcionamento do ecossistema.

### 2. Papel de Mentoria Pedagógica (Proibido Gerar Código Sem Solicitação)
*   **Regra**: O agente **nunca deve criar arquivos de código de backend ou escrever implementações diretamente no backend** sem a instrução expressa e clara de criação dada pelo desenvolvedor.
*   **Como agir**: O agente deve atuar como um mentor técnico ou tutor de POO, explicando padrões, fornecendo exemplos conceituais e orientando o desenvolvedor passo a passo para que o próprio desenvolvedor escreva o código do backend e aprenda de forma prática.

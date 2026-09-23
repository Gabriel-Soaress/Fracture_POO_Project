# 📋 Sprint 2: Catálogo de Mundo, Orquestração e Enciclopédia (Códice)

**Tech Lead:** Antigravity  
**Desenvolvedor Responsável:** Gabriel  
**Projeto:** *Fracture: The Vaslen Echoes*  
**Objetivo da Sprint:** Construir a entidade de conta de jogador (`Usuario`), a enciclopédia interativa do universo (`EntradaCodice`), o padrão de Fábricas Estáticas de Conteúdo de Fábrica (criando os monstros, itens de loot e verbetes canônicos da lore) e os Serviços de Domínio (`CalculadoraCombate` e `MotorCombate`) que orquestram os turnos, regras de dano, mitigação, esquiva e distribuição de recompensas.

---

## 🧭 Mensagem do Tech Lead

> E aí, Gabriel! Na Sprint 1 nós construímos os músculos do nosso combate: as entidades puras `EntidadeCombatente`, `Personagem`, `Monstro` e `Item`, além da simulação de combate com estamina e IA de monstros.
> 
> Agora entramos na **Sprint 2**, onde o mundo de Vaslen ganha forma e estrutura organizada:
> 1. **Diferença entre o que é "De Fábrica" e o que é "Dinâmico":**
>    * Monstros, Itens de loot e Entradas do Códice pertencem à lore oficial e fixa do jogo. Não faz sentido o usuário inventar um monstro do nada; eles virão de **Fábricas de Domínio** (`FabricaMonstros`, `FabricaItens`, `FabricaCodice`).
>    * O que é criado e modificado dinamicamente são os dados do usuário: a conta `Usuario`, os heróis `Personagem` (com seus pontos distribuídos e inventário acumulado) e o estado volátil da sessão de batalha (`MotorCombate`).
> 2. **Separação de Responsabilidades (SRP - Single Responsibility Principle):**
>    * A entidade não deve saber como calcular fórmulas complexas de probabilidade de acerto crítico ou esquiva com dados d20, nem deve cuidar da troca de turnos. Isso pertence a **Serviços de Domínio** (`CalculadoraCombate` e `MotorCombate`).
> 3. **Conhecimento é Poder (O Códice de Vaslen):**
>    * Cada monstro derrotado ou relíquia encontrada revela conhecimento do mundo. Criaremos a classe `EntradaCodice` com suporte a buscas rápidas por tags e categorias temáticas.
> 
> Como combinamos: todos os arquivos continuam em **Português do Brasil (PT-BR)**, sem dependência de banco de dados ainda. Vamos aos chamados!

---

## 🎫 Chamado 0: A Conta do Jogador (`Usuario.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta
* **Arquivo:** `backend/src/dominio/entidades/Usuario.ts`

### 💡 Por que este arquivo existe?
No jogo, o jogador precisa ter uma conta de acesso com suas credenciais seguras e poder gerenciar seus heróis criados. Um usuário pode ter múltiplos personagens (ex: um guerreiro focado em força e outro ladino ágil), mas apenas personagens ativos participam das jornadas.

### 🎓 Conceitos de POO Aplicados:
* **Composição / Agregação:** A classe `Usuario` agrega uma coleção de instâncias de `Personagem`.
* **Encapsulamento Estrito:** A senha nunca fica exposta publicamente e a lista de personagens só pode ser manipulada através de métodos da classe (impedindo adições diretas no array).

### 📝 O que a classe deve conter:
1. **Atributos Privados:**
   * `id: string` (identificador único da conta)
   * `nome: string` (nome de exibição)
   * `email: string` (email único para login)
   * `senhaHash: string` (hash seguro da senha - a senha crua nunca é salva)
   * `personagens: Personagem[]` (lista de heróis vinculados à conta)
   * `dataCriacao: Date`
2. **Construtor:**
   * Recebe `id`, `nome`, `email`, `senhaHash` e inicializa a lista vazia de personagens.
3. **Métodos de Domínio:**
   * `adicionarPersonagem(personagem: Personagem): void`:
     * Valida se o usuário já não atingiu o limite de heróis por conta (ex: máximo de 5 personagens).
   * `obterPersonagensAtivos(): Personagem[]`:
     * Retorna apenas os heróis cujo atributo `ativo === true` (respeitando o Soft Delete implementado na Sprint 1).
   * `obterPersonagemPorId(id: string): Personagem | undefined`:
     * Localiza um personagem específico dentro do arsenal do usuário.
   * `removerPersonagem(id: string): boolean`:
     * Aplica o `inativar()` no personagem correspondente (Soft Delete).
   * Getters para `id`, `nome`, `email` e `dataCriacao`.

### ✅ Critérios de Aceite:
* Criação de conta validando dados obrigatórios.
* Associação correta de instâncias de `Personagem`.
* Filtro de personagens ativos ignorando os inativados (`ativo = false`).

---

## 🎫 Chamado 1: O Códice do Mundo de Vaslen (`EntradaCodice.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Média
* **Arquivo:** `backend/src/dominio/entidades/EntradaCodice.ts`

### 💡 Por que este arquivo existe?
O Códice é o repositório enciclopédico do jogo, contendo histórias dos deuses caídos, origem das feras da Névoa, segredos dos biomas e relíquias esquecidas. Os jogadores consultam o Códice para entender as fraquezas dos inimigos e desvendar o universo.

### 🎓 Conceitos de POO Aplicados:
* **Imutabilidade e Encapsulamento:** As entradas canônicas do Códice são registros históricos consistentes.
* **Comportamento de Busca Rica:** A classe deve conter inteligência própria para responder se um termo de busca corresponde ao seu título, resumo, conteúdo ou tags associadas.

### 📝 O que a classe deve conter:
1. **Tipos Auxiliares:**
   * `CategoriaCodice = 'MONSTRO' | 'REGIAO' | 'RELÍQUIA' | 'HISTORIA'`
2. **Atributos Privados:**
   * `id: string`
   * `titulo: string`
   * `categoria: CategoriaCodice`
   * `resumo: string` (descrição curta exibida em listagens)
   * `conteudoCompleto: string` (texto aprofundado com a lore)
   * `tags: string[]` (palavras-chave para filtro, ex: `["pantano", "veneno", "abissal"]`)
3. **Métodos de Domínio:**
   * `contemTermo(termo: string): boolean`:
     * Faz busca case-insensitive no título, no resumo e nas tags.
   * `formatarParaCard(): { id: string, titulo: string, categoria: string, resumo: string }`:
     * Retorna uma visão resumida ideal para consumo visual em cards.
   * Getters para todos os campos.

### ✅ Critérios de Aceite:
* Criação de instâncias com tipagem rigorosa de categoria.
* Método `contemTermo` funcionando tanto para palavras exatas quanto partes de palavras sem diferenciar maiúsculas/minúsculas.

---

## 🎫 Chamado 2: Fábricas de Conteúdo de Fábrica (`dominio/fabricas/`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta
* **Arquivos:**
  * `backend/src/dominio/fabricas/FabricaItens.ts`
  * `backend/src/dominio/fabricas/FabricaMonstros.ts`
  * `backend/src/dominio/fabricas/FabricaCodice.ts`

### 💡 Por que esses arquivos existem?
Conforme alinhamos, o ecossistema de Vaslen tem dezenas de itens de loot, criaturas e páginas de história que não devem ser codificados aleatoriamente em testes ou controladores. O padrão de projeto **Factory (Fábrica)** centraliza e padroniza a criação de instâncias canônicas do jogo.

### 🎓 Conceito de POO: Padrão de Projeto Factory (Fábrica)
Em vez de espalhar `new Monstro(...)` ou `new Item(...)` com dezenas de parâmetros pelo projeto inteiro, usamos métodos estáticos (`FabricaMonstros.criarCriaDaNévoa()`) que encapsulam os atributos canônicos, balanceamento e loots apropriados.

### 📝 Especificações de cada Fábrica:

#### 1. `FabricaItens.ts`:
* Métodos estáticos para gerar consumíveis canônicos:
  * `criarPocaoVidaMenor(): Item` (+30 Vida)
  * `criarPocaoVidaMaior(): Item` (+70 Vida)
  * `criarElixirEnergia(): Item` (+40 Energia)
  * `criarFrascoReforcoDano(): Item` (+8 Dano Bônus)
  * `criarExtratoNevoaPurificada(): Item` (+50 Vida, +30 Energia)

#### 2. `FabricaMonstros.ts`:
* Métodos estáticos criando as feras de Vaslen, com atributos calculados e itens de loot definidos:
  * `criarRastejanteDaNevoa(): Monstro` (Comum, nível baixo, dropa `PocaoVidaMenor`)
  * `criarSentinelaDePedraCorrompida(): Monstro` (Elite, alta defesa, dropa `FrascoReforcoDano`)
  * `criarDevoradorDeEcos(): Monstro` (Chefe, golpes brutais, alta estamina, dropa `ExtratoNevoaPurificada`)
  * `obterCatalogo(): Monstro[]` (retorna lista de modelos de monstros disponíveis para sorteio de encontros)

#### 3. `FabricaCodice.ts`:
* Métodos estáticos gerando as entradas oficiais da enciclopédia:
  * `criarEntradasIniciais(): EntradaCodice[]`:
    * Verbete 1: "A Grande Fratura de Vaslen" (História)
    * Verbete 2: "Crias da Névoa Corrompida" (Monstro)
    * Verbete 3: "O Elixir dos Ecos Antigos" (Relíquia)
    * Verbete 4: "O Vale dos Ossos Silenciosos" (Região)

### ✅ Critérios de Aceite:
* Cada fábrica gera instâncias novas, válidas e prontas para uso.
* Monstros criados por fábrica contam com itens de loot devidamente associados via `droparLoot()`.

---

## 🎫 Chamado 3: Serviço Matemático de Combate (`CalculadoraCombate.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Média
* **Arquivo:** `backend/src/dominio/servicos/CalculadoraCombate.ts`

### 💡 Por que este arquivo existe?
Regras matemáticas de probabilidade (acerto crítico, chance de esquiva baseada em agilidade relativa, e cálculo de redução de dano por armadura) não devem sujar a classe `EntidadeCombatente`. Um **Domain Service** (Serviço de Domínio) isola as fórmulas de física e regras numéricas do jogo.

### 🎓 Conceitos de POO: Domain Service & Alta Coesão
A classe `CalculadoraCombate` é stateless (sem estado interno). Ela recebe os dados de quem ataca e quem defende, processa o resultado e devolve um relatório detalhado da ação.

### 📝 O que a classe deve conter:
1. **Métodos Estáticos:**
   * `calcularDanoEfetivo(danoBruto: number, defesaAlvo: number, estaDefendendo: boolean): number`:
     * Fórmula: `Dano = Math.max(1, danoBruto - (defesaAlvo * 0.5))`.
     * Se o alvo estiver na postura defensiva, reduz mais 30% do impacto.
   * `verificarEsquiva(agilidadeAtacante: number, agilidadeDefensor: number): boolean`:
     * Calcula a diferença de agilidade com chance percentual justa e rolagem de dado d100.
   * `verificarCritico(agilidadeAtacante: number): { ehCritico: boolean, multiplicador: number }`:
     * Rolagem de chance de acerto crítico (1.5x de dano).

### ✅ Critérios de Aceite:
* O dano final nunca é menor que 1 (evita golpes que curam o inimigo).
* Personagens ágeis têm vantagem probabilística proporcional.

---

## 🎫 Chamado 4: O Orquestrador Oficial de Batalha (`MotorCombate.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Coração do Jogo)
* **Arquivo:** `backend/src/dominio/servicos/MotorCombate.ts`

### 💡 Por que este arquivo existe?
Até a Sprint 1, nosso teste gerenciava o loop de combate manualmente. O `MotorCombate` é a máquina de estados oficial que controla:
* Quem tem a iniciativa no início da luta (d10 + agilidade).
* A execução do turno do jogador (ataque 1/2/3, defesa ou uso de item do inventário).
* A resposta imediata e tática do monstro.
* A verificação contínua de fim de combate (Vitória do Herói ou Morte/Derrota).
* O drop de loot e distribuição de XP no caso de vitória.
* A inativação do herói (`inativar()`) caso seja derrotado.

### 🎓 Conceitos de POO: Orquestração e Encapsulamento de Fluxo
O `MotorCombate` mantém o estado atual da sessão:
* `heroi: Personagem`
* `monstro: Monstro`
* `turnoAtual: number`
* `registroBatalha: string[]` (log narrativo de tudo que aconteceu)
* `estadoBatalha: 'EM_ANDAMENTO' | 'VITORIA_JOGADOR' | 'DERROTA_JOGADOR'`

### 📝 Métodos Principais:
1. `iniciarCombate(): { primeiroAJogar: string, mensagem: string }`
2. `processarAcaoJogador(acao: { tipo: 'ATACAR' | 'DEFENDER' | 'USAR_ITEM', indiceAtaque?: number, idItem?: string }): ResultadoTurno`
3. `finalizarCombate(): RelatorioFimBatalha`:
   * Em caso de vitória: coleta loot do monstro (`droparLoot()`), adiciona ao inventário do herói e entrega o XP.
   * Em caso de derrota: aciona `heroi.inativar()` (Soft Delete).

### ✅ Critérios de Aceite:
* Transições de estado precisas entre `EM_ANDAMENTO`, `VITORIA_JOGADOR` e `DERROTA_JOGADOR`.
* Loot e XP repassados de forma segura e transparente.

---

## 🎫 Chamado 5: Provas de Integração de Domínio (`testes/teste_motor_e_codice.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Validação da Sprint)
* **Arquivo:** `backend/testes/teste_motor_e_codice.ts`

### 📝 O que deve ser testado:
1. **Fábricas:** Instanciação em massa de itens, monstros e verbetes através das 3 fábricas estáticas.
2. **Códice:** Consulta e filtragem de entradas por categorias e por termos parciais de busca.
3. **Usuário e Heróis:** Criação de usuário, associação de heróis com validação de limite e listagem de heróis ativos.
4. **Combate Orquestrado:** Batalha completa executada pelo `MotorCombate`, registrando o log narrativo, ações de estamina, itens usados e resultado final (verificando se o loot foi para o inventário do herói).
5. **Comando de Teste:**
   * Criar script `"testar:motor": "tsx testes/teste_motor_e_codice.ts"` no `package.json`.

---

## 🎯 Quadro de Progresso da Sprint 2

| Chamado | Descrição | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Chamado 0** | Criação da entidade `Usuario.ts` (Gestão de conta e múltiplos heróis) | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 1** | Criação da entidade `EntradaCodice.ts` (Enciclopédia de Vaslen e busca textual) | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 2** | Fábricas de Domínio (`FabricaItens`, `FabricaMonstros`, `FabricaCodice`) | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 3** | Serviço de Domínio `CalculadoraCombate.ts` (Fórmulas de dano, defesa e crítico) | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 4** | Orquestrador de Sessão `MotorCombate.ts` (Turnos, estados, loot e XP) | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 5** | Testes de Integração em `testes/teste_motor_e_codice.ts` | Antigravity / Gabriel | ⚪ A Fazer |

---

> ⚠️ **Política de Auto-Atualização Contínua:**  
> Caso qualquer especificação de assinatura de método, nome de atributo ou mecânica mude durante o desenvolvimento da Sprint 2, este documento e os documentos das Sprints 3 e 4 serão atualizados imediatamente para manter a coerência arquitetural total do projeto.

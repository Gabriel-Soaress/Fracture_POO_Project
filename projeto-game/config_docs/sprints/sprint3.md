# 📋 Sprint 3: Persistência de Dados e Repositórios (SQL / ORM)

**Tech Lead:** Antigravity  
**Desenvolvedor Responsável:** Gabriel  
**Projeto:** *Fracture: The Vaslen Echoes*  
**Objetivo da Sprint:** Construir a camada de infraestrutura e persistência de dados. Modelar o banco de dados relacional com integridade referencial, implementar o padrão de projeto *Repository* (separando a lógica de negócio da linguagem SQL) com suporte a Soft Delete, e criar um script de *Seed* (semeadura) para carregar os dados de fábrica de Vaslen no banco.

---

## 🧭 Mensagem do Tech Lead

> Salve, dev! Bem-vindo à **Sprint 3: O Elo Perdido entre a Memória e o Disco**.
> 
> Até aqui, nas Sprints 1 e 2, tudo o que criamos vivia na memória volátil da máquina: ao fechar o terminal, heróis, vitórias e itens desapareciam no éter. Agora vamos dar imortalidade ao progresso do jogador!
> 
> **Atenção Máxima à Regra Arquitetural de Ouro:**
> * Lembra que eu disse que a pasta `src/dominio/` é sagrada e pura? **Ela continua intocada.**
> * Nossas classes `Personagem`, `Usuario` e `EntradaCodice` não sabem o que é um banco de dados, nem devem saber.
> * Quem cuida de salvar e carregar objetos é a camada de **Infraestrutura** (`src/infra/repositorios/`), utilizando o padrão **Repository Pattern**.
> * O Repositório é uma ponte: ele pega uma entidade de POO pura, converte para tabelas/colunas de banco e, ao buscar do banco, reconstrói a entidade de POO com todos os seus métodos intactos.
> 
> Vamos preparar o terreno para um banco robusto, com suporte a Soft Delete de fábrica e povoamento automático da lore!

---

## 🎫 Chamado 0: Escolha e Setup da Camada de Banco de Dados

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Bloqueante)
* **Local de Execução:** Pasta `backend/`

### 💡 Por que este chamado existe?
Precisamos definir uma ferramenta de banco de dados compatível com TypeScript que permita prototipagem rápida sem dor de cabeça de configuração pesada, mas que suporte SQL padrão da indústria. Utilizaremos o **SQLite** (armazenado em arquivo local `.db` para desenvolvimento zero-configuração) ou **PostgreSQL**, com o auxílio do **Prisma ORM** (ou TypeORM / SQLite3 nativo com tipagem segura).

### 🎓 Conceito de Engenharia: ORM vs. SQL Puro
Um ORM (Object-Relational Mapping) traduz tabelas relacionais para objetos tipados no TypeScript. O Prisma gera migrations seguras, clientes com autocompletar estrito e garante que tipos de colunas correspondam exatamente aos tipos de dados do TypeScript.

### 📝 Passos de Configuração:
1. Instalar as dependências de persistência:
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```
2. Inicializar o schema de migração:
   ```bash
   npx prisma init --datasource-provider sqlite
   ```
3. Configurar o arquivo `prisma/schema.prisma` com os modelos relacionais do jogo.

### ✅ Critérios de Aceite:
* Ferramenta de banco inicializada sem erros.
* Estrutura de arquivos criada em `backend/prisma/`.

---

## 🎫 Chamado 1: Modelagem Relacional do Esquema (`schema.prisma`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta
* **Arquivo:** `backend/prisma/schema.prisma`

### 💡 Por que este chamado existe?
O banco de dados precisa representar as relações do mundo real do nosso jogo com integridade referencial:
* 1 Usuário possui 0 a N Personagens (`1:N`).
* 1 Personagem possui 0 a N Itens de Inventário (`1:N`).
* O Códice armazena os verbetes de conhecimento acessíveis globalmente.

### 📝 Tabelas e Atributos:

#### 1. Tabela `usuarios`
* `id`: String (UUID ou CUID, Chave Primária)
* `nome`: String
* `email`: String (Único)
* `senhaHash`: String
* `criadoEm`: DateTime (padrão `now()`)
* Relação: `personagens` (`Personagem[]`)

#### 2. Tabela `personagens`
* `id`: String (Chave Primária)
* `usuarioId`: String (Chave Estrangeira ligada a `usuarios.id`)
* `nome`: String
* `classe`: String (`GUERREIRO`, `MAGO`, `LADINO`, `CACADOR`, `CLERIGO`)
* `nivel`: Int (inicia em 1)
* `experiencia`: Int (inicia em 0)
* `vidaMaxima`: Int
* `vidaAtual`: Int
* `energiaMaxima`: Int
* `energiaAtual`: Int
* `forca`: Int
* `defesa`: Int
* `agilidade`: Int
* `pontosLivres`: Int (inicia em 0)
* `ativo`: Boolean (padrão `true` - **Suporte a Soft Delete!**)
* `criadoEm`: DateTime (padrão `now()`)
* Relações: `usuario` e `itens` (`ItemInventario[]`)

#### 3. Tabela `itens_inventario`
* `id`: String (Chave Primária)
* `personagemId`: String (Chave Estrangeira ligada a `personagens.id` com `onDelete: Cascade`)
* `nome`: String
* `tipo`: String (`CURA_VIDA`, `RECUPERA_ENERGIA`, `REFORCO_DANO`)
* `valorEfeito`: Int
* `descricaoLore`: String
* `quantidade`: Int (padrão 1)

#### 4. Tabela `entradas_codice`
* `id`: String (Chave Primária)
* `titulo`: String
* `categoria`: String (`MONSTRO`, `REGIAO`, `RELÍQUIA`, `HISTORIA`)
* `resumo`: String
* `conteudoCompleto`: String
* `tags`: String (lista de tags separadas por vírgula para busca)

### ✅ Critérios de Aceite:
* Schema compilado e migration gerada com sucesso via `npx prisma migrate dev --name inicializacao_banco`.

---

## 🎫 Chamado 2: Repositório de Usuários (`UsuarioRepositorio.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Média
* **Arquivo:** `backend/src/infra/repositorios/UsuarioRepositorio.ts`

### 💡 Por que este chamado existe?
Isola todas as operações de banco de dados envolvendo a conta do jogador.

### 🎓 Conceitos de POO: Repository Pattern & Interfaces de Contrato
Criaremos primeiro a interface de contrato no domínio (`backend/src/dominio/contratos/IUsuarioRepositorio.ts`) para respeitar o Princípio de Inversão de Dependência (DIP - SOLID). A implementação em `src/infra/` implementa essa interface.

### 📝 Métodos Obrigatórios:
1. `salvar(usuario: Usuario): Promise<void>`:
   * Cria ou atualiza o usuário no banco.
2. `buscarPorEmail(email: string): Promise<Usuario | null>`:
   * Busca pelo email para fins de autenticação e validação de duplicidade.
3. `buscarPorId(id: string): Promise<Usuario | null>`:
   * Carrega o usuário junto com seus personagens ativos.

### ✅ Critérios de Aceite:
* Persistência de usuários no banco.
* Reconstrução da entidade de domínio `Usuario` preservando suas regras de encapsulamento.

---

## 🎫 Chamado 3: Repositório de Personagens (`PersonagemRepositorio.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta
* **Arquivo:** `backend/src/infra/repositorios/PersonagemRepositorio.ts`

### 💡 Por que este chamado existe?
Responsável por salvar a evolução do herói (XP, nível, atributos distribuídos, inventário acumulado) e aplicar o Soft Delete na base de dados quando o herói perecer ou o usuário optar por inativá-lo.

### 📝 Regras Cruciais de Implementação:
1. **Filtro Automático de Soft Delete:**
   * Métodos de listagem (`listarPorUsuario(usuarioId: string)`) devem **obrigatoriamente** incluir o filtro `WHERE ativo = true`. Heróis inativados não somem do banco, mas ficam invisíveis para a jogabilidade normal.
2. **Reconstituição do Inventário:**
   * Ao puxar o personagem do banco, reconstruir as instâncias de `Item` e adicioná-las no inventário do herói (`heroi.adicionarItemAoInventario(item)`).
3. **Persistência de Progresso Pós-Combate:**
   * Método `atualizarProgresso(personagem: Personagem): Promise<void>` para salvar os novos valores de XP, nível, atributos e itens ganhos após uma vitória orquestrada pelo `MotorCombate`.

### ✅ Critérios de Aceite:
* Inativação (`inativar()`) altera apenas a coluna `ativo` para `false` no banco.
* Integridade dos itens mantida no inventário do herói.

---

## 🎫 Chamado 4: Repositório de Consulta do Códice (`CodiceRepositorio.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Média
* **Arquivo:** `backend/src/infra/repositorios/CodiceRepositorio.ts`

### 💡 Por que este chamado existe?
Permite buscas textuais rápidas e listagens paginadas das entradas de lore do mundo de Vaslen.

### 📝 Métodos Obrigatórios:
1. `listarTodas(): Promise<EntradaCodice[]>`
2. `buscarPorCategoria(categoria: string): Promise<EntradaCodice[]>`
3. `buscarPorTermo(termo: string): Promise<EntradaCodice[]>`:
   * Realiza busca textual no banco em `titulo`, `resumo` ou `tags`.
4. `buscarPorId(id: string): Promise<EntradaCodice | null>`

### ✅ Critérios de Aceite:
* Retorno de instâncias puras de `EntradaCodice`.
* Eficiência na filtragem de verbetes por palavras-chave.

---

## 🎫 Chamado 5: Script de Povoamento Inicial / Seed (`semear_banco.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Média
* **Arquivo:** `backend/src/infra/scripts/semear_banco.ts`

### 💡 Por que este chamado existe?
Quando o jogo for instalado por qualquer desenvolvedor ou avaliador da faculdade, o banco começará vazio. Este script consome a `FabricaCodice` desenvolvida na Sprint 2 e popula o banco com a lore oficial e catálogo canônico do jogo automaticamente.

### 📝 Execução:
* Ler as entradas geradas por `FabricaCodice.criarEntradasIniciais()`.
* Persistir cada entrada no banco de dados.
* Adicionar comando de conveniência no `package.json`:
  ```json
  "banco:semear": "tsx src/infra/scripts/semear_banco.ts"
  ```

### ✅ Critérios de Aceite:
* Executar `npm run banco:semear` preenche a tabela `entradas_codice` sem erros de duplicidade.

---

## 🎫 Chamado 6: Testes de Persistência (`testes/teste_persistencia.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Validação da Sprint)
* **Arquivo:** `backend/testes/teste_persistencia.ts`

### 📝 Cenários de Teste:
1. Criação de usuário e salvamento via `UsuarioRepositorio`.
2. Criação de herói com 20 pontos de atributos e salvamento com itens no inventário.
3. Leitura e reconstituição do herói a partir do banco de dados, confirmando que os métodos de combate continuam funcionando.
4. Aplicação de Soft Delete e verificação de que o herói não aparece mais na lista de heróis ativos.
5. Execução de busca no Códice populado pelo Seed.

---

## 🎯 Quadro de Progresso da Sprint 3

| Chamado | Descrição | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Chamado 0** | Configuração do ORM / Banco de Dados na pasta `backend/` | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 1** | Modelagem do schema relacional com suporte a Soft Delete | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 2** | Implementação do `UsuarioRepositorio.ts` | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 3** | Implementação do `PersonagemRepositorio.ts` e inventário | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 4** | Implementação do `CodiceRepositorio.ts` com busca textual | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 5** | Script de Seed para carregar dados de fábrica (`semear_banco.ts`) | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 6** | Testes de integração de banco de dados (`teste_persistencia.ts`) | Antigravity / Gabriel | ⚪ A Fazer |

---

> ⚠️ **Política de Auto-Atualização Contínua:**  
> Caso o esquema de banco, nome de colunas ou estrutura de repositórios sofra adaptações durante a execução, as interfaces e a documentação da Sprint 4 (API) serão imediatamente sincronizadas.

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

### 🎫 Chamado 0: Escolha e Setup da Camada de Banco de Dados

* **Status:** 🟢 Concluído
* **Prioridade:** Alta (Bloqueante)
* **Local de Execução:** Pasta `backend/`

### 💡 Por que este chamado existe?
Precisamos definir uma ferramenta de banco de dados compatível com TypeScript que permita prototipagem rápida e suporte a produção em nuvem (Vercel / Neon). Adotamos o **PostgreSQL gerenciado no Neon** (`AWS sa-east-1` São Paulo) com **Prisma ORM v5.22.0**.

---

## 🎫 Chamado 1: Modelagem Relacional do Esquema (`schema.prisma`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta
* **Arquivo:** `backend/prisma/schema.prisma`

---

## 🎫 Chamado 2: Repositório de Usuários (`UsuarioRepositorio.ts`)

* **Status:** 🟢 Concluído
* **Prioridade:** Média
* **Arquivo:** `backend/src/infra/repositorios/UsuarioRepositorio.ts`

---

## 🎫 Chamado 3: Repositório de Personagens (`PersonagemRepositorio.ts`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta
* **Arquivo:** `backend/src/infra/repositorios/PersonagemRepositorio.ts`

---

## 🎫 Chamado 4: Repositório de Consulta do Códice (`CodiceRepositorio.ts`)

* **Status:** 🟢 Concluído
* **Prioridade:** Média
* **Arquivo:** `backend/src/infra/repositorios/CodiceRepositorio.ts`

---

## 🎫 Chamado 5: Script de Povoamento Inicial / Seed (`semear_banco.ts`)

* **Status:** 🟢 Concluído
* **Prioridade:** Média
* **Arquivo:** `backend/src/infra/scripts/semear_banco.ts`

---

## 🎫 Chamado 6: Testes de Persistência (`testes/teste_persistencia.ts`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta (Validação da Sprint)
* **Arquivo:** `backend/testes/teste_persistencia.ts`

---

## 🎯 Quadro de Progresso da Sprint 3

| Chamado | Descrição | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Chamado 0** | Configuração do ORM / Neon PostgreSQL na pasta `backend/` | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 1** | Modelagem do schema relacional com suporte a Soft Delete | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 2** | Implementação do `UsuarioRepositorio.ts` | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 3** | Implementação do `PersonagemRepositorio.ts` e inventário | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 4** | Implementação do `CodiceRepositorio.ts` com busca textual | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 5** | Script de Seed para carregar dados de fábrica (`semear_banco.ts`) | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 6** | Testes de integração de banco de dados (`teste_persistencia.ts`) | Antigravity / Gabriel | 🟢 Concluído |

---

> ⚠️ **Política de Auto-Atualização Contínua:**  
> Caso o esquema de banco, nome de colunas ou estrutura de repositórios sofra adaptações durante a execução, as interfaces e a documentação da Sprint 4 (API) serão imediatamente sincronizadas.

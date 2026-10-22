# 📋 Sprint 4: Interface HTTP e API RESTful (Express & Controladores)

**Tech Lead:** Antigravity  
**Desenvolvedor Responsável:** Gabriel  
**Projeto:** *Fracture: The Vaslen Echoes*  
**Objetivo da Sprint:** Construir a camada de apresentação web (API RESTful em Express), expondo todas as regras de domínio e persistência desenvolvidas nas Sprints anteriores através de rotas HTTP protegidas por JWT, validação estrita de requisições (DTOs), orquestração de sessões de combate em tempo real e entrega de dados para o futuro Frontend.

---

## 🧭 Mensagem do Tech Lead

> Fala, dev! Chegamos à **Sprint 4**, a última grande fronteira antes de conectarmos a interface visual do jogo!
> 
> Repare no poder da arquitetura que você construiu até agora:
> 1. Na **Sprint 1**, fizemos o combate em POO pura com gastos táticos de energia e IA de monstros.
> 2. Na **Sprint 2**, catalogamos monstros e itens de fábrica, criamos a enciclopédia (Códice) e construímos o `MotorCombate`.
> 3. Na **Sprint 3**, persistimos tudo com segurança no banco de dados e repositórios.
> 
> Agora, o Express não precisa "reinventar" nada. Ele atua como um **maestro**:
> * Recebe uma requisição HTTP (`POST /api/combate/turno`).
> * Carrega o herói do banco via repositório.
> * Invoca o `MotorCombate` que processa a física e a IA.
> * Salva o novo estado do herói no banco.
> * Devolve um JSON limpo, elegante e pronto para a interface web.
> 
> Vamos transformar nosso motor de jogo em um servidor web profissional!

---

## 🎫 Chamado 0: Setup do Express, Middlewares Globais e CORS

* **Status:** 🟢 Concluído
* **Prioridade:** Alta (Bloqueante)
* **Local de Execução:** Pasta `backend/`

---

## 🎫 Chamado 1: Módulo de Autenticação (`/api/auth`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta
* **Arquivos:**
  * `backend/src/api/controladores/AutenticacaoControlador.ts`
  * `backend/src/api/rotas/autenticacaoRotas.ts`
  * `backend/src/api/middlewares/autenticarToken.ts`

---

## 🎫 Chamado 2: Módulo de Personagens (`/api/personagens`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta
* **Arquivos:**
  * `backend/src/api/controladores/PersonagemControlador.ts`
  * `backend/src/api/rotas/personagemRotas.ts`

---

## 🎫 Chamado 3: Módulo do Códice de Vaslen (`/api/codice`)

* **Status:** 🟢 Concluído
* **Prioridade:** Média
* **Arquivos:**
  * `backend/src/api/controladores/CodiceControlador.ts`
  * `backend/src/api/rotas/codiceRotas.ts`

---

## 🎫 Chamado 4: Módulo de Combate em Tempo Real (`/api/combate`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta (Funcionalidade Principal)
* **Arquivos:**
  * `backend/src/api/controladores/CombateControlador.ts`
  * `backend/src/api/rotas/combateRotas.ts`
  * `backend/src/infra/sessao/GerenciadorSessaoCombate.ts`

---

## 🎫 Chamado 5: Testes de API End-to-End (`testes/teste_api_e2e.ts`)

* **Status:** 🟢 Concluído
* **Prioridade:** Alta (Validação da Sprint)
* **Arquivo:** `backend/testes/teste_api_e2e.ts`

---

## 🎯 Quadro de Progresso da Sprint 4

| Chamado | Descrição | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Chamado 0** | Setup do Express, Middlewares Globais e CORS | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 1** | Módulo de Autenticação (`/api/auth`) com JWT e Bcrypt | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 2** | Módulo de Personagens (`/api/personagens`) com validação de 20 pontos | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 3** | Módulo do Códice (`/api/codice`) e filtros de lore | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 4** | Módulo de Combate (`/api/combate`) orquestrado pelo `MotorCombate` | Gabriel / Antigravity | 🟢 Concluído |
| **Chamado 5** | Testes de API End-to-End em `testes/teste_api_e2e.ts` | Antigravity / Gabriel | 🟢 Concluído |

---

> 🏁 **Próximo Marco:**  
> Com a conclusão da Sprint 4, todo o ecossistema do Backend estará 100% finalizado, com POO pura, persistência relacional e API RESTful documentada, abrindo o caminho para o desenvolvimento do Frontend!

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

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Bloqueante)
* **Local de Execução:** Pasta `backend/`

### 💡 Por que este chamado existe?
Configura a infraestrutura de rede HTTP da aplicação Node.js com segurança e tratamento centralizado de erros.

### 📝 Instalação e Configuração:
1. Instalar dependências de produção e tipos:
   ```bash
   npm install express cors dotenv jsonwebtoken bcrypt
   npm install -D @types/express @types/cors @types/jsonwebtoken @types/bcrypt supertest @types/supertest
   ```
2. Estrutura de pastas da API:
   * `backend/src/api/controladores/`
   * `backend/src/api/rotas/`
   * `backend/src/api/middlewares/`
   * `backend/src/servidor.ts` (ponto de entrada da API)
3. Configuração do `servidor.ts`:
   * Habilitar `express.json()`.
   * Habilitar `cors()` para conexões locais do Frontend.
   * Middleware global de captura de erros: nenhuma exceção quebra o servidor; erros retornam JSON `{ erro: mensagem, status: 400 | 500 }`.

### ✅ Critérios de Aceite:
* Servidor inicia na porta configurada (ex: `http://localhost:3333`).
* Endpoint `GET /api/status` responde `{ status: "online", versao: "1.0.0" }`.

---

## 🎫 Chamado 1: Módulo de Autenticação (`/api/auth`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta
* **Arquivos:**
  * `backend/src/api/controladores/AutenticacaoControlador.ts`
  * `backend/src/api/rotas/autenticacaoRotas.ts`
  * `backend/src/api/middlewares/autenticarToken.ts`

### 💡 Por que este chamado existe?
Garante que cada jogador tenha acesso exclusivo aos seus próprios personagens e partidas salvas.

### 📝 Endpoints a Implementar:
1. **`POST /api/auth/cadastro`**:
   * *Body:* `{ nome, email, senha }`
   * Criptografa a senha com `bcrypt` (salt rounds: 10).
   * Instancia o `Usuario` e salva via `UsuarioRepositorio`.
   * Retorna status `201 Created` e os dados públicos do usuário.
2. **`POST /api/auth/login`**:
   * *Body:* `{ email, senha }`
   * Busca o usuário e valida o hash da senha.
   * Se correto, gera um token JWT contendo `{ id: usuario.id, email: usuario.email }` com expiração de 7 dias.
   * Retorna status `200 OK` com o token e dados do usuário.
3. **Middleware `autenticarToken`**:
   * Intercepta o header `Authorization: Bearer <TOKEN>`.
   * Valida o JWT e injeta `req.usuarioId` para as rotas protegidas seguintes.

### ✅ Critérios de Aceite:
* Tentativas de login com senha incorreta retornam `401 Unauthorized`.
* Tentativas de cadastrar email duplicado retornam `409 Conflict`.
* Rotas protegidas bloqueiam acessos sem token válido.

---

## 🎫 Chamado 2: Módulo de Personagens (`/api/personagens`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta
* **Arquivos:**
  * `backend/src/api/controladores/PersonagemControlador.ts`
  * `backend/src/api/rotas/personagemRotas.ts`

### 💡 Por que este chamado existe?
Permite criar heróis respeitando estritamente a Regra de Negócio RN01 (distribuição exata de 20 pontos de atributos), listar heróis ativos do usuário, evoluir nível e inativar heróis derrotados.

### 📝 Endpoints a Implementar:
1. **`POST /api/personagens`** (Protegido por JWT):
   * *Body:* `{ nome, classe, forca, defesa, agilidade }`
   * Validação de Domínio: A classe `Personagem` valida se `forca + defesa + agilidade === 20`. Se a soma for diferente, devolve `400 Bad Request`.
   * Associa o novo herói ao usuário autenticado e salva via `PersonagemRepositorio`.
2. **`GET /api/personagens`** (Protegido por JWT):
   * Retorna apenas os heróis com `ativo === true` pertencentes ao usuário logado.
3. **`GET /api/personagens/:id`** (Protegido por JWT):
   * Retorna os detalhes completos do herói, incluindo inventário de consumíveis e atributos.
4. **`POST /api/personagens/:id/distribuir-pontos`** (Protegido por JWT):
   * *Body:* `{ forcaAdd, defesaAdd, agilidadeAdd }`
   * Invoca `personagem.distribuirPontos(...)` e persiste a evolução no banco.
5. **`DELETE /api/personagens/:id`** (Protegido por JWT):
   * Executa a inativação do herói (`inativar()`), garantindo o Soft Delete no banco de dados.

### ✅ Critérios de Aceite:
* Heróis com atributos inválidos (ex: soma total diferente de 20) são rejeitados com mensagem explicativa.
* Usuário A não consegue visualizar nem alterar personagens do Usuário B.

---

## 🎫 Chamado 3: Módulo do Códice de Vaslen (`/api/codice`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Média
* **Arquivos:**
  * `backend/src/api/controladores/CodiceControlador.ts`
  * `backend/src/api/rotas/codiceRotas.ts`

### 💡 Por que este chamado existe?
Permite à interface web consultar a enciclopédia viva de Vaslen para leitura da lore, descoberta de monstros e informações de itens.

### 📝 Endpoints a Implementar:
1. **`GET /api/codice`**:
   * *Query Params opcionais:* `?categoria=MONSTRO` ou `?busca=nevoa`
   * Retorna lista de cards formatados via `formatarParaCard()`.
2. **`GET /api/codice/:id`**:
   * Retorna o verbete completo, incluindo o texto aprofundado e tags associadas.
3. **`GET /api/codice/categorias`**:
   * Retorna a lista de categorias disponíveis no mundo de Vaslen.

### ✅ Critérios de Aceite:
* Busca com parâmetro `?busca=termo` retorna apenas registros correspondentes.
* Respostas em JSON estruturadas para fácil renderização em cards no frontend.

---

## 🎫 Chamado 4: Módulo de Combate em Tempo Real (`/api/combate`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Funcionalidade Principal)
* **Arquivos:**
  * `backend/src/api/controladores/CombateControlador.ts`
  * `backend/src/api/rotas/combateRotas.ts`
  * `backend/src/infra/sessao/GerenciadorSessaoCombate.ts`

### 💡 Por que este chamado existe?
O combate ocorre em turnos. Quando o jogador clica em "Iniciar Batalha", uma sessão é aberta vinculando seu `Personagem` a um `Monstro` sorteado de fábrica. A cada rodada, o jogador envia sua ação, o servidor processa o turno no `MotorCombate`, atualiza o estado e devolve o feedback visual imediato.

### 📝 Endpoints a Implementar:
1. **`POST /api/combate/iniciar`** (Protegido por JWT):
   * *Body:* `{ personagemId, tipoMonstro?: 'COMUM' | 'ELITE' | 'CHEFE' }`
   * Carrega o herói ativo do banco.
   * Cria o monstro apropriado via `FabricaMonstros`.
   * Inicializa o `MotorCombate` e armazena a sessão ativa na memória/cache.
   * Retorna os dados iniciais do encontro (quem tem iniciativa, status de vida e energia de ambos).
2. **`POST /api/combate/turno`** (Protegido por JWT):
   * *Body:* `{ sessaoId, acao: { tipo: 'ATACAR' | 'DEFENDER' | 'USAR_ITEM', indiceAtaque?: number, idItem?: string } }`
   * Executa a jogada do jogador e a IA autônoma do monstro via `motorCombate.processarAcaoJogador(acao)`.
   * Se a batalha terminar:
     * **Vitória:** Persiste o XP ganho e o item dropado no banco de dados do herói via `PersonagemRepositorio`.
     * **Derrota:** Inativa o personagem no banco de dados (`ativo = false`).
   * Retorna o relatório do turno (danos, esquivas, gastos de energia e log de texto narrativo).
3. **`GET /api/combate/:sessaoId`** (Protegido por JWT):
   * Retorna o estado atual da batalha em andamento.

### ✅ Critérios de Aceite:
* Jogador não pode agir fora do seu turno ou em batalhas já encerradas.
* Vitória atualiza inventário e XP do personagem no banco de forma atômica.
* Derrota inativa o personagem com confirmação de Soft Delete.

---

## 🎫 Chamado 5: Testes de API End-to-End (`testes/teste_api_e2e.ts`)

* **Status:** ⚪ A Fazer
* **Prioridade:** Alta (Validação da Sprint)
* **Arquivo:** `backend/testes/teste_api_e2e.ts`

### 📝 O que será testado com Supertest:
1. Fluxo de ponta a ponta: Cadastro de usuário ➡️ Login ➡️ Criação de personagem com 20 pontos exatos.
2. Rejeição de personagem inválido com código HTTP `400`.
3. Consulta de entradas do Códice com busca por termo.
4. Inicialização de combate HTTP, envio de turno e recepção de resposta JSON com log narrativo.
5. Adicionar comando de conveniência no `package.json`:
   ```json
   "testar:api": "tsx testes/teste_api_e2e.ts"
   ```

---

## 🎯 Quadro de Progresso da Sprint 4

| Chamado | Descrição | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Chamado 0** | Setup do Express, Middlewares Globais e CORS | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 1** | Módulo de Autenticação (`/api/auth`) com JWT e Bcrypt | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 2** | Módulo de Personagens (`/api/personagens`) com validação de 20 pontos | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 3** | Módulo do Códice (`/api/codice`) e filtros de lore | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 4** | Módulo de Combate (`/api/combate`) orquestrado pelo `MotorCombate` | Gabriel / Antigravity | ⚪ A Fazer |
| **Chamado 5** | Testes de API End-to-End em `testes/teste_api_e2e.ts` | Antigravity / Gabriel | ⚪ A Fazer |

---

> 🏁 **Próximo Marco:**  
> Com a conclusão da Sprint 4, todo o ecossistema do Backend estará 100% finalizado, com POO pura, persistência relacional e API RESTful documentada, abrindo o caminho para o desenvolvimento do Frontend!

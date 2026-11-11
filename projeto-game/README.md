# ⚔️ Fracture: The Vaslen Echoes

RPG tático de combate por turnos em Pixel Art 2D desenvolvido como projeto acadêmico da disciplina de **Programação Orientada a Objetos (POO)**.

---

## 🚀 Como Executar o Projeto (Para Avaliação)

### Pré-requisitos
* **Node.js** (versão 18 ou superior instalada na máquina).
* **Conexão com a Internet** (para instalar as dependências na primeira execução e conectar ao banco PostgreSQL na nuvem via Neon).

> **Sobre o Banco de Dados:** O projeto entregue via pacote `.zip` já acompanha o arquivo `backend/.env` apontando para o banco **Neon PostgreSQL** já populado com o Códice e tabelas prontas. Não é necessário instalar nem configurar PostgreSQL localmente.

---

### Opção 1 — Execução Automática com 1 Clique (Windows - Recomendado)
1. Extraia toda a pasta do projeto para um diretório de sua preferência.
2. Dê dois cliques no arquivo **`Iniciar_Vaslen_Echoes.bat`** (na raiz da pasta `projeto-game`).
   * *Caso o Windows exiba o aviso do SmartScreen ("O Windows protegeu o computador"), clique em **Mais informações > Executar assim mesmo**.*
3. Na primeira execução, o inicializador irá instalar automaticamente as dependências (`npm install` e `npx prisma generate`), subir a API (porta `3333`) e o Frontend (porta `5173`), abrindo o jogo direto no navegador em `http://localhost:5173`.
4. Ao finalizar a avaliação, volte na janela preta do inicializador e pressione qualquer tecla para encerrar os servidores com segurança.

---

### Opção 2 — Execução Manual via Terminal (Windows / Linux / Mac)

Abra **dois terminais** dentro da pasta `projeto-game`:

**Terminal 1 — Backend (API RESTful):**
```bash
cd backend
npm install
npx prisma generate
npm run iniciar
```

**Terminal 2 — Frontend (Interface React + Vite):**
```bash
cd frontend
npm install
npm run dev
```

Depois, acesse no navegador: **`http://localhost:5173`**

*(Nota: caso clone diretamente do GitHub sem o arquivo `.env`, crie `backend/.env` com `DATABASE_URL`, `PORT=3333` e `JWT_SECRET` e execute `npx prisma db push` seguido de `npm run banco:semear`).*

---

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js, TypeScript, Express 5, Prisma ORM, PostgreSQL (Neon Cloud), JWT (`jsonwebtoken`) e `bcrypt`.
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons e Spritesheets em Pixel Art 2D.

---

## 🏛️ Arquitetura e Pilares de POO Aplicados

* **Abstração & Encapsulamento:**
  * [`backend/src/dominio/entidades/EntidadeCombatente.ts`](backend/src/dominio/entidades/EntidadeCombatente.ts) — Classe abstrata base para combatentes, encapsulando atributos vitais, postura defensiva e mitigação de dano.
  * [`backend/src/dominio/entidades/usuario.ts`](backend/src/dominio/entidades/usuario.ts) e [`EntradaCodice.ts`](backend/src/dominio/entidades/EntradaCodice.ts) — Gestão de conta/heróis e busca indexada no Códice de 40 verbetes.
* **Herança & Polimorfismo:**
  * [`backend/src/dominio/entidades/personagem.ts`](backend/src/dominio/entidades/personagem.ts) e [`monstro.ts`](backend/src/dominio/entidades/monstro.ts) — Especializações de `EntidadeCombatente` com técnicas de classe (`GUERREIRO`, `MAGO`, `SAMURAI`), IA reativa dos monstros e cálculo de recompensas/Soft Delete.
  * [`backend/src/dominio/entidades/Item.ts`](backend/src/dominio/entidades/Item.ts) — Hierarquia entre `Item` e `ItemComposto`, sobrescrevendo `aplicarEfeito` para restauração simultânea de vida e energia.
* **Orquestração & Regras de Domínio:**
  * [`backend/src/dominio/servicos/MotorCombate.ts`](backend/src/dominio/servicos/MotorCombate.ts) — Controle de turnos, iniciativa, economia de energia e condições de vitória/derrota.
  * Regra de 20 pontos iniciais validada no servidor, Mural de Caçadas Únicas (Anti-Farm) em 7 biomas com 21 monstros únicos e morte permanente via **Soft Delete** no PostgreSQL.

---

## 🧪 Scripts de Testes (Backend)

Dentro da pasta `backend/`, você pode executar os testes automatizados:

```bash
npm run testar          # Testes de entidades e polimorfismo
npm run testar:motor    # Testes do motor de combate e Códice
npm run testar:banco    # Testes de persistência com Prisma
npm run testar:api      # Testes E2E das rotas HTTP da API
```

---

## 📄 Documentação Completa

Os documentos consolidados de requisitos, diagramas UML/Mermaid e arquitetura de POO encontram-se na pasta **`config_docs/entregas/`** (nos formatos `.md`, `.html`, `.pdf` e `.docx`).

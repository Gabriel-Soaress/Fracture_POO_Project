# 📋 Sprint 1: Fundação do Domínio e Setup do Backend

**Tech Lead:** Antigravity  
**Desenvolvedor Responsável:** Gabriel  
**Projeto:** *Fracture: The Vaslen Echoes*  
**Objetivo da Sprint:** Inicializar o ecossistema do backend e construir o "coração" das regras de negócio do jogo (Camada de Domínio) utilizando Orientação a Objetos pura, sem interferência de bibliotecas web ou bancos de dados neste momento.

---

## 🧭 Mensagem do Tech Lead

> Fala, dev! Chegamos na fase de botar a mão na massa. 
> 
> Como combinamos, aqui você vai codar **na raça**, linha por linha. O meu papel aqui é ser seu guia técnico e Tech Lead: vou quebrar as demandas em chamados claros, te explicar a arquitetura, o porquê de cada pasta existir e quais regras de POO você precisa aplicar. 
> 
> **Regra de Ouro do Nosso Projeto:**
> 1. Toda a nossa nomenclatura própria (nomes de arquivos, classes, métodos e variáveis) é obrigatoriamente em **Português do Brasil (PT-BR)**.
> 2. A pasta `src/dominio/` é **sagrada**: ela não pode importar Express, banco de dados, nem bibliotecas externas. Ela é POO pura e independente. Se no futuro trocarmos o Express por outro framework ou o banco por arquivos de texto, essa pasta continua funcionando sem mudar uma única vírgula.
> 
> Vamos para os nossos chamados da Sprint 1!

---

## 🎫 Chamado 0: Preparação do Terreno (Setup Node + TypeScript)

* **Status:** Concluído ✅
* **Prioridade:** Alta (Bloqueante)
* **Local de Execução:** Pasta `projeto-game/backend/`

### 💡 Por que esse chamado existe?
O JavaScript nativo é dinamicamente tipado. Para um projeto que vai demonstrar rigor acadêmico de POO (com classes abstratas, contratos de interfaces e encapsulamento estrito), o **TypeScript** nos fornece checagem de tipos em tempo de desenvolvimento e ferramentas nativas de orientação a objetos que evitam bugs bobos antes mesmo do código rodar.

### 📝 O que foi feito:

#### Passo 1: Navegar até o diretório do backend
```bash
cd "projeto-game/backend"
```

#### Passo 2: Inicializar o projeto Node.js
```bash
npm init -y
```

#### Passo 3: Instalar as ferramentas de desenvolvimento do TypeScript
```bash
npm install -D typescript tsx @types/node
```

#### Passo 4: Configuração limpa e estável do `tsconfig.json`
O arquivo `tsconfig.json` final e validado para o nosso backend Node.js é:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

#### Passo 5: Configurar o script de teste no `package.json`
No `package.json`, adicionamos o comando de execução rápida com `tsx`:
```json
"scripts": {
  "testar": "tsx testes/teste_entidades.ts"
}
```

---

### 🎓 Raio-X do Tech Lead: Entendendo a fundo cada configuração

> **"Tech Lead, é sempre assim em todo projeto? O que significa cada uma dessas linhas?"**

Boa pergunta, dev! Essa é a diferença entre quem só copia e cola e quem realmente entende a engenharia por trás da ferramenta. Vamos dissecar o que significa cada chave e se isso é padrão da indústria:

#### 1. "É sempre assim em todo projeto?"
**Não exatamente, mas a estrutura conceitual é sempre a mesma.** 
Todo projeto TypeScript precisa de um `tsconfig.json`, mas as opções variam dependendo do **ambiente onde o código vai rodar**:
* **No Frontend (React/Vite/Next):** O target e módulo costumam ser voltados para navegadores (ESM / ESNext) e incluem configurações de JSX (`"jsx": "react-jsx"`).
* **No Backend (Node.js):** O código roda no servidor. Dependendo da versão do Node e da biblioteca que usamos, configuramos para CommonJS ou ESM (NodeNext). 
* Quando você roda `npx tsc --init`, ele cria um arquivo enorme com dezenas de opções comentadas com explicações em inglês. Aquilo é um catálogo de tudo o que o TypeScript pode fazer, mas um bom projeto profissional costuma manter apenas as opções ativas e necessárias para o seu caso de uso (como deixamos o nosso).

---

#### 2. O que significa `"target": "ES2022"` e por que trocamos?
* **O que é o Target?** O TypeScript **não roda diretamente**. Ele é transcompilado (traduzido) para JavaScript puro que o Node.js consiga entender. O `"target"` define **para qual versão do JavaScript** o seu código TypeScript será convertido.
* **A Linha do Tempo (ECMAScript):**
  * *ES5 (2009):* O JavaScript antigo. Não existia a palavra-chave `class`, nem `let`, nem `const`. Se você colocar `target: "ES5"`, o compilador converte suas classes elegantes em funções construtoras com `prototype`.
  * *ES6 / ES2015:* Revolucionou o JS trazendo `class`, `extends`, `const`, `let`, Arrow Functions e `Promise`.
  * *ES2022:* Trouxe suporte nativo a **campos privados de classes com `#`** (ex: `#vida`), blocos de inicialização estáticos e métodos nativos de array modernos.
* **Por que ES2022?** Porque o Node.js moderno (como o Node v24 que você está usando) suporta com sobra todos os recursos do ES2022. Definir `"target": "ES2022"` diz ao TypeScript: *"Gere um JavaScript moderno, limpo e direto, sem precisar criar gambiarras para simular classes antigas"*.

---

#### 3. O que significa cada uma das outras opções?

* **`"module": "CommonJS"`**:
  * Define como os arquivos importam e exportam código entre si. O ecossistema Node.js clássico usa CommonJS (`require` / `module.exports`).
  * No TypeScript, nós sempre escrevemos a sintaxe moderna de POO (`import { X } from './X'` e `export class ...`), e o compilador traduz isso de forma transparente e estável, sem exigir que você fique colocando a extensão `.js` no final de cada import (que é uma exigência chata do NodeNext/ESM puro).

* **`"rootDir": "./src"` e `"outDir": "./dist"`**:
  * **`rootDir`**: Informa onde está a raiz do seu código-fonte principal que será compilado para produção (pasta `src/`).
  * **`outDir`**: Informa para onde vai o JavaScript final quando você rodar o comando de compilação `npx tsc` (pasta `dist/` - de *distribution*). Seu código limpo em TS fica em `src/` e o produto final compilado vai para `dist/`.

* **`"strict": true` (A Alma do TypeScript)**:
  * Ativa o modo estrito. Ele impede que você acesse propriedades de variáveis que podem ser `null` ou `undefined`, força que todos os parâmetros tenham tipo declarado e garante que atributos de classes sejam devidamente inicializados no construtor. Isso é vital para ensinar boas práticas de POO.

* **`"esModuleInterop": true`**:
  * Permite importar bibliotecas legadas do ecossistema Node que usavam `module.exports` como se fossem módulos padrão (ex: `import express from 'express'` em vez de `import * as express from 'express'`).

* **`"skipLibCheck": true`**:
  * Otimiza a velocidade de compilação ignorando a checagem interna de tipos de arquivos dentro de `node_modules`. Só checa o **seu** código, acelerando o processo.

* **`"forceConsistentCasingInFileNames": true`**:
  * Evita problemas entre sistemas operacionais. No Windows, `arquivo.ts` e `Arquivo.ts` são vistos como o mesmo arquivo, mas no Linux (servidores na nuvem), eles são arquivos diferentes. Essa regra garante que você nunca importe arquivos com letras maiúsculas/minúsculas divergentes do nome real no disco.

* **`"include": ["src/**/*"]`**:
  * Diz ao compilador `tsc`: *"Ao compilar para a pasta de produção `dist/`, pegue todos os arquivos dentro de `src/`"*.
  * **Por que não colocamos `testes` aqui?** Porque scripts de teste não devem ser compilados para a pasta de distribuição final do servidor. Para os testes, usamos o `tsx` (que executa diretamente no terminal).

---

#### 4. Por que configuramos o script `"testar": "tsx testes/teste_entidades.ts"` no `package.json`?
No `package.json`, o bloco `"scripts"` funciona como um painel de atalhos rápidos do projeto:
* Em vez de você ter que digitar todo o comando longo no terminal todas as vezes (`npx tsx testes/teste_entidades.ts`), basta rodar:
  ```bash
  npm run testar
  ```
* O `npm run` consulta o `package.json`, encontra o comando associado àquela palavra e o executa no ambiente local com todas as dependências do projeto mapeadas.

---

### ✅ Critérios de Aceite:
* O arquivo `package.json` existe dentro de `backend/` contendo as dependências de TypeScript e o script `"testar"`.
* O arquivo `tsconfig.json` existe e está configurado e validado.
* A pasta `node_modules/` e o arquivo `package-lock.json` foram criados dentro de `backend/`.
* Teste de sanidade do ambiente executado com sucesso no terminal.

---

## 🎫 Chamado 1: A Abstração Base dos Combatentes (`EntidadeCombatente.ts`)

* **Status:** Concluído ✅
* **Prioridade:** Alta
* **Arquivo a Criar:** `backend/src/dominio/entidades/EntidadeCombatente.ts`

### 💡 Por que este arquivo e esta pasta?
Na arquitetura em camadas, a pasta `src/dominio/entidades/` guarda os modelos fundamentais do mundo real que o sistema simula. 
Tanto o herói que o jogador cria quanto os monstros que ele enfrenta são seres que entram na arena, possuem vida e trocam socos/magias. Em vez de duplicar código de vida, ataque e cálculo de dano no Guerreiro e no Boss, nós **abstraímos** essas características comuns em uma classe mãe. Ela deve ser **abstrata** porque ninguém batalha contra uma "Entidade Combatente genérica", mas sim contra um monstro específico ou com um personagem específico.

### 📝 O que a classe deve conter:

1. **Declaração:** A classe deve ser exportada e declarada como abstrata:
   ```typescript
   export abstract class EntidadeCombatente
   ```

2. **Atributos Protegidos (Encapsulamento):**
   * `protected id: number`
   * `protected nome: string`
   * `protected nivel: number`
   * `protected vidaMaxima: number`
   * `protected vidaAtual: number`
   * `protected energiaMaxima: number` *(NOVO: Recurso tático de mana/estamina)*
   * `protected energiaAtual: number` *(NOVO: Energia para custear ataques e habilidades)*
   * `protected forca: number`
   * `protected defesa: number`
   * `protected agilidade: number`
   * `protected estadoDefesa: boolean`
   * `protected modificadorDano: number` *(NOVO: Padrão 1.0; aumentado por Vantagem ou diminuído por Desvantagem)*

3. **Construtor:**
   * Deve receber os dados vitais: `nome`, `nivel`, `vidaMaxima`, `vidaAtual`, `energiaMaxima`, `forca`, `defesa`, `agilidade`.
   * **O `id` como opcional:** `id?: number` (se não passar, assume `0`).
   * **Valores automáticos de início de batalha:** 
     * `this.estadoDefesa = false;`
     * `this.energiaAtual = energiaMaxima;` *(começa com energia cheia)*
     * `this.modificadorDano = 1.0;` *(sem buff nem debuff inicial)*

4. **Métodos Básicos de Ação:**
   * `atacar(alvo: EntidadeCombatente): number`:
     * O golpe físico básico que qualquer combatente pode desferir.
     * Calcula o dano considerando `(this.forca * this.modificadorDano)`.
     * Aplica `alvo.receberDano(...)`.
   * `receberDano(valorDano: number): void`:
     * Deduz o dano da vida atual. Se estiver em `estadoDefesa === true`, mitiga o dano (ex: reduz pela metade).
     * **Regra de Negócio (RN02):** A vida nunca deve ficar negativa. Se o dano for maior que a vida restante, zere para `0`.
   * `curarVida(quantidade: number): void`:
     * Restaura pontos de vida, sem ultrapassar a `vidaMaxima`.
   * `defender(): void`:
     * Altera `estadoDefesa` para `true` para mitigar dano no próximo turno.
     * **Recuperação tática de Energia:** Defender também descansa o combatente, recuperando uma porção de energia (ex: `this.recuperarEnergia(15)`).
   * `redefinirDefesa(): void`:
     * Retorna `estadoDefesa` para `false` no início do seu turno.
   * `estaDerrotado(): boolean`:
     * Retorna `true` se `vidaAtual === 0`.
   * `calcularIniciativa(): number`:
     * Retorna o valor de agilidade (+ aleatoriedade se desejar) para definir quem ataca primeiro no turno.

5. **Métodos de Gestão de Energia e Modificadores (NOVO):**
   * `gastarEnergia(quantidade: number): boolean`:
     * Se `this.energiaAtual >= quantidade`, subtrai o custo e retorna `true`.
     * Se não tiver energia suficiente, não desconta nada e retorna `false` (impedindo a ação).
   * `recuperarEnergia(quantidade: number): void`:
     * Restaura pontos de energia respeitando o teto de `energiaMaxima`.
   * `aplicarModificadorDano(fator: number): void`:
     * Altera temporariamente o poder de ataque (ex: `1.5` para Vantagem de +50% de dano, `0.7` para Desvantagem de -30% de dano).
   * `redefinirModificadorDano(): void`:
     * Reseta o multiplicador de volta para `1.0`.

6. **Métodos Getters (Acesso Controlado):**
   * `getId(): number`
   * `getNome(): string`
   * `getNivel(): number`
   * `getVidaAtual(): number`
   * `getVidaMaxima(): number`
   * `getEnergiaAtual(): number`
   * `getEnergiaMaxima(): number`
   * `getForca(): number`
   * `getDefesa(): number`
   * `getAgilidade(): number`
   * `isDefendendo(): boolean`
   * `getModificadorDano(): number`

7. **Método Abstrato (Polimorfismo Obrigatório):**
   ```typescript
   abstract executarAcaoEspecial(alvo: EntidadeCombatente): string;
   ```

---

---

### 🎓 Raio-X do Tech Lead: Por que o método abstrato é necessário, como funcionam os Getters e os Modificadores de Dano?

> **"Tech Lead, tire minhas dúvidas: para que servem os Getters? Por que deu erro quando escrevi só `getNome(): string;`? E como funciona o `aplicarModificadorDano` se o ataque já multiplica lá em cima?"**

Excelente! Essas três dúvidas tocam no cerne da engenharia de software e de POO:

#### 1. Para que servem os Getters e por que precisamos do corpo `{ return this.nome; }`?
* **O Princípio do Encapsulamento:** Nós definimos os atributos como `protected` (ex: `protected vidaAtual: number;`). Isso significa que ninguém de fora da classe (nem o motor de combate, nem a tela, nem os testes) pode fazer `combatente.vidaAtual = 9999;` burlar as regras.
* **O Problema:** Mas o motor de combate precisa saber se a vida do monstro está em 50 ou 0 para exibir na tela! Se o atributo é protegido, como ele lê? Através dos **Getters**!
* **Por que deu o erro `TS2391: Function implementation is missing`?**
  * Quando você escreve `getNome(): string;` (com ponto e vírgula no final), você está criando uma **assinatura de interface** ou um método abstrato sem código.
  * Em uma classe concreta, o compilador exige que o método tenha **implementação física** (o corpo entre chaves):
    ```typescript
    getNome(): string {
        return this.nome; // <- Lê o atributo protegido de forma segura e somente-leitura!
    }
    ```
  * Assim, quem estiver de fora consegue ler o nome (`console.log(heroi.getNome())`), mas não consegue alterar o nome diretamente sem permissão.

---

#### 2. Como funciona o `aplicarModificadorDano`?
Essa foi uma dúvida genial sua. Vamos ver o fluxo completo:
1. No início da luta, o combatente nasce com `this.modificadorDano = 1.0;` (ou seja, 100% do dano normal).
2. No método `atacar(alvo)`, o dano é calculado lendo esse atributo:
   ```typescript
   const dano = Math.round(this.forca * this.modificadorDano);
   ```
   Se a força for 10: `10 * 1.0 = 10` de dano.
3. Agora imagine que o herói bebe uma **Poção de Fúria (Vantagem)**. O item executa:
   ```typescript
   heroi.aplicarModificadorDano(1.5); // Aumenta o dano em 50%!
   ```
   O corpo do método `aplicarModificadorDano` faz apenas:
   ```typescript
   aplicarModificadorDano(fator: number): void {
       this.modificadorDano = fator; // Altera o estado interno!
   }
   ```
4. No próximo turno, quando o herói atacar novamente, o mesmo método `atacar` vai rodar:
   `10 * 1.5 = 15` de dano!
5. Depois do golpe, o sistema chama `redefinirModificadorDano()`, que faz `this.modificadorDano = 1;` e o efeito passa!
* **Resumo:** `atacar` é quem **consome** o valor. `aplicarModificadorDano` é quem **muda** o valor quando um item ou magia é usado!

---

#### 3. Por que o `id?: number` opcional deve ficar no final do construtor?
No TypeScript e JavaScript, parâmetros opcionais (com `?`) não podem vir antes de parâmetros obrigatórios.
* Se `id` ficasse na frente: `constructor(id?: number, nome: string, ...)`
* Toda vez que você fosse criar um herói na memória sem ID, você seria forçado a escrever:
  `new Personagem(undefined, "Arthur", 1, ...)` -> Feio e propenso a erros.
* Deixando no final: `constructor(nome: string, ..., id?: number)`
* Você pode simplesmente chamar: `new Personagem("Arthur", 1, ...)` sem passar nada no final! O construtor faz `this.id = id ?? 0;` de forma limpa e elegante.

---

#### 4. Por que o método `abstract` é estritamente necessário?
* Ao declarar `abstract executarAcaoEspecial(alvo: EntidadeCombatente): string;`, a classe mãe cria um **contrato obrigatório**.
* Ela diz ao compilador: *"Eu não sei o que cada combatente faz de especial (o Guerreiro bate com escudo, o Mago solta fogo e o Boss solta trevas), mas eu OBRIGO qualquer classe filha a implementar sua própria versão. Se esquecer, o código nem compila!"*. Isso é o **Polimorfismo puro**.

---

### ✅ Critérios de Aceite:
* Classe abstrata `EntidadeCombatente` declarada e exportada.
* Atributos `protected` encapsulados com getters públicos correspondentes devidamente implementados.
* Métodos `atacar()`, `receberDano()`, `curarVida()`, `defender()`, `redefinirDefesa()`, `estaDerrotado()`, `gastarEnergia()`, `recuperarEnergia()` e `calcularIniciativa()` implementados e testados.
* Assinatura do método abstrato `executarAcaoEspecial(alvo: EntidadeCombatente): string` declarada sem corpo.
* Construtor tratando `id?: number` no final dos parâmetros e inicializando `estadoDefesa = false`.

---

## 🎫 Chamado 2: A Entidade dos Itens e Consumíveis (`Item.ts`)

* **Status:** Concluído ✅
* **Prioridade:** Média
* **Arquivo:** `backend/src/dominio/entidades/Item.ts`

### 💡 Por que este arquivo?
Em um RPG tático, a vitória não depende apenas de força bruta, mas da gestão de recursos. A classe `Item` encapsula consumíveis que alteram o estado da batalha: curam vida, recuperam energia ou aplicam buffs táticos de **Reforço de Dano** (`REFORCO_DANO`), aumentando o dano da próxima rodada.

### 📝 O que a classe contém:
1. **Atributos Protegidos (Encapsulamento):**
   * `protected id: number`
   * `protected nome: string` (ex: "Poção de Sangue Antigo", "Elixir de Foco", "Óleo de Fogo")
   * `protected tipo: 'CURA_VIDA' | 'RECUPERA_ENERGIA' | 'REFORCO_DANO'`
   * `protected valorEfeito: number` (ex: `30` para curar 30 de HP, `25` para recuperar 25 de energia, `1.5` ou valor de reforço de dano)
   * `protected descricao: string`
2. **Construtor:** Recebe todos os atributos essenciais para instanciar o item.
3. **Método Principal de Ação:**
   * `aplicarEfeito(alvo: EntidadeCombatente): string`:
     * Avalia o `this.tipo`:
       * Se `'CURA_VIDA'`: chama `alvo.curarVida(this.valorEfeito)` e retorna mensagem de vida recuperada.
       * Se `'RECUPERA_ENERGIA'`: chama `alvo.recuperarEnergia(this.valorEfeito)` e retorna mensagem de energia restaurada.
       * Se `'REFORCO_DANO'`: chama `alvo.aplicarModificadorDano(this.valorEfeito)` e retorna mensagem informando o dano extra aplicado na rodada.
4. **Getters:** Para `getId()`, `getNome()`, `getTipo()`, `getValorEfeito()` e `getDescricao()`.

### ✅ Critérios de Aceite:
* Classe `Item` instanciável com tipos de efeitos `'CURA_VIDA'`, `'RECUPERA_ENERGIA'` e `'REFORCO_DANO'`.
* Método `aplicarEfeito` altera os atributos da `EntidadeCombatente` alvo com retorno descritivo.
* Getters encapsulando com segurança todos os atributos protegidos.

---

## 🎫 Chamado 3: O Herói do Jogador (`Personagem.ts`)

* **Status:** Pendente
* **Prioridade:** Alta
* **Arquivo a Criar:** `backend/src/dominio/entidades/Personagem.ts`

### 💡 Por que este arquivo?
O `Personagem` é a especialização da `EntidadeCombatente`. Ele representa o jogador humano. Além de lutar, ele gerencia seu **inventário de itens**, seus **3 ataques de classe com custo de energia**, sua progressão de nível e a validação rígida dos 20 pontos.

### 📝 O que a classe deve conter:
1. **Herança:** `export class Personagem extends EntidadeCombatente`. No construtor, use `super(...)` repassando os parâmetros vitais (incluindo `energiaMaxima`).
2. **Atributos Específicos:**
   * `classeHeroi` (string: `'GUERREIRO'`, `'MAGO'` ou `'ARQUEIRO'`)
   * `experienciaAtual` (number, começa em 0)
   * `experienciaNecessaria` (number, calculado pela fórmula `nivel * 100`)
   * `pontosLivres` (number, começa em 0)
   * `ativo` (boolean, começa em `true` para representar o Soft Delete)
   * `idUsuario` (string ou number, identificando o dono)
   * `inventario` (Item[] - lista de itens que o herói carrega)
3. **Regra de Negócio Crucial (RN01 - Validação dos 20 Pontos):**
   * Verificação obrigatória: `forca + defesa + agilidade === 20`. Se divergir ou se algum for negativo, lance um erro (`throw new Error(...)`).
4. **Gestão de Inventário:**
   * `adicionarItemAoInventario(item: Item): void`: Insere o item na lista.
   * `usarItemDoInventario(indice: number, alvo?: EntidadeCombatente): string`: Remove o item do inventário, aplica o efeito no alvo (ou em si mesmo se nenhum alvo for passado) e retorna a mensagem.
5. **Repertório de 3 Ataques com Custo de Energia:**
   * Crie um método ou ações específicas com custos progressivos de energia:
     * **Ataque 1 (Leve / Rápido):** Custo: `10` de energia. Dano: `Força * 1.0`.
     * **Ataque 2 (Pesado / Habilidade):** Custo: `25` de energia. Dano: `Força * 1.6`.
     * **Ataque 3 (Técnica de Classe):** Custo: `40` de energia. Dano: `Força * 2.2`.
     * **Validação de Energia:** Antes de desferir o golpe, verifique `if (!this.gastarEnergia(custo)) return "Energia insuficiente! Use defender para descansar!";`.
6. **Implementação do Polimorfismo (Ação Especial):**
   * Implemente `executarAcaoEspecial(alvo: EntidadeCombatente): string`:
     * Custo elevado de energia (ex: `50` pontos).
     * Dano massivo baseado na `classeHeroi` com narrativa própria.
7. **Métodos de Progressão:**
   * `ganharExperiencia(qtd: number): void`
   * `subirNivel(): void` (sobe nível, eleva vidaMaxima e energiaMaxima, dá pontosLivres)
   * `distribuirPontos(forcaAdd, defesaAdd, agilidadeAdd): void`
   * `inativar(): void` (Soft Delete)

### ✅ Critérios de Aceite:
* Validação dos 20 pontos de atributos funcionando no construtor.
* Ataques falham se o herói não tiver energia suficiente.
* Inventário permite adicionar e consumir itens aplicando os efeitos na batalha.

---

## 🎫 Chamado 4: As Ameaças de Vaslen (`Monstro.ts`)

* **Status:** Pendente
* **Prioridade:** Média
* **Arquivo a Criar:** `backend/src/dominio/entidades/Monstro.ts`

### 💡 Por que este arquivo?
Os inimigos também combatem e agora também gerenciam sua estamina/energia para agir taticamente.

### 📝 O que a classe deve conter:
1. **Herança:** `export class Monstro extends EntidadeCombatente`.
2. **Atributos Específicos:**
   * `tipoMonstro` (string: `'COMUM'`, `'ELITE'` ou `'CHEFE'`)
   * `experienciaConcedida` (number)
   * `descricaoLore` (string)
3. **Métodos Específicos:**
   * `decidirAcao(alvo: EntidadeCombatente): { tipo: 'ATACAR' | 'DEFENDER' | 'ESPECIAL', mensagem: string }`:
     * **IA Tática de Energia:** Se a `energiaAtual < 20`, o monstro opta por `defender()` para descansar e recuperar energia! Se tiver energia alta e vida baixa, tenta o golpe especial. Caso contrário, ataca normalmente.
   * Implementação de `executarAcaoEspecial(alvo: EntidadeCombatente): string`.

---

## 🎫 Chamado 5: Campo de Batalha de Teste (`testes/teste_entidades.ts`)

* **Status:** Pendente
* **Prioridade:** Alta (Validação da Sprint)
* **Arquivo a Criar:** `backend/testes/teste_entidades.ts`

### 📝 O que você deve testar:
1. Instanciar um `Personagem` com 20 pontos distribuídos.
2. Instanciar um `Monstro`.
3. Instanciar itens (ex: `Poção de Vida` e `Elixir de Energia`) e colocar no inventário do herói.
4. Simular o combate rodada a rodada:
   * Herói gasta energia para atacar;
   * Herói fica com pouca energia e tenta um golpe caro (verificando que falha por falta de energia);
   * Herói usa `defender()` para mitigar dano e recuperar energia;
   * Herói usa a poção de cura/energia do inventário;
   * Monstro age com sua IA baseada em energia;
   * Imprimir os logs das rodadas no console.
5. Executar no terminal:
   ```bash
   npm run testar
   ```

---

## 🎯 Quadro de Progresso da Sprint 1

| Chamado | Descrição | Responsável | Status |
| :--- | :--- | :--- | :--- |
| **Chamado 0** | Setup de Node.js + TypeScript na pasta `backend/` | Gabriel | 🟢 Concluído |
| **Chamado 1** | Implementação da base `EntidadeCombatente.ts` (Vida, Energia e Ações) | Gabriel | 🟢 Concluído |
| **Chamado 2** | Implementação da classe `Item.ts` (Consumíveis, Cura, Energia e Reforço de Dano) | Gabriel | 🟢 Concluído |
| **Chamado 3** | Implementação de `Personagem.ts` (Inventário, 3 Ataques com Custo e XP) | Gabriel | 🟡 Em Andamento (Próximo) |
| **Chamado 4** | Implementação de `Monstro.ts` (IA de Energia e Lore) | Gabriel | ⚪ Pendente |
| **Chamado 5** | Script de simulação de combate em `testes/teste_entidades.ts` | Gabriel | ⚪ Pendente |

---

> Chamados 0, 1 e 2 aprovados e validados com sucesso (zero erros de compilação no TypeScript)! O próximo passo é o **Chamado 3**: criar a classe `Personagem.ts` em `backend/src/dominio/entidades/`. Bora pra cima! 🚀


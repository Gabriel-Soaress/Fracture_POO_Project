import { Personagem } from "../src/dominio/entidades/personagem";
import { Monstro } from "../src/dominio/entidades/Monstro";
import { Item } from "../src/dominio/entidades/Item";

console.log("================================================================================");
console.log("       ⚔️  FRACTURE: THE VASLEN ECHOES - COMBATE JUSTO E SISTEMA DE LOOT  ⚔️    ");
console.log("================================================================================\n");

// 1. Instanciando o Herói (Começa do zero: SEM ITENS NO INVENTÁRIO)
const heroi = new Personagem(
    "Arthur de Vaslen", 1, 100, 100, 70, 8, 6, 6, "GUERREIRO", 0, 100, 0, true, 1,
    [] // Inventário vazio inicial!
);

// Item temático de espólio carregado pelo monstro
const denteLobo = new Item(
    101,
    "Óleo de Garra de Fera",
    "REFORCO_DANO",
    1.4,
    "Extraído das presas do Lobisomem. Concede +40% de dano na próxima rodada."
);

// 2. Instanciando o Monstro (Portando o loot exclusivo a ser dropado na derrota)
const monstro = new Monstro(
    "Lobisomem Alfa", 1, 100, 100, 70, 8, 6, 6, "ELITE", 150,
    "Uma fera selvagem de Vaslen que guarda um óleo de combate entre suas presas.",
    denteLobo // Loot garantido do monstro
);

console.log(`🛡️  JOGADOR: ${heroi.getNome()} (${heroi.classeHeroi})`);
console.log(`   HP: ${heroi.getVidaAtual()}/${heroi.getVidaMaxima()} | EN: ${heroi.getEnergiaAtual()}/${heroi.getEnergiaMaxima()}`);
console.log(`   Atributos: Força ${heroi.getForca()} | Defesa ${heroi.getDefesa()} | Agilidade ${heroi.getAgilidade()} (Soma 20 ✅)`);
console.log(`   Inventário Inicial: ${heroi.inventario.length === 0 ? "Vazio (Sem itens iniciais)" : heroi.inventario.map(i => i.getNome()).join(", ")}\n`);

console.log(`🐺  INIMIGO: ${monstro.getNome()} [${monstro.getTipoMonstro()}]`);
console.log(`   HP: ${monstro.getVidaAtual()}/${monstro.getVidaMaxima()} | EN: ${monstro.getEnergiaAtual()}/${monstro.getEnergiaMaxima()}`);
console.log(`   Atributos: Força ${monstro.getForca()} | Defesa ${monstro.getDefesa()} | Agilidade ${monstro.getAgilidade()}`);
console.log(`   Loot Carregado: ${monstro.getItemRecompensa()?.getNome()} (${monstro.getItemRecompensa()?.getTipo()})\n`);

console.log("--------------------------------------------------------------------------------");
console.log("    BATALHA JUSTA: DADOS DE INICIATIVA E ESCOLHAS ALEATÓRIAS EM CADA TURNO      ");
console.log("--------------------------------------------------------------------------------\n");

let rodada = 1;

while (!heroi.estaDerrotado() && !monstro.estaDerrotado() && rodada <= 30) {
    console.log(`\n══════════════════════════════════ [ RODADA ${rodada} ] ══════════════════════════════════`);
    
    // Status do início da rodada
    console.log(`[Status] ${heroi.getNome()}: HP ${heroi.getVidaAtual()}/${heroi.getVidaMaxima()} | EN ${heroi.getEnergiaAtual()}/${heroi.getEnergiaMaxima()}`);
    console.log(`[Status] ${monstro.getNome()}: HP ${monstro.getVidaAtual()}/${monstro.getVidaMaxima()} | EN ${monstro.getEnergiaAtual()}/${monstro.getEnergiaMaxima()}`);

    // Rolagem de dados de iniciativa com Math.random() (Agilidade + d10)
    const iniciativaHeroi = heroi.calcularIniciativa();
    const iniciativaMonstro = monstro.calcularIniciativa();
    const heroiAgePrimeiro = iniciativaHeroi >= iniciativaMonstro;

    console.log(`🎲 Iniciativa: ${heroi.getNome()} (${iniciativaHeroi.toFixed(1)}) vs ${monstro.getNome()} (${iniciativaMonstro.toFixed(1)}) ➡️ Primeiro a agir: ${heroiAgePrimeiro ? heroi.getNome() : monstro.getNome()}\n`);

    // Turno do Jogador: Escolhas probabilísticas baseadas em Math.random()
    const turnoJogador = () => {
        heroi.redefinirDefesa();
        console.log(`👉 Turno de: ${heroi.getNome()}`);

        const sorteio = Math.random();

        // Se tiver itens acumulados no inventário e sorteou usar, consome
        if (heroi.inventario.length > 0 && sorteio < 0.3) {
            console.log(`   🎒 ${heroi.usarItemDoInventario(0, heroi)}`);
            return;
        }

        // Se estiver com pouca energia, chance de descansar
        if (heroi.getEnergiaAtual() < 20 && sorteio < 0.50) {
            heroi.defender();
            console.log(`   🛡️  ${heroi.getNome()} assumiu postura defensiva (+15 EN e -30% dano sofrido).`);
            return;
        }

        // Escolha aleatória justa entre os 3 ataques:
        let tipoAtaque = 1;
        if (sorteio < 0.35) {
            tipoAtaque = 3;
        } else if (sorteio < 0.70) {
            tipoAtaque = 2;
        } else {
            tipoAtaque = 1;
        }

        const resultado = heroi.ataque(monstro, tipoAtaque);
        if (resultado.includes("não tem energia")) {
            heroi.defender();
            console.log(`   🛡️  ${heroi.getNome()} tentou um ataque pesado sem energia suficiente e recuou em defesa.`);
        } else {
            console.log(`   ⚔️  ${resultado}`);
        }
    };

    // Turno do Monstro: IA autônoma baseada em Math.random()
    const turnoMonstro = () => {
        console.log(`👉 Turno de: ${monstro.getNome()} [IA]`);
        const acao = monstro.decidirAcao(heroi);
        console.log(`   🤖 ${acao.mensagem}`);
    };

    // Execução por ordem de iniciativa
    if (heroiAgePrimeiro) {
        turnoJogador();
        if (monstro.estaDerrotado()) {
            console.log(`\n💀 ${monstro.getNome()} tombou perante o herói!`);
            break;
        }
        console.log("");
        turnoMonstro();
        if (heroi.estaDerrotado()) {
            console.log(`\n☠️  ${heroi.getNome()} não resistiu e sucumbiu em batalha!`);
            break;
        }
    } else {
        turnoMonstro();
        if (heroi.estaDerrotado()) {
            console.log(`\n☠️  ${heroi.getNome()} não resistiu e sucumbiu em batalha!`);
            break;
        }
        console.log("");
        turnoJogador();
        if (monstro.estaDerrotado()) {
            console.log(`\n💀 ${monstro.getNome()} tombou perante o herói!`);
            break;
        }
    }

    rodada++;
}

console.log("\n================================================================================");
console.log("                           DESFECHO REAL DA BATALHA                             ");
console.log("================================================================================");

if (monstro.estaDerrotado() && !heroi.estaDerrotado()) {
    console.log(`🎉 VITÓRIA DO JOGADOR! ${heroi.getNome()} superou o adversário em combate justo!`);
    console.log(`⭐ Recompensa de Experiência: +${monstro.getExperienciaConcedida()} XP`);
    
    // Transferência do Loot do Monstro para o Inventário do Herói
    const loot = monstro.droparLoot();
    if (loot) {
        heroi.adicionarItemAoInventario(loot);
        console.log(`🎁 [SISTEMA DE LOOT] Você saqueou dos restos de ${monstro.getNome()}: "${loot.getNome()}"!`);
        console.log(`   Descrição do Item: ${loot.getDescricao()}`);
        console.log(`   Inventário Atual do Herói: [${heroi.inventario.map(i => i.getNome()).join(", ")}]`);
    }

    const nivelAnterior = heroi.getNivel();
    heroi.ganharExperiencia(monstro.getExperienciaConcedida());
    console.log(`\n📊 Nível: ${nivelAnterior} ➡️ ${heroi.getNivel()} (XP: ${heroi.experienciaAtual}/${heroi.experienciaNecessaria})`);
    console.log(`🎁 Pontos de Atributos Livres Disponíveis: ${heroi.pontosLivres}`);
    if (heroi.pontosLivres > 0) {
        heroi.distribuirPontos(1, 1, 1);
        console.log(`📈 Pontos distribuídos com sucesso (+1 Força, +1 Defesa, +1 Agilidade)!`);
        console.log(`   Novos Atributos: Força ${heroi.getForca()} | Defesa ${heroi.getDefesa()} | Agilidade ${heroi.getAgilidade()}`);
    }
} else if (heroi.estaDerrotado()) {
    console.log(`💀 DERROTA DO JOGADOR! ${heroi.getNome()} foi derrotado em combate justo por ${monstro.getNome()}.`);
    heroi.inativar();
    console.log(`🔒 Status do Herói: Ativo = ${heroi.ativo} (Soft Delete aplicado no banco de dados).`);
    console.log(`⚠️  Regra de Consequência de Morte ativada: o herói foi inativado permanentemente.`);
} else {
    console.log(`⚖️  EMPATE APÓS 30 RODADAS DE COMBATE EXAUSTIVO! Ambos sobreviveram.`);
}

console.log("\n================================================================================\n");

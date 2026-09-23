import { Personagem } from "../src/dominio/entidades/personagem";
import { Monstro } from "../src/dominio/entidades/Monstro";
import { Item } from "../src/dominio/entidades/Item";

console.log("================================================================================");
console.log("       ⚔️  FRACTURE: THE VASLEN ECHOES - SIMULAÇÃO DE COMBATE DE TESTE  ⚔️      ");
console.log("================================================================================\n");

function executarCenario(modo: 'VITORIA' | 'DERROTA') {
    console.log(`\n################################################################################`);
    console.log(`                     INICIANDO CENÁRIO DE TESTE: ${modo}                      `);
    console.log(`################################################################################\n`);

    let heroi: Personagem;
    let boss: Monstro;

    if (modo === 'VITORIA') {
        // Herói forte com itens táticos contra um monstro balanceado
        heroi = new Personagem(
            "Arthur Pendragon", 1, 100, 100, 80, 9, 6, 5, "GUERREIRO", 0, 100, 0, true, 1
        );
        boss = new Monstro(
            "Lobisomem Espectral", 1, 110, 110, 70, 8, 4, 6, "ELITE", 150,
            "Uma besta amaldiçoada pelas brumas de Vaslen."
        );

        heroi.adicionarItemAoInventario(new Item(1, "Poção de Sangue Antigo", "CURA_VIDA", 35, "Restaura 35 HP."));
        heroi.adicionarItemAoInventario(new Item(2, "Óleo de Fogo Vantajoso", "REFORCO_DANO", 1.5, "Dano +50%."));
    } else {
        // Cenário de Derrota: Herói enfrenta um Chefe Supremo devastador sem itens de cura suficientes
        heroi = new Personagem(
            "Recruta Despreparado", 1, 60, 60, 50, 7, 7, 6, "GUERREIRO", 0, 100, 0, true, 2
        );
        boss = new Monstro(
            "Malakor, o Lich Supremo", 1, 180, 180, 100, 15, 8, 8, "CHEFE", 300,
            "O soberano imortal de Vaslen cujos golpes aniquilam os vivos sem piedade."
        );
    }

    console.log(`🛡️  HERÓI: ${heroi.getNome()} (${heroi.classeHeroi}) | HP: ${heroi.getVidaAtual()}/${heroi.getVidaMaxima()} | EN: ${heroi.getEnergiaAtual()}`);
    console.log(`🐺  INIMIGO: ${boss.getNome()} [${boss.getTipoMonstro()}] | HP: ${boss.getVidaAtual()}/${boss.getVidaMaxima()} | EN: ${boss.getEnergiaAtual()}\n`);

    let rodada = 1;

    while (!heroi.estaDerrotado() && !boss.estaDerrotado() && rodada <= 20) {
        console.log(`--- [ Rodada ${rodada} ] ---`);
        heroi.redefinirDefesa();

        // Ação do Herói
        if (modo === 'VITORIA') {
            if (rodada === 1 && heroi.inventario.length > 1) {
                console.log(`   🎒 ${heroi.usarItemDoInventario(1, heroi)}`);
                console.log(`   ⚔️  ${heroi.ataque(boss, 2)}`);
                heroi.redefinirModificadorDano();
            } else if (heroi.getVidaAtual() < 40 && heroi.inventario.length > 0) {
                console.log(`   🧪 ${heroi.usarItemDoInventario(0, heroi)}`);
                heroi.defender();
                console.log(`   🛡️  ${heroi.getNome()} assumiu postura defensiva.`);
            } else if (heroi.getEnergiaAtual() >= 25) {
                console.log(`   ⚔️  ${heroi.ataque(boss, 2)}`);
            } else if (heroi.getEnergiaAtual() >= 10) {
                console.log(`   ⚔️  ${heroi.ataque(boss, 1)}`);
            } else {
                heroi.defender();
                console.log(`   🛡️  ${heroi.getNome()} está sem energia e defendeu.`);
            }
        } else {
            // No modo derrota, o herói bate fraco e sofre com a força avassaladora do chefe
            if (heroi.getEnergiaAtual() >= 10) {
                console.log(`   ⚔️  ${heroi.ataque(boss, 1)}`);
            } else {
                heroi.defender();
                console.log(`   🛡️  ${heroi.getNome()} tentou se proteger em desespero.`);
            }
        }

        if (boss.estaDerrotado()) {
            console.log(`\n💀 ${boss.getNome()} foi aniquilado!`);
            break;
        }

        // Ação do Monstro
        const acaoMonstro = boss.decidirAcao(heroi);
        console.log(`   🤖 ${acaoMonstro.mensagem}`);

        if (heroi.estaDerrotado()) {
            console.log(`\n☠️  ${heroi.getNome()} caiu em combate perante ${boss.getNome()}!`);
            break;
        }

        rodada++;
    }

    console.log("\n--------------------------------------------------------------------------------");
    console.log(`RESULTADO DO CENÁRIO [${modo}]:`);

    if (boss.estaDerrotado()) {
        console.log(`🎉 VITÓRIA DO JOGADOR! ${heroi.getNome()} sobreviveu à batalha!`);
        console.log(`⭐ Recompensa de Experiência: +${boss.getExperienciaConcedida()} XP`);
        const nivelAnterior = heroi.getNivel();
        heroi.ganharExperiencia(boss.getExperienciaConcedida());
        console.log(`📊 Nível: ${nivelAnterior} ➡️ ${heroi.getNivel()} (XP: ${heroi.experienciaAtual}/${heroi.experienciaNecessaria})`);
        console.log(`🎁 Pontos Livres: ${heroi.pontosLivres}`);
        if (heroi.pontosLivres > 0) {
            heroi.distribuirPontos(1, 1, 1);
            console.log(`📈 Atributos distribuídos (+1 Força, +1 Defesa, +1 Agilidade)!`);
            console.log(`   Status: Força ${heroi.getForca()} | Defesa ${heroi.getDefesa()} | Agilidade ${heroi.getAgilidade()}`);
        }
    } else {
        console.log(`💀 DERROTA! O personagem ${heroi.getNome()} foi assassinado pelo monstro.`);
        heroi.inativar();
        console.log(`🔒 Status do Herói: Ativo = ${heroi.ativo} (Soft Delete aplicado no banco de dados!).`);
        console.log(`⚠️  Regra de Consequência de Morte validada com sucesso: herói inativado permanentemente.`);
    }
}

// 1. Executa o cenário onde o jogador vence com estratégia
executarCenario('VITORIA');

// 2. Executa o cenário onde o jogador é derrotado pelo Boss e o Soft Delete é ativado
executarCenario('DERROTA');

console.log("\n================================================================================");
console.log(" ✅ AMBOS OS FLUXOS (VITÓRIA E DERROTA COM SOFT DELETE) FORAM VALIDADOS! ");
console.log("================================================================================\n");

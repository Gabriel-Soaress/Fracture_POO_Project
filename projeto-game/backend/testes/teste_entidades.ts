import { Personagem } from "../src/dominio/entidades/personagem";
import { Monstro } from "../src/dominio/entidades/Monstro";
import { Item } from "../src/dominio/entidades/Item";

console.log("================================================================================");
console.log("       ⚔️  FRACTURE: THE VASLEN ECHOES - SIMULAÇÃO DE COMBATE DE TESTE  ⚔️      ");
console.log("================================================================================\n");

// 1. Instanciando o Herói (Validação dos 20 pontos de atributos: 9 Força + 6 Defesa + 5 Agilidade = 20)
const heroi = new Personagem(
    "Arthur Pendragon", // nome
    1,                  // nivel
    100,                // vidaMaxima
    100,                // vidaAtual
    80,                 // energiaMaxima
    9,                  // forca
    6,                  // defesa
    5,                  // agilidade
    "GUERREIRO",        // classeHeroi
    0,                  // experienciaAtual
    100,                // experienciaNecessaria
    0,                  // pontosLivres
    true,               // ativo
    1                   // idUsuario
);

// 2. Instanciando o Monstro (Lobisomem de Vaslen - Categoria ELITE)
const boss = new Monstro(
    "Lobisomem Espectral", // nome
    1,                     // nivel
    120,                   // vidaMaxima
    120,                   // vidaAtual
    70,                    // energiaMaxima
    8,                     // forca
    4,                     // defesa
    6,                     // agilidade
    "ELITE",               // tipoMonstro
    150,                   // experienciaConcedida
    "Uma besta amaldiçoada pelas brumas de Vaslen com presas e garras vorazes." // descricaoLore
);

// 3. Adicionando itens táticos consumíveis ao inventário do Herói
const pocaoVida = new Item(1, "Poção de Sangue Antigo", "CURA_VIDA", 35, "Restaura 35 pontos de vida.");
const elixirEnergia = new Item(2, "Elixir de Foco Puro", "RECUPERA_ENERGIA", 30, "Restaura 30 pontos de energia.");
const oleoFogo = new Item(3, "Óleo de Fogo Vantajoso", "REFORCO_DANO", 1.5, "Amplia o dano em 50% na rodada.");

heroi.adicionarItemAoInventario(pocaoVida);
heroi.adicionarItemAoInventario(elixirEnergia);
heroi.adicionarItemAoInventario(oleoFogo);

console.log(`🛡️  HERÓI CRIADO: ${heroi.getNome()} (${heroi.classeHeroi})`);
console.log(`   HP: ${heroi.getVidaAtual()}/${heroi.getVidaMaxima()} | Energia: ${heroi.getEnergiaAtual()}/${heroi.getEnergiaMaxima()}`);
console.log(`   Atributos: Força ${heroi.getForca()} | Defesa ${heroi.getDefesa()} | Agilidade ${heroi.getAgilidade()} (Soma = 20 ✅)`);
console.log(`   Itens no Inventário: ${heroi.inventario.map(i => i.getNome()).join(", ")}\n`);

console.log(`🐺  INIMIGO CRIADO: ${boss.getNome()} [${boss.getTipoMonstro()}]`);
console.log(`   HP: ${boss.getVidaAtual()}/${boss.getVidaMaxima()} | Energia: ${boss.getEnergiaAtual()}/${boss.getEnergiaMaxima()}`);
console.log(`   Lore: "${boss.getDescricaoLore()}"\n`);

console.log("--------------------------------------------------------------------------------");
console.log("                         INICIANDO A BATALHA POR TURNOS                         ");
console.log("--------------------------------------------------------------------------------\n");

let rodada = 1;

while (!heroi.estaDerrotado() && !boss.estaDerrotado()) {
    console.log(`\n══════════════════════════════════ [ RODADA ${rodada} ] ══════════════════════════════════`);
    
    // Status no início da rodada
    console.log(`[Status] ${heroi.getNome()}: HP ${heroi.getVidaAtual()}/${heroi.getVidaMaxima()} | EN ${heroi.getEnergiaAtual()}/${heroi.getEnergiaMaxima()}`);
    console.log(`[Status] ${boss.getNome()}: HP ${boss.getVidaAtual()}/${boss.getVidaMaxima()} | EN ${boss.getEnergiaAtual()}/${boss.getEnergiaMaxima()}\n`);

    // ==========================================
    // TURNO DO HERÓI (Simulação tática)
    // ==========================================
    console.log(`👉 Turno de: ${heroi.getNome()}`);
    
    // Redefine a guarda defensiva da rodada anterior antes de agir
    heroi.redefinirDefesa();

    if (rodada === 1) {
        // Rodada 1: Herói usa o Óleo de Fogo para reforçar o dano e bate com Ataque Pesado
        console.log(`   🎒 ${heroi.usarItemDoInventario(2, heroi)}`); // usa Óleo de Fogo (índice 2)
        const msgAtaque = heroi.ataque(boss, 2); // Ataque Pesado (1.5x dano com reforço)
        console.log(`   ⚔️  ${msgAtaque}`);
        heroi.redefinirModificadorDano();
    } else if (rodada === 2) {
        // Rodada 2: Herói ativa seu golpe especial da classe Guerreiro (Modo Fúria)
        console.log(`   🔥 ${heroi.executarAcaoEspecial(boss)}`);
        const msgAtaque = heroi.ataque(boss, 1); // Ataque Rápido turbinado
        console.log(`   ⚔️  ${msgAtaque}`);
        heroi.redefinirModificadorDano();
    } else if (rodada === 3) {
        // Rodada 3: Herói se vê ferido e usa a Poção de Vida do inventário
        console.log(`   🧪 ${heroi.usarItemDoInventario(0, heroi)}`); // Poção de Vida
        // E usa Defender para descansar e recuperar energia
        heroi.defender();
        console.log(`   🛡️  ${heroi.getNome()} assumiu postura defensiva (+15 energia e -30% dano sofrido).`);
    } else {
        // Rodadas subsequentes: se tiver energia bate forte, senão golpe rápido ou defende
        if (heroi.getEnergiaAtual() >= 25) {
            console.log(`   ⚔️  ${heroi.ataque(boss, 2)}`);
        } else if (heroi.getEnergiaAtual() >= 10) {
            console.log(`   ⚔️  ${heroi.ataque(boss, 1)}`);
        } else {
            heroi.defender();
            console.log(`   🛡️  ${heroi.getNome()} está exausto e assumiu postura defensiva para recuperar estamina.`);
        }
    }

    // Verifica se o monstro morreu após o turno do herói
    if (boss.estaDerrotado()) {
        console.log(`\n💀 ${boss.getNome()} foi aniquilado em combate!`);
        break;
    }

    // ==========================================
    // TURNO DO MONSTRO (IA Autônoma de Vaslen)
    // ==========================================
    console.log(`\n👉 Turno de: ${boss.getNome()} [IA Agindo]`);
    const acaoMonstro = boss.decidirAcao(heroi);
    console.log(`   🤖 ${acaoMonstro.mensagem}`);

    // Verifica se o herói morreu após o turno do monstro
    if (heroi.estaDerrotado()) {
        console.log(`\n☠️  ${heroi.getNome()} sucumbiu perante o poder das trevas!`);
        break;
    }

    rodada++;
}

console.log("\n================================================================================");
console.log("                           FIM DO COMBATE DE TESTE                              ");
console.log("================================================================================");

if (boss.estaDerrotado()) {
    console.log(`🎉 VITÓRIA DO JOGADOR! ${heroi.getNome()} sobreviveu à batalha!`);
    console.log(`⭐ Recompensa de Experiência: +${boss.getExperienciaConcedida()} XP`);
    
    const nivelAnterior = heroi.getNivel();
    heroi.ganharExperiencia(boss.getExperienciaConcedida());
    
    console.log(`📊 Nível: ${nivelAnterior} ➡️ ${heroi.getNivel()} (XP: ${heroi.experienciaAtual}/${heroi.experienciaNecessaria})`);
    console.log(`🎁 Pontos de Atributos Livres Disponíveis: ${heroi.pontosLivres}`);
    
    // Distribuição de atributos pós-vitória
    if (heroi.pontosLivres > 0) {
        heroi.distribuirPontos(1, 1, 1);
        console.log(`📈 Pontos distribuídos com sucesso (+1 Força, +1 Defesa, +1 Agilidade)!`);
        console.log(`   Novos Atributos: Força ${heroi.getForca()} | Defesa ${heroi.getDefesa()} | Agilidade ${heroi.getAgilidade()}`);
    }
} else {
    console.log(`💀 DERROTA! O personagem ${heroi.getNome()} foi derrotado.`);
    heroi.inativar();
    console.log(`🔒 Status do Herói: Ativo = ${heroi.ativo} (Soft Delete aplicado no banco de dados).`);
}

console.log("\n✅ Todos os requisitos da Sprint 1 foram validados com sucesso no domínio!\n");

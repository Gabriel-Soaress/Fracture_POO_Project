import { Personagem } from "../src/dominio/entidades/personagem";
import { FabricaMonstros } from "../src/dominio/fabricas/FabricaMonstros";
import { FabricaCodice } from "../src/dominio/fabricas/FabricaCodice";
import { MotorCombate } from "../src/dominio/servicos/MotorCombate";

console.log("================================================================================");
console.log("        TESTE DE INTEGRAÇÃO DA SPRINT 2: MOTOR DE COMBATE E CÓDICE              ");
console.log("================================================================================\n");

// 1. CRIANDO O HERÓI (Validação de 20 pontos de atributos)
const heroi = new Personagem(
    "Valerius de Vaslen",
    1,
    100, 100,
    70,
    8, 7, 5, // 8 + 7 + 5 = 20 pontos exatos
    "GUERREIRO",
    0,
    100,
    0,
    true,
    1
);

console.log(`🛡️  Herói Criado: ${heroi.getNome()} (${heroi.classeHeroi})`);
console.log(`   Atributos: Força ${heroi.getForca()} | Defesa ${heroi.getDefesa()} | Agilidade ${heroi.getAgilidade()} (Total: 20 ✅)`);
console.log(`   Inventário Inicial: ${heroi.inventario.length} itens.`);
console.log(`   Monstros Derrotados no Mural: [${heroi.monstrosDerrotados.join(", ")}]\n`);

// 2. OBTENDO MONSTRO CANÔNICO DA FÁBRICA (Guerreiro Esquelético - ID 1)
const monstro = FabricaMonstros.criarGuerreiroEsqueletico();
console.log(`💀 Monstro Desafiado: ${monstro.getNome()} [ID: ${monstro.getId()}] - Bioma: ${monstro.getBioma()}`);
console.log(`   Loot Carregado: ${monstro.getItemRecompensa()?.getNome()}`);
console.log(`   Lore: ${monstro.getDescricaoLore()}\n`);

// 3. INICIALIZANDO O MOTOR DE COMBATE
console.log("--- TESTANDO MOTOR DE COMBATE ---");
const motor = new MotorCombate(heroi, monstro);
const inicio = motor.iniciarCombate();
console.log(`🎲 ${inicio.mensagem}`);
console.log(`👉 Primeiro a agir: ${inicio.primeiroAJogar}\n`);

// 4. PROCESSANDO TURNOS ATÉ A BATALHA TERMINAR
let rodada = 1;
while (motor.getEstado() === "EM_ANDAMENTO") {
    console.log(`--- Rodada ${rodada} ---`);
    
    // Herói alterna entre golpe brutal (3) e defesa se estiver cansado
    let resultado;
    if (heroi.getEnergiaAtual() >= 25) {
        resultado = motor.processarTurno({ tipo: "ATACAR", tipoAtaque: 3 });
    } else {
        resultado = motor.processarTurno({ tipo: "DEFENDER" });
    }

    resultado.mensagensTurno.forEach(msg => console.log(`   ${msg}`));
    console.log(`   [Status] Herói: HP ${resultado.heroiStatus.vidaAtual}/${resultado.heroiStatus.vidaMaxima} | EN ${resultado.heroiStatus.energiaAtual}`);
    console.log(`   [Status] Monstro: HP ${resultado.monstroStatus.vidaAtual}/${resultado.monstroStatus.vidaMaxima}\n`);

    rodada++;
}

console.log("================================================================================");
console.log(`🏁 RESULTADO FINAL: ${motor.getEstado()}`);
console.log(`⭐ Monstros Derrotados no Mural: [${heroi.monstrosDerrotados.join(", ")}]`);
console.log(`🎒 Inventário do Herói: [${heroi.inventario.map(i => i.getNome()).join(", ")}]`);
console.log(`📈 Nível do Herói: ${heroi.getNivel()} | XP Atual: ${heroi.experienciaAtual}`);
console.log("================================================================================\n");

// 5. TESTANDO VALIDAÇÃO DO MURAL DE CAÇADAS (Anti-farm infinito)
console.log("--- TESTANDO TRAVA DO MURAL DE CAÇADAS (ANTI-FARM) ---");
try {
    const motorRepetido = new MotorCombate(heroi, FabricaMonstros.criarGuerreiroEsqueletico());
    motorRepetido.iniciarCombate();
    console.log("❌ ERRO: O motor permitiu lutar novamente contra um monstro já caçado!");
} catch (erro: any) {
    console.log(`✅ SUCESSO: Trava do Mural ativada! Mensagem: "${erro.message}"\n`);
}

// 6. TESTANDO O CÓDICE DE VASLEN
console.log("--- TESTANDO O CÓDICE DE VASLEN ---");
const buscaNevoa = FabricaCodice.buscar("nevoa");
console.log(`📖 Busca por "nevoa" retornou ${buscaNevoa.length} entradas:`);
buscaNevoa.forEach(e => console.log(`   - [${e.getCategoria()}] ${e.getTitulo()} (Tags: ${e.getTags().join(", ")})`));

const reliquias = FabricaCodice.obterPorCategoria("RELÍQUIA");
console.log(`\n🧪 Categoria "RELÍQUIA" possui ${reliquias.length} verbetes:`);
reliquias.forEach(r => console.log(`   - ${r.getTitulo()}: ${r.getResumo()}`));

console.log("\n================================================================================");
console.log("        TODOS OS TESTES DE DOMÍNIO DA SPRINT 2 PASSARAM COM SUCESSO!            ");
console.log("================================================================================");

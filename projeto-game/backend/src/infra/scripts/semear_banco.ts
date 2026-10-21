import { CodiceRepositorio } from "../repositorios/CodiceRepositorio";
import { FabricaCodice } from "../../dominio/fabricas/FabricaCodice";
import { prisma } from "../banco/prismaCliente";

/**
 * Script de inicialização (Seed) para alimentar o banco de dados Neon PostgreSQL
 * com o Códice de Vaslen (Histórias, Regiões, Monstros e Relíquias).
 */
async function semearBanco() {
    console.log("🌱 [SEED] Iniciando povoamento do Códice de Vaslen no Neon PostgreSQL...");

    try {
        const repo = new CodiceRepositorio();
        const entradas = FabricaCodice.criarEntradasIniciais();

        console.log(`📜 [SEED] Carregadas ${entradas.length} entradas do domínio.`);

        for (const entrada of entradas) {
            await repo.salvar(entrada);
            console.log(`  ✓ [ID ${entrada.getId()}] [${entrada.getCategoria()}] ${entrada.getTitulo()}`);
        }

        console.log("\n✨ [SEED] Povoamento concluído com sucesso no Neon PostgreSQL!");
    } catch (erro) {
        console.error("❌ [SEED] Erro ao semear o banco:", erro);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

semearBanco();

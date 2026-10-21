import { UsuarioRepositorio } from "../src/infra/repositorios/UsuarioRepositorio";
import { PersonagemRepositorio } from "../src/infra/repositorios/PersonagemRepositorio";
import { CodiceRepositorio } from "../src/infra/repositorios/CodiceRepositorio";
import { Usuario } from "../src/dominio/entidades/usuario";
import { Personagem } from "../src/dominio/entidades/personagem";
import { FabricaItens } from "../src/dominio/fabricas/FabricaItens";
import { prisma } from "../src/infra/banco/prismaCliente";

/**
 * Teste de Integração da Camada de Persistência (Sprint 3)
 * Conexão direta com Neon PostgreSQL testando repositórios, integridade POO,
 * Soft Delete e Mural de Caçadas.
 */
async function executarTestesPersistencia() {
    console.log("==============================================================");
    console.log("🛡️  INICIANDO BATERIA DE TESTES DE PERSISTÊNCIA (NEON DB)");
    console.log("==============================================================\n");

    const usuarioRepo = new UsuarioRepositorio();
    const personagemRepo = new PersonagemRepositorio();
    const codiceRepo = new CodiceRepositorio();

    const timestamp = Date.now();
    const emailTeste = `heroi_${timestamp}@teste.com`;

    try {
        // -------------------------------------------------------------
        // TESTE 1: Cadastro e Busca de Usuário
        // -------------------------------------------------------------
        console.log("🔹 [TESTE 1] Criando e persistindo usuário...");
        const novoUsuario = new Usuario(
            0,
            "Guerreiro do Eclipse",
            emailTeste,
            "hash_senha_segura_123",
            "JOGADOR"
        );
        const usuarioSalvo = await usuarioRepo.salvar(novoUsuario);
        const idUsuario = usuarioSalvo.getId();
        console.log(`  ✓ Usuário persistido com ID: ${idUsuario} (Nome: ${usuarioSalvo.getNome()})`);

        const usuarioBuscado = await usuarioRepo.buscarPorEmail(emailTeste);
        if (!usuarioBuscado || usuarioBuscado.getId() !== idUsuario) {
            throw new Error("Falha ao recuperar usuário por email!");
        }
        console.log(`  ✓ Busca por email validada: ${usuarioBuscado.getEmail()}`);

        // -------------------------------------------------------------
        // TESTE 2: Criação de Personagem com Atributos Válidos (20 pontos)
        // -------------------------------------------------------------
        console.log("\n🔹 [TESTE 2] Criando e persistindo Personagem (Validação 20 pontos)...");
        // Distribuição: Força 8, Defesa 6, Agilidade 6 = 20 pontos
        const novoHeroi = new Personagem(
            "Alphonse",
            1,
            100,
            100,
            70,
            8,
            6,
            6,
            "GUERREIRO",
            0,
            100,
            0,
            true,
            idUsuario
        );
        const heroiSalvo = await personagemRepo.salvar(novoHeroi);
        const idHeroi = heroiSalvo.getId()!;
        console.log(`  ✓ Personagem salvo com ID: ${idHeroi} (Nível: ${heroiSalvo.getNivel()}, Vida: ${heroiSalvo.getVidaAtual()}/${heroiSalvo.getVidaMaxima()})`);

        // -------------------------------------------------------------
        // TESTE 3: Inventário e Itens Compostos
        // -------------------------------------------------------------
        console.log("\n🔹 [TESTE 3] Adicionando itens e atualizando progresso...");
        // Adiciona poção de cura e orbe dos nove ecos (Item Composto)
        const pocao = FabricaItens.criarPocaoVidaMenor();
        const elixirComposto = FabricaItens.criarOrbeDosNoveEcos();

        heroiSalvo.adicionarItemAoInventario(pocao);
        heroiSalvo.adicionarItemAoInventario(elixirComposto);
        
        // Simula ganho de XP e caçada de monstro (Mural)
        heroiSalvo.registrarVitoriaContraMonstro(1); // Esqueleto Sentinela derrotado
        heroiSalvo.registrarVitoriaContraMonstro(2); // Guerreiro Túmulo derrotado
        heroiSalvo.ganharExperiencia(50);

        await personagemRepo.atualizarProgresso(heroiSalvo);
        console.log(`  ✓ Progresso atualizado: XP=${heroiSalvo.experienciaAtual}, Mural=${JSON.stringify(heroiSalvo.monstrosDerrotados)}`);

        // Recarrega do banco e valida integridade de POO
        const heroiRecarregado = await personagemRepo.buscarPorId(idHeroi);
        if (!heroiRecarregado) {
            throw new Error("Personagem não encontrado após recarga!");
        }

        console.log(`  ✓ Herói recarregado: Itens no inventário = ${heroiRecarregado.inventario.length}`);
        console.log(`  ✓ Monstros derrotados registrados = ${heroiRecarregado.monstrosDerrotados.length}`);
        if (heroiRecarregado.inventario.length !== 2) {
            throw new Error(`Esperado 2 itens no inventário, recebido ${heroiRecarregado.inventario.length}`);
        }

        // -------------------------------------------------------------
        // TESTE 4: Teste de Soft Delete (RN04 e RF05)
        // -------------------------------------------------------------
        console.log("\n🔹 [TESTE 4] Validando Soft Delete (Personagem derrotado/inativo)...");
        // Verifica que ele aparece na lista de ativos do usuário
        let listaAtivos = await personagemRepo.listarPorUsuario(idUsuario);
        console.log(`  ✓ Lista de ativos antes da inativação: ${listaAtivos.length} herói(s)`);
        if (listaAtivos.length !== 1) {
            throw new Error("Herói deveria constar na listagem de ativos!");
        }

        // Aplica Soft Delete
        await personagemRepo.inativar(idHeroi);
        console.log(`  ✓ Método inativar() chamado para o herói ID ${idHeroi}`);

        // Consulta novamente: NÃO deve aparecer na listagem de ativos
        listaAtivos = await personagemRepo.listarPorUsuario(idUsuario);
        console.log(`  ✓ Lista de ativos após inativação: ${listaAtivos.length} herói(s) (Esperado: 0)`);
        if (listaAtivos.length !== 0) {
            throw new Error("Herói inativo não deveria aparecer na listagem de ativos (Soft Delete falhou)!");
        }

        // Mas ainda deve existir no banco para histórico/auditoria
        const heroiAuditoria = await personagemRepo.buscarPorId(idHeroi);
        if (!heroiAuditoria || heroiAuditoria.ativo !== false) {
            throw new Error("Herói deveria existir com ativo=false no banco!");
        }
        console.log(`  ✓ Registro mantido no banco com ativo=${heroiAuditoria.ativo} (Integridade Soft Delete preservada!)`);

        // -------------------------------------------------------------
        // TESTE 5: Consultas no Códice (Busca Textual e Categorias)
        // -------------------------------------------------------------
        console.log("\n🔹 [TESTE 5] Consultando Códice de Vaslen via Repositório...");
        const regioes = await codiceRepo.buscarPorCategoria("REGIAO");
        console.log(`  ✓ Regiões encontradas no Códice: ${regioes.length} biomas cadastrados`);

        const buscaFratura = await codiceRepo.buscarPorTermo("Fratura");
        console.log(`  ✓ Busca por termo 'Fratura': ${buscaFratura.length} resultado(s) encontrado(s)`);
        if (buscaFratura.length > 0) {
            console.log(`    -> Entrada: "${buscaFratura[0].getTitulo()}" [${buscaFratura[0].getCategoria()}]`);
        }

        console.log("\n==============================================================");
        console.log("🎉 TODOS OS TESTES DE PERSISTÊNCIA PASSARAM COM SUCESSO!");
        console.log("==============================================================");

    } catch (erro) {
        console.error("\n❌ ERRO DURANTE OS TESTES DE PERSISTÊNCIA:", erro);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

executarTestesPersistencia();

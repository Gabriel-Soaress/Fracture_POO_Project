import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/infra/banco/prismaCliente";

/**
 * Bateria de Testes End-to-End (E2E) da API RESTful (Sprint 4)
 * Valida todos os módulos HTTP, proteção JWT, validação de regras de domínio,
 * sessões de combate e persistência no banco Neon PostgreSQL.
 */
async function executarTestesAPI() {
    console.log("==============================================================");
    console.log("🌐  INICIANDO BATERIA DE TESTES E2E DA API RESTFUL (EXPRESS)");
    console.log("==============================================================\n");

    const timestamp = Date.now();
    const emailJogador = `jogador_api_${timestamp}@vaslen.com`;
    const senhaJogador = "senha_secreta_123";

    let tokenAcesso: string = "";
    let idHeroi: number = 0;
    let sessaoCombateId: string = "";

    try {
        // -------------------------------------------------------------
        // CENÁRIO 1: Healthcheck da API
        // -------------------------------------------------------------
        console.log("🔹 [CENÁRIO 1] Testando Healthcheck (GET /api/status)...");
        const resStatus = await request(app).get("/api/status");
        if (resStatus.status !== 200 || resStatus.body.status !== "online") {
            throw new Error(`Healthcheck falhou. Status: ${resStatus.status}`);
        }
        console.log(`  ✓ Status: 200 OK | Jogo: ${resStatus.body.jogo} | Versão: ${resStatus.body.versao}`);

        // -------------------------------------------------------------
        // CENÁRIO 2: Cadastro de Jogador
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 2] Testando Cadastro de Usuário (POST /api/auth/cadastro)...");
        const resCadastro = await request(app)
            .post("/api/auth/cadastro")
            .send({
                nome: "Campeão de Vaslen",
                email: emailJogador,
                senha: senhaJogador
            });

        if (resCadastro.status !== 201 || !resCadastro.body.usuario?.id) {
            throw new Error(`Cadastro falhou: ${JSON.stringify(resCadastro.body)}`);
        }
        console.log(`  ✓ Usuário registrado com ID: ${resCadastro.body.usuario.id}`);

        // Tentativa de duplicidade
        const resDuplicado = await request(app)
            .post("/api/auth/cadastro")
            .send({
                nome: "Impostor",
                email: emailJogador,
                senha: senhaJogador
            });
        if (resDuplicado.status !== 409) {
            throw new Error(`Esperado status 409 para email duplicado, recebido ${resDuplicado.status}`);
        }
        console.log("  ✓ Bloqueio de e-mail duplicado validado com 409 Conflict");

        // -------------------------------------------------------------
        // CENÁRIO 3: Autenticação e Geração de Token JWT
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 3] Testando Login e Emissão de Token (POST /api/auth/login)...");
        // Tentativa com senha errada
        const resLoginInvalido = await request(app)
            .post("/api/auth/login")
            .send({ email: emailJogador, senha: "senha_errada" });
        if (resLoginInvalido.status !== 401) {
            throw new Error(`Esperado 401 para senha incorreta, recebido ${resLoginInvalido.status}`);
        }
        console.log("  ✓ Bloqueio de credenciais incorretas validado com 401 Unauthorized");

        // Login correto
        const resLogin = await request(app)
            .post("/api/auth/login")
            .send({ email: emailJogador, senha: senhaJogador });
        if (resLogin.status !== 200 || !resLogin.body.token) {
            throw new Error(`Login falhou: ${JSON.stringify(resLogin.body)}`);
        }
        tokenAcesso = resLogin.body.token;
        console.log("  ✓ Token JWT gerado com sucesso (Bearer)");

        // -------------------------------------------------------------
        // CENÁRIO 4: Criação de Personagem com Validação de Atributos (20 pts)
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 4] Testando Criação de Personagem e Regra RN01 (POST /api/personagens)...");
        
        // Tentativa com atributos inválidos (8 + 8 + 8 = 24 != 20)
        const resHeroiInvalido = await request(app)
            .post("/api/personagens")
            .set("Authorization", `Bearer ${tokenAcesso}`)
            .send({
                nome: "Trapaceiro",
                classe: "GUERREIRO",
                forca: 8,
                defesa: 8,
                agilidade: 8
            });
        if (resHeroiInvalido.status !== 400) {
            throw new Error(`Esperado 400 para atributos != 20, recebido ${resHeroiInvalido.status}`);
        }
        console.log(`  ✓ Bloqueio de atributos desbalanceados validado: "${resHeroiInvalido.body.erro}"`);

        // Criação válida (8 + 7 + 5 = 20)
        const resHeroi = await request(app)
            .post("/api/personagens")
            .set("Authorization", `Bearer ${tokenAcesso}`)
            .send({
                nome: "Valerius API",
                classe: "GUERREIRO",
                forca: 8,
                defesa: 7,
                agilidade: 5
            });
        if (resHeroi.status !== 201 || !resHeroi.body.personagem?.id) {
            throw new Error(`Falha ao criar personagem válido: ${JSON.stringify(resHeroi.body)}`);
        }
        idHeroi = resHeroi.body.personagem.id;
        console.log(`  ✓ Herói criado com ID ${idHeroi}: ${resHeroi.body.personagem.nome} (${resHeroi.body.personagem.classeHeroi})`);

        // -------------------------------------------------------------
        // CENÁRIO 5: Consulta ao Códice de Vaslen
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 5] Testando Códice de Vaslen (GET /api/codice)...");
        const resCategorias = await request(app).get("/api/codice/categorias");
        console.log(`  ✓ Categorias disponíveis: ${resCategorias.body.categorias?.join(", ")}`);

        const resBusca = await request(app).get("/api/codice?busca=Fratura");
        if (resBusca.status !== 200 || resBusca.body.total === 0) {
            throw new Error("Busca no Códice não retornou verbetes esperados.");
        }
        console.log(`  ✓ Busca por 'Fratura': ${resBusca.body.total} verbete(s) retornado(s) -> "${resBusca.body.entradas[0].titulo}"`);

        // -------------------------------------------------------------
        // CENÁRIO 6: Mural de Caçadas Únicas (Anti-Farm)
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 6] Testando Mural de Caçadas (GET /api/combate/mural/CRIPTAS)...");
        const resMuralAntes = await request(app)
            .get(`/api/combate/mural/CRIPTAS?personagemId=${idHeroi}`)
            .set("Authorization", `Bearer ${tokenAcesso}`);

        if (resMuralAntes.status !== 200 || !resMuralAntes.body.monstros) {
            throw new Error("Falha ao obter mural de caçadas.");
        }
        const monstro1Antes = resMuralAntes.body.monstros.find((m: any) => m.id === 1);
        console.log(`  ✓ Monstro ID 1 (${monstro1Antes.nome}) status inicial: [${monstro1Antes.status}]`);
        if (monstro1Antes.status !== "DISPONIVEL") {
            throw new Error("Monstro 1 deveria estar DISPONIVEL antes da batalha.");
        }

        // -------------------------------------------------------------
        // CENÁRIO 7: Início do Combate e Processamento de Turnos
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 7] Iniciando Sessão de Combate (POST /api/combate/iniciar)...");
        const resIniciarCombate = await request(app)
            .post("/api/combate/iniciar")
            .set("Authorization", `Bearer ${tokenAcesso}`)
            .send({
                personagemId: idHeroi,
                monstroId: 1
            });

        if (resIniciarCombate.status !== 201 || !resIniciarCombate.body.sessaoId) {
            throw new Error(`Falha ao iniciar combate: ${JSON.stringify(resIniciarCombate.body)}`);
        }
        sessaoCombateId = resIniciarCombate.body.sessaoId;
        console.log(`  ✓ Sessão de Combate aberta: ${sessaoCombateId}`);
        console.log(`  ✓ Iniciativa: ${resIniciarCombate.body.primeiroAJogar} | ${resIniciarCombate.body.mensagem}`);

        // Processa turnos de combate até a finalização da batalha
        console.log("\n🔹 [CENÁRIO 8] Processando Turnos de Combate (POST /api/combate/turno)...");
        let rodada = 1;
        let combateFinalizado = false;
        let ultimaEnergia = 70;

        while (!combateFinalizado && rodada <= 30) {
            // Rotação tática de combate:
            // - Energia >= 20: Golpe Pesado
            // - Energia >= 7: Golpe Rápido
            // - Energia < 7: Defender (recupera +15 estamina)
            let acaoRodada: any;
            if (ultimaEnergia >= 20) {
                acaoRodada = { tipo: "ATACAR", tipoAtaque: 2 };
            } else if (ultimaEnergia >= 7) {
                acaoRodada = { tipo: "ATACAR", tipoAtaque: 1 };
            } else {
                acaoRodada = { tipo: "DEFENDER" };
            }

            const resTurno = await request(app)
                .post("/api/combate/turno")
                .set("Authorization", `Bearer ${tokenAcesso}`)
                .send({
                    sessaoId: sessaoCombateId,
                    acao: acaoRodada
                });

            if (resTurno.status !== 200) {
                throw new Error(`Erro no turno ${rodada}: ${JSON.stringify(resTurno.body)}`);
            }

            const resultado = resTurno.body.resultado;
            ultimaEnergia = resultado.heroiStatus.energiaAtual;

            console.log(`  ⚔️ Rodada ${resultado.rodada}: Herói [HP ${resultado.heroiStatus.vidaAtual}/${resultado.heroiStatus.vidaMaxima} | EN ${resultado.heroiStatus.energiaAtual}] vs Monstro [HP ${resultado.monstroStatus.vidaAtual}/${resultado.monstroStatus.vidaMaxima}] | Estado: [${resultado.estado}]`);

            if (resultado.estado !== "EM_ANDAMENTO") {
                combateFinalizado = true;
                console.log(`\n  🏁 Batalha encerrada com resultado: ${resultado.estado}!`);
                if (resultado.lootConcedido) {
                    console.log(`  🎁 Loot recebido: ${resultado.lootConcedido.nome}`);
                }
            }

            rodada++;
        }

        // -------------------------------------------------------------
        // CENÁRIO 9: Validação da Regra Anti-Farm
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 9] Validando Bloqueio Pós-Batalha (Anti-Farm / Soft Delete)...");
        const resMuralDepois = await request(app)
            .get(`/api/combate/mural/CRIPTAS?personagemId=${idHeroi}`)
            .set("Authorization", `Bearer ${tokenAcesso}`);

        const monstro1Depois = resMuralDepois.body.monstros.find((m: any) => m.id === 1);
        console.log(`  ✓ Monstro ID 1 status após combate: [${monstro1Depois.status}]`);

        // Tentar iniciar combate novamente com o mesmo monstro
        const resCombateRepetido = await request(app)
            .post("/api/combate/iniciar")
            .set("Authorization", `Bearer ${tokenAcesso}`)
            .send({
                personagemId: idHeroi,
                monstroId: 1
            });

        if (resCombateRepetido.status !== 400) {
            throw new Error(`Esperado bloqueio 400 para batalha inválida pós-combate, recebido ${resCombateRepetido.status}`);
        }
        console.log(`  ✓ Bloqueio confirmado com sucesso: "${resCombateRepetido.body.erro}"`);

        // -------------------------------------------------------------
        // CENÁRIO 10: Inativação Manual de Personagem (DELETE /api/personagens/:id)
        // -------------------------------------------------------------
        console.log("\n🔹 [CENÁRIO 10] Testando Soft Delete Manual via Endpoint (DELETE /api/personagens/:id)...");
        
        // Cria um segundo personagem para validar a inativação manual
        const resSegundoHeroi = await request(app)
            .post("/api/personagens")
            .set("Authorization", `Bearer ${tokenAcesso}`)
            .send({
                nome: "Heroi Temporario",
                classe: "MAGO",
                forca: 4,
                defesa: 6,
                agilidade: 10
            });
        
        const idSegundoHeroi = resSegundoHeroi.body.personagem.id;
        console.log(`  ✓ Segundo herói criado para teste de remoção (ID: ${idSegundoHeroi})`);

        const resDelete = await request(app)
            .delete(`/api/personagens/${idSegundoHeroi}`)
            .set("Authorization", `Bearer ${tokenAcesso}`);

        if (resDelete.status !== 200) {
            throw new Error(`Falha ao inativar personagem: ${JSON.stringify(resDelete.body)}`);
        }
        console.log(`  ✓ Resposta: "${resDelete.body.mensagem}"`);

        // Confirmar que o segundo herói inativado não aparece mais na listagem de ativos
        const resListagem = await request(app)
            .get("/api/personagens")
            .set("Authorization", `Bearer ${tokenAcesso}`);
        
        const heroiNaLista = resListagem.body.personagens.find((p: any) => p.id === idSegundoHeroi);
        if (heroiNaLista) {
            throw new Error("Personagem inativado ainda consta na listagem de ativos!");
        }
        console.log("  ✓ Personagem ocultado com sucesso da lista de ativos (Soft Delete validado).");
        console.log("  ✓ Personagem ocultado com sucesso da lista de ativos (Soft Delete validado).");

        console.log("\n==============================================================");
        console.log("🎉 TODOS OS TESTES E2E DA SPRINT 4 PASSARAM COM SUCESSO!");
        console.log("==============================================================");

    } catch (erro) {
        console.error("\n❌ ERRO NA EXECUÇÃO DOS TESTES E2E:", erro);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

executarTestesAPI();

import { Request, Response } from "express";
import { GerenciadorSessaoCombate } from "../../infra/sessao/GerenciadorSessaoCombate";
import { PersonagemRepositorio } from "../../infra/repositorios/PersonagemRepositorio";
import { FabricaMonstros } from "../../dominio/fabricas/FabricaMonstros";
import { ParametrosAcaoJogador } from "../../dominio/servicos/MotorCombate";

export class CombateControlador {
    private gerenciadorSessao: GerenciadorSessaoCombate;
    private personagemRepositorio: PersonagemRepositorio;

    constructor() {
        this.gerenciadorSessao = GerenciadorSessaoCombate.getInstancia();
        this.personagemRepositorio = new PersonagemRepositorio();
    }

    /**
     * GET /api/combate/mural/:bioma
     * Retorna a lista de monstros canônicos de um bioma e indica quais já foram derrotados
     * pelo herói (Mural de Caçadas Únicas - Anti-Farm).
     */
    public async mural(req: Request, res: Response): Promise<void> {
        try {
            const { bioma } = req.params;
            const { personagemId } = req.query;

            const monstros = FabricaMonstros.obterPorBioma(bioma);
            if (monstros.length === 0) {
                res.status(404).json({ erro: `Bioma '${bioma}' não encontrado ou sem monstros cadastrados.` });
                return;
            }

            let monstrosDerrotados: number[] = [];

            if (personagemId) {
                const heroi = await this.personagemRepositorio.buscarPorId(Number(personagemId));
                if (heroi) {
                    monstrosDerrotados = heroi.monstrosDerrotados;
                }
            }

            const muralMonstros = monstros.map(m => {
                const eliminado = monstrosDerrotados.includes(m.getId());
                const item = m.getItemRecompensa();
                return {
                    id: m.getId(),
                    nome: m.getNome(),
                    bioma: m.getBioma(),
                    tipoMonstro: m.getTipoMonstro(),
                    nivel: m.getNivel(),
                    vidaMaxima: m.getVidaMaxima(),
                    energiaMaxima: m.getEnergiaMaxima(),
                    forca: m.getForca(),
                    defesa: m.getDefesa(),
                    agilidade: m.getAgilidade(),
                    experienciaConcedida: m.getExperienciaConcedida(),
                    descricaoLore: m.getDescricaoLore(),
                    status: eliminado ? "ELIMINADO" : "DISPONIVEL",
                    loot: item ? {
                        id: item.getId(),
                        nome: item.getNome(),
                        tipo: item.getTipo(),
                        descricao: item.getDescricao()
                    } : null
                };
            });

            res.status(200).json({
                bioma: bioma.toUpperCase(),
                total: muralMonstros.length,
                monstros: muralMonstros
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao consultar mural de caçadas." });
        }
    }

    /**
     * POST /api/combate/iniciar
     * Inicializa uma sessão de combate por turnos no servidor.
     */
    public async iniciar(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const { personagemId, monstroId } = req.body;

            if (!personagemId || !monstroId) {
                res.status(400).json({ erro: "personagemId e monstroId são obrigatórios." });
                return;
            }

            const heroi = await this.personagemRepositorio.buscarPorId(Number(personagemId));

            if (!heroi || Number(heroi.idUsuario) !== usuarioId) {
                res.status(404).json({ erro: "Personagem não encontrado ou não pertence a esta conta." });
                return;
            }

            if (!heroi.ativo) {
                res.status(400).json({ erro: "Herói inativo não pode entrar em combate (Soft Delete)." });
                return;
            }

            // Regra do Mural Único (Anti-Farm):
            if (heroi.jaDerrotouMonstro(Number(monstroId))) {
                res.status(400).json({
                    erro: "Este monstro já foi expurgado de Vaslen e não pode ser enfrentado novamente."
                });
                return;
            }

            const monstro = FabricaMonstros.criarPorId(Number(monstroId));

            const sessao = this.gerenciadorSessao.criarSessao(usuarioId, heroi, monstro);
            const dadosInicio = sessao.motor.iniciarCombate();

            res.status(201).json({
                sessaoId: sessao.id,
                primeiroAJogar: dadosInicio.primeiroAJogar,
                mensagem: dadosInicio.mensagem,
                heroi: {
                    id: heroi.getId(),
                    nome: heroi.getNome(),
                    classe: heroi.classeHeroi,
                    nivel: heroi.getNivel(),
                    vidaAtual: heroi.getVidaAtual(),
                    vidaMaxima: heroi.getVidaMaxima(),
                    energiaAtual: heroi.getEnergiaAtual(),
                    energiaMaxima: heroi.getEnergiaMaxima()
                },
                monstro: {
                    id: monstro.getId(),
                    nome: monstro.getNome(),
                    bioma: monstro.getBioma(),
                    tipoMonstro: monstro.getTipoMonstro(),
                    nivel: monstro.getNivel(),
                    vidaAtual: monstro.getVidaAtual(),
                    vidaMaxima: monstro.getVidaMaxima(),
                    energiaAtual: monstro.getEnergiaAtual(),
                    energiaMaxima: monstro.getEnergiaMaxima()
                }
            });
        } catch (erro: any) {
            res.status(400).json({ erro: erro.message || "Erro ao iniciar combate." });
        }
    }

    /**
     * POST /api/combate/turno
     * Executa a jogada do jogador e o contra-ataque da IA do monstro na mesma rodada.
     */
    public async processarTurno(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const { sessaoId, acao } = req.body;

            if (!sessaoId || !acao || !acao.tipo) {
                res.status(400).json({
                    erro: "sessaoId e objeto de acao ({ tipo: 'ATACAR' | 'DEFENDER' | 'HABILIDADE_ESPECIAL' | 'USAR_ITEM' }) são obrigatórios."
                });
                return;
            }

            const sessao = this.gerenciadorSessao.obterSessao(sessaoId);

            if (!sessao) {
                res.status(404).json({ erro: "Sessão de combate não encontrada ou já expirada." });
                return;
            }

            if (sessao.usuarioId !== usuarioId) {
                res.status(403).json({ erro: "Acesso negado a esta sessão de combate." });
                return;
            }

            const parametrosAcao: ParametrosAcaoJogador = {
                tipo: acao.tipo,
                tipoAtaque: acao.tipoAtaque,
                indiceItem: acao.indiceItem
            };

            const resultado = sessao.motor.processarTurno(parametrosAcao);

            // Se o combate terminou, persistir a alteração no banco e encerrar a sessão
            if (resultado.estado === "VITORIA_JOGADOR" || resultado.estado === "DERROTA_JOGADOR") {
                const heroiAtualizado = sessao.motor.getHeroi();
                await this.personagemRepositorio.atualizarProgresso(heroiAtualizado);
                this.gerenciadorSessao.encerrarSessao(sessaoId);
            }

            res.status(200).json({
                sessaoId,
                resultado
            });
        } catch (erro: any) {
            res.status(400).json({ erro: erro.message || "Erro ao processar turno de combate." });
        }
    }

    /**
     * GET /api/combate/sessao/:sessaoId
     * Consulta o estado atual da batalha em andamento.
     */
    public async obterEstadoSessao(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const { sessaoId } = req.params;

            const sessao = this.gerenciadorSessao.obterSessao(sessaoId);

            if (!sessao) {
                res.status(404).json({ erro: "Sessão de combate não encontrada ou já encerrada." });
                return;
            }

            if (sessao.usuarioId !== usuarioId) {
                res.status(403).json({ erro: "Acesso negado a esta sessão de combate." });
                return;
            }

            const motor = sessao.motor;
            const heroi = motor.getHeroi();
            const monstro = motor.getMonstro();

            res.status(200).json({
                sessaoId: sessao.id,
                rodadaAtual: motor.getRodadaAtual(),
                estado: motor.getEstado(),
                logsBatalha: motor.getLogsBatalha(),
                heroi: {
                    nome: heroi.getNome(),
                    vidaAtual: heroi.getVidaAtual(),
                    vidaMaxima: heroi.getVidaMaxima(),
                    energiaAtual: heroi.getEnergiaAtual(),
                    energiaMaxima: heroi.getEnergiaMaxima()
                },
                monstro: {
                    nome: monstro.getNome(),
                    vidaAtual: monstro.getVidaAtual(),
                    vidaMaxima: monstro.getVidaMaxima(),
                    energiaAtual: monstro.getEnergiaAtual(),
                    energiaMaxima: monstro.getEnergiaMaxima()
                }
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao consultar sessão de combate." });
        }
    }
}

import { Request, Response } from "express";
import { PersonagemRepositorio } from "../../infra/repositorios/PersonagemRepositorio";
import { Personagem } from "../../dominio/entidades/personagem";

export class PersonagemControlador {
    private personagemRepositorio: PersonagemRepositorio;

    constructor() {
        this.personagemRepositorio = new PersonagemRepositorio();
    }

    /**
     * POST /api/personagens
     * Cria um novo herói respeitando estritamente a soma de 20 pontos de atributos.
     */
    public async criar(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const { nome, classe, classeHeroi, forca, defesa, agilidade } = req.body;

            const classeFinal = (classe || classeHeroi || "").toUpperCase();

            if (!nome || !classeFinal || forca === undefined || defesa === undefined || agilidade === undefined) {
                res.status(400).json({
                    erro: "Campos obrigatórios: nome, classe (GUERREIRO, MAGO, ARQUEIRO), forca, defesa e agilidade."
                });
                return;
            }

            if (!["GUERREIRO", "MAGO", "ARQUEIRO"].includes(classeFinal)) {
                res.status(400).json({
                    erro: "Classe inválida. Escolha entre: GUERREIRO, MAGO ou ARQUEIRO."
                });
                return;
            }

            const forcaNum = Number(forca);
            const defesaNum = Number(defesa);
            const agilidadeNum = Number(agilidade);

            // Validação da Regra de Negócio RN01 (exatamente 20 pontos distribuídos)
            if (forcaNum + defesaNum + agilidadeNum !== 20) {
                res.status(400).json({
                    erro: `A soma dos atributos deve ser exatamente 20 pontos. Soma atual: ${forcaNum + defesaNum + agilidadeNum}.`
                });
                return;
            }

            if (forcaNum < 1 || defesaNum < 1 || agilidadeNum < 1) {
                res.status(400).json({
                    erro: "Cada atributo deve ter pelo menos 1 ponto."
                });
                return;
            }

            // Definição de atributos derivados base por classe
            const vidaBase = 100;
            const energiaBase = classeFinal === "MAGO" ? 90 : (classeFinal === "ARQUEIRO" ? 80 : 70);

            const novoHeroi = new Personagem(
                nome.trim(),
                1,              // nivel inicial
                vidaBase,       // vidaMaxima
                vidaBase,       // vidaAtual
                energiaBase,    // energiaMaxima
                forcaNum,
                defesaNum,
                agilidadeNum,
                classeFinal as any,
                0,              // experienciaAtual
                100,            // experienciaNecessaria
                0,              // pontosLivres
                true,           // ativo
                usuarioId       // idUsuario
            );

            const heroiSalvo = await this.personagemRepositorio.salvar(novoHeroi);

            res.status(201).json({
                mensagem: "Personagem criado com sucesso!",
                personagem: this.formatarPersonagem(heroiSalvo)
            });
        } catch (erro: any) {
            res.status(400).json({ erro: erro.message || "Erro ao criar personagem." });
        }
    }

    /**
     * GET /api/personagens
     * Lista todos os heróis ativos do usuário autenticado (Soft Delete aplicado).
     */
    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const personagens = await this.personagemRepositorio.listarPorUsuario(usuarioId);

            res.status(200).json({
                total: personagens.length,
                personagens: personagens.map(p => this.formatarPersonagem(p))
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao listar personagens." });
        }
    }

    /**
     * GET /api/personagens/:id
     * Busca detalhes completos de um herói pelo ID (incluindo inventário e mural).
     */
    public async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ erro: "ID de personagem inválido." });
                return;
            }

            const heroi = await this.personagemRepositorio.buscarPorId(id);

            if (!heroi || Number(heroi.idUsuario) !== usuarioId || !heroi.ativo) {
                res.status(404).json({ erro: "Personagem não encontrado ou inativo." });
                return;
            }

            res.status(200).json({
                personagem: this.formatarPersonagem(heroi, true)
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao buscar personagem." });
        }
    }

    /**
     * POST /api/personagens/:id/distribuir-pontos
     * Permite alocar pontos livres de evolução em Força, Defesa ou Agilidade.
     */
    public async distribuirPontos(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const id = Number(req.params.id);
            const { forcaAdd = 0, defesaAdd = 0, agilidadeAdd = 0 } = req.body;

            if (isNaN(id)) {
                res.status(400).json({ erro: "ID de personagem inválido." });
                return;
            }

            const heroi = await this.personagemRepositorio.buscarPorId(id);

            if (!heroi || Number(heroi.idUsuario) !== usuarioId || !heroi.ativo) {
                res.status(404).json({ erro: "Personagem não encontrado ou inativo." });
                return;
            }

            heroi.distribuirPontos(Number(forcaAdd), Number(defesaAdd), Number(agilidadeAdd));
            await this.personagemRepositorio.atualizarProgresso(heroi);

            res.status(200).json({
                mensagem: "Pontos distribuídos com sucesso!",
                personagem: this.formatarPersonagem(heroi)
            });
        } catch (erro: any) {
            res.status(400).json({ erro: erro.message || "Erro ao distribuir pontos." });
        }
    }

    /**
     * DELETE /api/personagens/:id
     * Inativa o personagem através do Soft Delete (RF06, RF11 e RN03).
     */
    public async inativar(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId!;
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ erro: "ID de personagem inválido." });
                return;
            }

            const heroi = await this.personagemRepositorio.buscarPorId(id);

            if (!heroi || Number(heroi.idUsuario) !== usuarioId) {
                res.status(404).json({ erro: "Personagem não encontrado." });
                return;
            }

            if (!heroi.ativo) {
                res.status(400).json({ erro: "Personagem já está inativo." });
                return;
            }

            await this.personagemRepositorio.inativar(id);

            res.status(200).json({
                mensagem: "Personagem inativado com sucesso (Soft Delete mantido no banco)."
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao inativar personagem." });
        }
    }

    private formatarPersonagem(heroi: Personagem, detalhado = false): any {
        const dados: any = {
            id: heroi.getId(),
            nome: heroi.getNome(),
            classeHeroi: heroi.classeHeroi,
            nivel: heroi.getNivel(),
            vidaAtual: heroi.getVidaAtual(),
            vidaMaxima: heroi.getVidaMaxima(),
            energiaAtual: heroi.getEnergiaAtual(),
            energiaMaxima: heroi.getEnergiaMaxima(),
            forca: heroi.getForca(),
            defesa: heroi.getDefesa(),
            agilidade: heroi.getAgilidade(),
            experienciaAtual: heroi.experienciaAtual,
            experienciaNecessaria: heroi.experienciaNecessaria,
            pontosLivres: heroi.pontosLivres,
            ativo: heroi.ativo,
            monstrosDerrotados: heroi.monstrosDerrotados
        };

        if (detalhado) {
            dados.inventario = heroi.inventario.map(item => ({
                id: item.getId(),
                nome: item.getNome(),
                tipo: item.getTipo(),
                valorEfeito: item.getValorEfeito(),
                descricao: item.getDescricao()
            }));
        }

        return dados;
    }
}

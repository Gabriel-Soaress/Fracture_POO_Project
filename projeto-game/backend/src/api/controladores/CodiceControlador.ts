import { Request, Response } from "express";
import { CodiceRepositorio } from "../../infra/repositorios/CodiceRepositorio";

export class CodiceControlador {
    private codiceRepositorio: CodiceRepositorio;

    constructor() {
        this.codiceRepositorio = new CodiceRepositorio();
    }

    /**
     * GET /api/codice
     * Lista verbetes do Códice de Vaslen, com suporte a filtros por categoria e busca textual.
     */
    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const { categoria, busca } = req.query;

            let entradas;

            if (busca && typeof busca === "string") {
                entradas = await this.codiceRepositorio.buscarPorTermo(busca);
            } else if (categoria && typeof categoria === "string") {
                entradas = await this.codiceRepositorio.buscarPorCategoria(categoria);
            } else {
                entradas = await this.codiceRepositorio.listarTodas();
            }

            const cards = entradas.map(e => ({
                id: e.getId(),
                titulo: e.getTitulo(),
                categoria: e.getCategoria(),
                resumo: e.getResumo(),
                tags: e.getTags()
            }));

            res.status(200).json({
                total: cards.length,
                entradas: cards
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao consultar o Códice." });
        }
    }

    /**
     * GET /api/codice/categorias
     * Retorna a lista canônica de categorias disponíveis.
     */
    public async listarCategorias(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            categorias: ["HISTORIA", "REGIAO", "MONSTRO", "RELÍQUIA"]
        });
    }

    /**
     * GET /api/codice/:id
     * Retorna o verbete completo do Códice.
     */
    public async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ erro: "ID de verbete inválido." });
                return;
            }

            const entrada = await this.codiceRepositorio.buscarPorId(id);

            if (!entrada) {
                res.status(404).json({ erro: "Verbete do Códice não encontrado." });
                return;
            }

            res.status(200).json({
                entrada: {
                    id: entrada.getId(),
                    titulo: entrada.getTitulo(),
                    categoria: entrada.getCategoria(),
                    resumo: entrada.getResumo(),
                    conteudoCompleto: entrada.getConteudoCompleto(),
                    tags: entrada.getTags()
                }
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro ao buscar verbete do Códice." });
        }
    }
}

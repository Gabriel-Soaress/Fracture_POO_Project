import { prisma } from "../banco/prismaCliente";
import { EntradaCodice } from "../../dominio/entidades/EntradaCodice";

/**
 * Repositório do Códice de Vaslen (Padrão Repository).
 * Permite listagens categorizadas e buscas textuais com indexação no Neon PostgreSQL.
 */
export class CodiceRepositorio {
    /**
     * Retorna todas as entradas do Códice cadastradas.
     */
    public async listarTodas(): Promise<EntradaCodice[]> {
        const registros = await prisma.entradaCodice.findMany({
            orderBy: { id: "asc" }
        });

        return registros.map(r => this.reconstruirEntidade(r));
    }

    /**
     * Filtra entradas por categoria ('MONSTRO' | 'REGIAO' | 'RELÍQUIA' | 'HISTORIA').
     */
    public async buscarPorCategoria(categoria: string): Promise<EntradaCodice[]> {
        const registros = await prisma.entradaCodice.findMany({
            where: {
                categoria: {
                    equals: categoria,
                    mode: "insensitive"
                }
            },
            orderBy: { id: "asc" }
        });

        return registros.map(r => this.reconstruirEntidade(r));
    }

    /**
     * Realiza busca textual case-insensitive no título, resumo ou tags (RF12).
     */
    public async buscarPorTermo(termo: string): Promise<EntradaCodice[]> {
        const termoNormalizado = termo.trim();

        const registros = await prisma.entradaCodice.findMany({
            where: {
                OR: [
                    { titulo: { contains: termoNormalizado, mode: "insensitive" } },
                    { resumo: { contains: termoNormalizado, mode: "insensitive" } },
                    { tags: { has: termoNormalizado.toLowerCase() } }
                ]
            },
            orderBy: { id: "asc" }
        });

        return registros.map(r => this.reconstruirEntidade(r));
    }

    /**
     * Busca uma entrada específica pelo ID.
     */
    public async buscarPorId(id: number): Promise<EntradaCodice | null> {
        const registro = await prisma.entradaCodice.findUnique({
            where: { id }
        });

        if (!registro) {
            return null;
        }

        return this.reconstruirEntidade(registro);
    }

    /**
     * Salva ou atualiza uma entrada do Códice (usado no script de Seed).
     */
    public async salvar(entrada: EntradaCodice): Promise<void> {
        await prisma.entradaCodice.upsert({
            where: { id: entrada.getId() },
            update: {
                titulo: entrada.getTitulo(),
                categoria: entrada.getCategoria(),
                resumo: entrada.getResumo(),
                conteudoCompleto: entrada.getConteudoCompleto(),
                tags: entrada.getTags()
            },
            create: {
                id: entrada.getId(),
                titulo: entrada.getTitulo(),
                categoria: entrada.getCategoria(),
                resumo: entrada.getResumo(),
                conteudoCompleto: entrada.getConteudoCompleto(),
                tags: entrada.getTags()
            }
        });
    }

    private reconstruirEntidade(registro: any): EntradaCodice {
        return new EntradaCodice(
            registro.id,
            registro.titulo,
            registro.categoria as any,
            registro.resumo,
            registro.conteudoCompleto,
            registro.tags
        );
    }
}

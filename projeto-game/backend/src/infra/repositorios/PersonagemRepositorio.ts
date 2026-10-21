import { prisma } from "../banco/prismaCliente";
import { Personagem } from "../../dominio/entidades/personagem";
import { Item } from "../../dominio/entidades/Item";
import { ItemComposto } from "../../dominio/fabricas/FabricaItens";

/**
 * Repositório de Personagens (Padrão Repository).
 * Gerencia a persistência relacional do herói, seus itens e aplica o Soft Delete.
 */
export class PersonagemRepositorio {
    /**
     * Salva um novo personagem com validação de 20 pontos de atributos no banco.
     */
    public async salvar(personagem: Personagem): Promise<Personagem> {
        const registro = await prisma.personagem.create({
            data: {
                usuarioId: Number(personagem.idUsuario),
                nome: personagem.getNome(),
                classeHeroi: personagem.classeHeroi,
                nivel: personagem.getNivel(),
                experienciaAtual: personagem.experienciaAtual,
                experienciaNecessaria: personagem.experienciaNecessaria,
                vidaMaxima: personagem.getVidaMaxima(),
                vidaAtual: personagem.getVidaAtual(),
                energiaMaxima: personagem.getEnergiaMaxima(),
                energiaAtual: personagem.getEnergiaAtual(),
                forca: personagem.getForca(),
                defesa: personagem.getDefesa(),
                agilidade: personagem.getAgilidade(),
                pontosLivres: personagem.pontosLivres,
                ativo: personagem.ativo,
                monstrosDerrotados: personagem.monstrosDerrotados
            }
        });

        return this.reconstruirEntidade(registro, []);
    }

    /**
     * Retorna apenas os heróis ATIVOS vinculados a uma conta de usuário (RF05 e RN04 - Soft Delete!).
     */
    public async listarPorUsuario(usuarioId: number): Promise<Personagem[]> {
        const registros = await prisma.personagem.findMany({
            where: {
                usuarioId,
                ativo: true // FILTRO CRUCIAL DE SOFT DELETE
            },
            include: {
                inventario: true
            },
            orderBy: {
                id: "asc"
            }
        });

        return registros.map(reg => this.reconstruirEntidade(reg, reg.inventario));
    }

    /**
     * Busca um personagem específico pelo ID (mesmo inativo para auditoria).
     */
    public async buscarPorId(id: number): Promise<Personagem | null> {
        const registro = await prisma.personagem.findUnique({
            where: { id },
            include: {
                inventario: true
            }
        });

        if (!registro) {
            return null;
        }

        return this.reconstruirEntidade(registro, registro.inventario);
    }

    /**
     * Atualiza o progresso do herói após batalhas (XP, nível, atributos, loots e mural).
     */
    public async atualizarProgresso(personagem: Personagem): Promise<void> {
        const id = personagem.getId();
        if (!id) {
            throw new Error("Não é possível atualizar um personagem sem ID de persistência.");
        }

        // 1. Atualiza atributos, XP, nível e mural de monstros derrotados
        await prisma.personagem.update({
            where: { id },
            data: {
                nivel: personagem.getNivel(),
                experienciaAtual: personagem.experienciaAtual,
                experienciaNecessaria: personagem.experienciaNecessaria,
                vidaMaxima: personagem.getVidaMaxima(),
                vidaAtual: personagem.getVidaAtual(),
                energiaMaxima: personagem.getEnergiaMaxima(),
                energiaAtual: personagem.getEnergiaAtual(),
                forca: personagem.getForca(),
                defesa: personagem.getDefesa(),
                agilidade: personagem.getAgilidade(),
                pontosLivres: personagem.pontosLivres,
                ativo: personagem.ativo,
                monstrosDerrotados: personagem.monstrosDerrotados
            }
        });

        // 2. Sincroniza o inventário do herói
        await prisma.itemInventario.deleteMany({
            where: { personagemId: id }
        });

        if (personagem.inventario.length > 0) {
            await prisma.itemInventario.createMany({
                data: personagem.inventario.map(item => ({
                    personagemId: id,
                    itemId: item.getId(),
                    nome: item.getNome(),
                    tipo: item.getTipo(),
                    valorEfeito: item.getValorEfeito(),
                    valorEnergia: item instanceof ItemComposto ? item.getValorEnergia() : 0,
                    descricao: item.getDescricao()
                }))
            });
        }
    }

    /**
     * Executa a inativação lógica definitiva no banco de dados (RF06, RF11 e RN03 - Soft Delete).
     */
    public async inativar(id: number): Promise<void> {
        await prisma.personagem.update({
            where: { id },
            data: { ativo: false }
        });
    }

    /**
     * Método auxiliar privado que reconstrói a instância de POO pura a partir dos dados do banco.
     */
    private reconstruirEntidade(registro: any, itensBanco: any[]): Personagem {
        const itensReconstruidos: Item[] = itensBanco.map(item => {
            if (item.tipo === "CURA_VIDA" && item.valorEnergia && item.valorEnergia > 0) {
                return new ItemComposto(
                    item.itemId,
                    item.nome,
                    item.valorEfeito,
                    item.valorEnergia,
                    item.descricao
                );
            }
            return new Item(
                item.itemId,
                item.nome,
                item.tipo as any,
                item.valorEfeito,
                item.descricao
            );
        });

        return new Personagem(
            registro.nome,
            registro.nivel,
            registro.vidaMaxima,
            registro.vidaAtual,
            registro.energiaMaxima,
            registro.forca,
            registro.defesa,
            registro.agilidade,
            registro.classeHeroi as any,
            registro.experienciaAtual,
            registro.experienciaNecessaria,
            registro.pontosLivres,
            registro.ativo,
            registro.usuarioId,
            itensReconstruidos,
            registro.id,
            registro.monstrosDerrotados
        );
    }
}

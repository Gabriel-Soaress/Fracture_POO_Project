import { prisma } from "../banco/prismaCliente";
import { Usuario, TipoUsuario } from "../../dominio/entidades/usuario";

/**
 * Repositório de Usuários (Padrão Repository).
 * Isola as operações SQL do Neon PostgreSQL, reconstruindo instâncias puras de POO.
 */
export class UsuarioRepositorio {
    /**
     * Salva um novo usuário no banco de dados.
     */
    public async salvar(usuario: Usuario): Promise<Usuario> {
        const registro = await prisma.usuario.create({
            data: {
                nome: usuario.getNome(),
                email: usuario.getEmail(),
                senhaHash: usuario.getSenhaHash(),
                tipoUsuario: usuario.getTipoUsuario()
            }
        });

        return new Usuario(
            registro.id,
            registro.nome,
            registro.email,
            registro.senhaHash,
            registro.tipoUsuario as TipoUsuario
        );
    }

    /**
     * Localiza um usuário pelo seu endereço de e-mail (usado no login e validação).
     */
    public async buscarPorEmail(email: string): Promise<Usuario | null> {
        const registro = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!registro) {
            return null;
        }

        return new Usuario(
            registro.id,
            registro.nome,
            registro.email,
            registro.senhaHash,
            registro.tipoUsuario as TipoUsuario
        );
    }

    /**
     * Localiza um usuário pelo seu ID único.
     */
    public async buscarPorId(id: number): Promise<Usuario | null> {
        const registro = await prisma.usuario.findUnique({
            where: { id }
        });

        if (!registro) {
            return null;
        }

        return new Usuario(
            registro.id,
            registro.nome,
            registro.email,
            registro.senhaHash,
            registro.tipoUsuario as TipoUsuario
        );
    }
}

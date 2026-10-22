import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepositorio } from "../../infra/repositorios/UsuarioRepositorio";
import { Usuario } from "../../dominio/entidades/usuario";

export class AutenticacaoControlador {
    private usuarioRepositorio: UsuarioRepositorio;

    constructor() {
        this.usuarioRepositorio = new UsuarioRepositorio();
    }

    /**
     * POST /api/auth/cadastro
     * Cadastra um novo jogador no sistema.
     */
    public async cadastro(req: Request, res: Response): Promise<void> {
        try {
            const { nome, email, senha } = req.body;

            if (!nome || !email || !senha) {
                res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios." });
                return;
            }

            if (senha.length < 6) {
                res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres." });
                return;
            }

            const emailNormalizado = String(email).trim().toLowerCase();
            const usuarioExistente = await this.usuarioRepositorio.buscarPorEmail(emailNormalizado);

            if (usuarioExistente) {
                res.status(409).json({ erro: "Já existe um usuário cadastrado com este e-mail." });
                return;
            }

            const saltRounds = 10;
            const senhaHash = await bcrypt.hash(senha, saltRounds);

            const novoUsuario = new Usuario(
                0,
                nome.trim(),
                emailNormalizado,
                senhaHash,
                "JOGADOR"
            );

            const usuarioSalvo = await this.usuarioRepositorio.salvar(novoUsuario);

            res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso!",
                usuario: {
                    id: usuarioSalvo.getId(),
                    nome: usuarioSalvo.getNome(),
                    email: usuarioSalvo.getEmail(),
                    tipoUsuario: usuarioSalvo.getTipoUsuario()
                }
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro interno ao cadastrar usuário." });
        }
    }

    /**
     * POST /api/auth/login
     * Autentica o jogador e gera o token de acesso JWT.
     */
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
                return;
            }

            const emailNormalizado = String(email).trim().toLowerCase();
            const usuario = await this.usuarioRepositorio.buscarPorEmail(emailNormalizado);

            if (!usuario) {
                res.status(401).json({ erro: "Credenciais inválidas." });
                return;
            }

            const senhaCorreta = await bcrypt.compare(senha, usuario.getSenhaHash());
            if (!senhaCorreta) {
                res.status(401).json({ erro: "Credenciais inválidas." });
                return;
            }

            const segredo = process.env.JWT_SECRET || "segredo_super_seguro_vaslen_echoes_2026";
            const token = jwt.sign(
                {
                    id: usuario.getId(),
                    email: usuario.getEmail(),
                    tipo: usuario.getTipoUsuario()
                },
                segredo,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                token,
                usuario: {
                    id: usuario.getId(),
                    nome: usuario.getNome(),
                    email: usuario.getEmail(),
                    tipoUsuario: usuario.getTipoUsuario()
                }
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro interno ao autenticar usuário." });
        }
    }

    /**
     * GET /api/auth/me
     * Retorna os dados do usuário autenticado.
     */
    public async me(req: Request, res: Response): Promise<void> {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) {
                res.status(401).json({ erro: "Não autenticado." });
                return;
            }

            const usuario = await this.usuarioRepositorio.buscarPorId(usuarioId);
            if (!usuario) {
                res.status(404).json({ erro: "Usuário não encontrado." });
                return;
            }

            res.status(200).json({
                usuario: {
                    id: usuario.getId(),
                    nome: usuario.getNome(),
                    email: usuario.getEmail(),
                    tipoUsuario: usuario.getTipoUsuario()
                }
            });
        } catch (erro: any) {
            res.status(500).json({ erro: erro.message || "Erro interno ao carregar perfil." });
        }
    }
}

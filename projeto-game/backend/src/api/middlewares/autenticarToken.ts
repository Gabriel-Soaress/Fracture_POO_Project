import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extensão de tipos do Express para injetar os dados do usuário autenticado
declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
            usuarioEmail?: string;
        }
    }
}

interface TokenPayload {
    id: number;
    email: string;
    tipo?: string;
}

/**
 * Middleware para validar o token JWT nas rotas protegidas da API.
 * Extrai o Bearer token do cabeçalho Authorization e injeta usuarioId na requisição.
 */
export function autenticarToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ erro: "Token de autorização não fornecido." });
        return;
    }

    const partes = authHeader.split(" ");
    if (partes.length !== 2 || partes[0] !== "Bearer") {
        res.status(401).json({ erro: "Formato de token inválido. Esperado: Bearer <TOKEN>." });
        return;
    }

    const token = partes[1];
    const segredo = process.env.JWT_SECRET || "segredo_super_seguro_vaslen_echoes_2026";

    try {
        const decodificado = jwt.verify(token, segredo) as TokenPayload;
        req.usuarioId = decodificado.id;
        req.usuarioEmail = decodificado.email;
        next();
    } catch (erro) {
        res.status(403).json({ erro: "Token inválido ou expirado." });
    }
}

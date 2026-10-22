import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { rotasAuth } from "./api/rotas/autenticacaoRotas";
import { rotasPersonagem } from "./api/rotas/personagemRotas";
import { rotasCodice } from "./api/rotas/codiceRotas";
import { rotasCombate } from "./api/rotas/combateRotas";

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de verificação de status (Health Check)
app.get("/api/status", (req: Request, res: Response) => {
    res.status(200).json({
        status: "online",
        jogo: "Fracture: The Vaslen Echoes",
        versao: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// Registro de rotas RESTful
app.use("/api/auth", rotasAuth);
app.use("/api/personagens", rotasPersonagem);
app.use("/api/codice", rotasCodice);
app.use("/api/combate", rotasCombate);

// Tratamento para rotas inexistentes (404)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        erro: `Rota ${req.method} ${req.originalUrl} não encontrada.`
    });
});

// Middleware global de captura e tratamento de erros
app.use((erro: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 [ERRO GLOBAL NÃO TRATADO]:", erro);
    res.status(erro.status || 500).json({
        erro: erro.message || "Erro interno do servidor.",
        status: erro.status || 500
    });
});

export { app };

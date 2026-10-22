import { Router } from "express";
import { CombateControlador } from "../controladores/CombateControlador";
import { autenticarToken } from "../middlewares/autenticarToken";

const rotasCombate = Router();
const controlador = new CombateControlador();

// Todas as rotas de combate requerem token JWT
rotasCombate.use(autenticarToken);

rotasCombate.get("/mural/:bioma", (req, res) => controlador.mural(req, res));
rotasCombate.post("/iniciar", (req, res) => controlador.iniciar(req, res));
rotasCombate.post("/turno", (req, res) => controlador.processarTurno(req, res));
rotasCombate.get("/sessao/:sessaoId", (req, res) => controlador.obterEstadoSessao(req, res));

export { rotasCombate };

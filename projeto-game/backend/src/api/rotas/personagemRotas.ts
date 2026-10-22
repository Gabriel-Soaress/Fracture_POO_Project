import { Router } from "express";
import { PersonagemControlador } from "../controladores/PersonagemControlador";
import { autenticarToken } from "../middlewares/autenticarToken";

const rotasPersonagem = Router();
const controlador = new PersonagemControlador();

// Todas as rotas de personagens requerem token JWT válido
rotasPersonagem.use(autenticarToken);

rotasPersonagem.post("/", (req, res) => controlador.criar(req, res));
rotasPersonagem.get("/", (req, res) => controlador.listar(req, res));
rotasPersonagem.get("/:id", (req, res) => controlador.buscarPorId(req, res));
rotasPersonagem.post("/:id/distribuir-pontos", (req, res) => controlador.distribuirPontos(req, res));
rotasPersonagem.delete("/:id", (req, res) => controlador.inativar(req, res));

export { rotasPersonagem };

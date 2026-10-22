import { Router } from "express";
import { AutenticacaoControlador } from "../controladores/AutenticacaoControlador";
import { autenticarToken } from "../middlewares/autenticarToken";

const rotasAuth = Router();
const controlador = new AutenticacaoControlador();

rotasAuth.post("/cadastro", (req, res) => controlador.cadastro(req, res));
rotasAuth.post("/login", (req, res) => controlador.login(req, res));
rotasAuth.get("/me", autenticarToken, (req, res) => controlador.me(req, res));

export { rotasAuth };

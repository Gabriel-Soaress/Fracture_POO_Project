import { Router } from "express";
import { CodiceControlador } from "../controladores/CodiceControlador";

const rotasCodice = Router();
const controlador = new CodiceControlador();

// Rotas públicas do Códice de Vaslen
rotasCodice.get("/", (req, res) => controlador.listar(req, res));
rotasCodice.get("/categorias", (req, res) => controlador.listarCategorias(req, res));
rotasCodice.get("/:id", (req, res) => controlador.buscarPorId(req, res));

export { rotasCodice };

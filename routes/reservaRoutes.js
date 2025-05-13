const express = require("express");
const reservaController = require("../controllers/reservaController");

const routes = express.Router();

routes.get("/", reservaController.relatorio);
routes.get("/cadastrar", reservaController.cadastrar);
routes.get("/:cod", reservaController.detalhar);
routes.post("/", reservaController.salvar)

module.exports = routes;
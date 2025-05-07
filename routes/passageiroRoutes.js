const express = require("express");
const passageiroController = require("../controllers/passageiroController");

const routes = express.Router();

routes.get("/", passageiroController.relatorio);
routes.get("/cadastrar", passageiroController.cadastrar);
routes.get("/search/:cpf", passageiroController.buscarPorCpf);
routes.get("/:_id", passageiroController.detalhar);
routes.post("/", passageiroController.salvar);

module.exports = routes;

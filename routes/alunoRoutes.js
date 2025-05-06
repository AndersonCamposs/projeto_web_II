const express = require("express");
const alunoController = require("../controllers/alunoController");

const routes = express.Router();

routes.get("/", alunoController.relatorio);

routes.get("/cadastrar", alunoController.cadastrar);

routes.post("/", alunoController.salvar);

routes.get("/:matricula", alunoController.detalhar);

module.exports = routes;

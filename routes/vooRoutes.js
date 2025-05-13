const express = require("express");
const vooControler = require("../controllers/vooController");

const routes = express.Router();

routes.get("/", vooControler.relatorio);
routes.get("/cadastrar", vooControler.cadastrar);
routes.get("/:_id", vooControler.detalhar);
routes.post("/", vooControler.salvar);

module.exports = routes;

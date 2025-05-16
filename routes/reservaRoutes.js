const express = require('express');
const reservaController = require('../controllers/reservaController');

const routes = express.Router();

routes.get('/', reservaController.relatorio);
routes.get('/cadastrar/:_id?', reservaController.cadastrar);
routes.get('/delete/:_id', reservaController.deletar);
routes.get('/:cod', reservaController.detalhar);
routes.post('/', reservaController.salvar);

module.exports = routes;

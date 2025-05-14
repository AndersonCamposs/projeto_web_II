const express = require('express');
const passageiroController = require('../controllers/passageiroController');

const routes = express.Router();

routes.get('/', passageiroController.relatorio);
routes.get('/cadastrar/:_id?', passageiroController.cadastrar);
routes.get('/search/:cpf', passageiroController.buscarPorCpf);
routes.get('/delete/:_id', passageiroController.deletar);
routes.get('/:_id', passageiroController.detalhar);
routes.post('/', passageiroController.salvar);

module.exports = routes;

const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const routes = express.Router();

routes.get('/', usuarioController.relatorio);
routes.get('/login', usuarioController.loginGet);
routes.post('/login', usuarioController.loginPost);
routes.get('/cadastrar/:_id?', usuarioController.cadastrar);
routes.get('/delete/:_id', usuarioController.deletar);
routes.get('/:_id', usuarioController.detalhar);
routes.post('/', usuarioController.salvar);

module.exports = routes;

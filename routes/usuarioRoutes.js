const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const routes = express.Router();

routes.get('/', usuarioController.relatorio);
routes.get('/login', usuarioController.loginGet);
routes.post('/login', usuarioController.loginPost);
routes.get('/logout', usuarioController.logout);
routes.get('/editarPerfil', usuarioController.redirectEditarPerfil);
routes.get('/cadastrar/:cod?', usuarioController.cadastrar);
routes.get('/delete/:_id', usuarioController.deletar);
routes.get('/:cod', usuarioController.detalhar);
routes.post('/', usuarioController.salvar);

module.exports = routes;

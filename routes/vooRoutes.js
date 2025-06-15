const express = require('express');
const vooControler = require('../controllers/vooController');

const routes = express.Router();

routes.get('/', vooControler.relatorio);
routes.get('/cadastrar/:cod?', vooControler.cadastrar);
routes.get('/delete/:cod', vooControler.deletar);
routes.get('/:cod', vooControler.detalhar);
routes.post('/', vooControler.salvar);

module.exports = routes;

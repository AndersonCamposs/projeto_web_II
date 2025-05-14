const mongoose = require('mongoose');
const Voo = require('../models/Voo');
const { formatDate, formatHour } = require('../utils/formatterUtils');
const { gerarCodigo } = require('../utils/nanoidUtils');

class VooController {
  static async relatorio(req, res) {
    const s = req.query.s;
    const listaVoos = await Voo.find();
    res.render('voo/relatorio', { listaVoos, s, formatDate, formatHour });
  }

  static async cadastrar(req, res) {
    res.render('voo/cadastrar');
  }

  static async salvar(req, res) {
    const { paisOrigem, estadoOrigem, cidadeOrigem, paisDestino, estadoDestino, cidadeDestino, tipoVoo, data, hora } =
      req.body;
    const novoVoo = new Voo({
      cod: await gerarCodigo(5),
      paisOrigem,
      estadoOrigem,
      cidadeOrigem,
      paisDestino,
      estadoDestino,
      cidadeDestino,
      data: `${data}T${hora}Z`,
      tipoVoo,
    });

    await novoVoo.save();

    res.redirect('/voos?s=1');
  }

  static async detalhar(req, res) {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
      idObject = new mongoose.Types.ObjectId(idString);
    }
    const voo = await Voo.findOne({ _id: idObject });
    res.render('voo/detalhe', { voo, formatDate, formatHour });
  }
}

module.exports = VooController;

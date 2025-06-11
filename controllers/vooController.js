const mongoose = require('mongoose');
const Voo = require('../models/Voo');
const { formatDate, formatHour } = require('../utils/formatterUtils');
const { gerarCodigo } = require('../utils/nanoidUtils');
const Passageiro = require('../models/Passageiro');
const Reserva = require('../models/Reserva');

class VooController {
  static async relatorio(req, res) {
    const s = req.query.s;
    const listaVoos = await Voo.find();
    res.render('voo/relatorio', { listaVoos, s, formatDate, formatHour });
  }

  static async cadastrar(req, res) {
    const cod = req.params.cod;
    let voo = {};
    if (cod) {
      voo = await Voo.findOne({ cod });
    }

    if (voo.cod) {
      // se houver voo
      if (new Date(voo.data) < new Date()) {
        res.redirect(`/voos/${voo.cod}`);
        return;
      }
    }
    res.render('voo/cadastrar', { voo });
  }

  static async salvar(req, res) {
    const {
      _id,
      cod,
      paisOrigem,
      estadoOrigem,
      cidadeOrigem,
      paisDestino,
      estadoDestino,
      cidadeDestino,
      tipoVoo,
      data,
      hora,
    } = req.body;
    let status = '';
    const obj = {
      cod: cod ? cod : await gerarCodigo(5),
      paisOrigem,
      estadoOrigem,
      cidadeOrigem,
      paisDestino,
      estadoDestino,
      cidadeDestino,
      tipoVoo,
      data: new Date(`${data}T${hora}Z`), // formato: aaaa-mm-ddT00:00:00Z (isostring)
    };

    if (_id) {
      status = 3;
      await Voo.updateOne({ _id }, obj);
    } else {
      status = 1;
      const novoVoo = new Voo(obj);
      await novoVoo.save();
    }

    res.redirect(`/voos?s=${status}`);
  }

  static async detalhar(req, res) {
    const cod = req.params.cod;
    let jaPassou = false;
    const voo = await Voo.findOne({ cod });
    if (voo && new Date(voo.data) < new Date()) {
      jaPassou = true;
    }
    res.render('voo/detalhe', { voo, formatDate, formatHour, jaPassou });
  }

  static async deletar(req, res) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const idString = req.params._id;
      let idObject = null;
      if (mongoose.Types.ObjectId.isValid(idString)) {
        idObject = new mongoose.Types.ObjectId(idString);
      }

      const vooExistente = await Voo.findOne({ _id: idObject });
      if (vooExistente) {
        await Reserva.deleteMany({ voo: vooExistente._id });
      }

      await Voo.deleteOne({ _id: idObject });

      await session.commitTransaction();
      session.endSession();

      res.redirect('/voos?s=2');
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw new Error('Erro ao deletar voo.');
    }
  }
}

module.exports = VooController;

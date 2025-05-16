const monmgoose = require('mongoose');
const Reserva = require('../models/Reserva');
const Voo = require('../models/Voo');
const { formatDate, formatHour, formatarDataHora } = require('../utils/formatterUtils');
const { gerarCodigo } = require('../utils/nanoidUtils');
const { default: mongoose } = require('mongoose');

class ReservaController {
  static async relatorio(req, res) {
    const s = req.query.s;
    const listaReservas = await Reserva.find().populate('passageiro').populate('voo');
    res.render('reserva/relatorio', { listaReservas, s, formatDate });
  }

  static async cadastrar(req, res) {
    const _id = req.params._id;
    let reserva = {};
    if (_id) {
      reserva = await Reserva.findOne({ _id }).populate('passageiro').populate('voo');
    }
    const listaVoos = await Voo.find({ data: { $gt: new Date() } }); // lista de voos disponíveis
    res.render('reserva/cadastrar', { reserva, listaVoos, formatarDataHora });
  }

  static async detalhar(req, res) {
    const cod = req.params.cod;
    const reserva = await Reserva.findOne({ cod }).populate('passageiro').populate('voo');
    res.render('reserva/detalhe', { reserva, formatDate, formatHour });
  }

  static async salvar(req, res) {
    const { _id, cod, idVoo, idPassageiro, valorReserva, tipoPagamento } = req.body;
    let status = '';
    const valorNormalizado = valorReserva.replace(',', '.');
    let obj = {
      cod: cod ? cod : await gerarCodigo(5),
      valor: valorNormalizado,
      tipoPagamento,
      passageiro: idPassageiro,
      voo: idVoo,
    };
    console.log(obj);
    if (_id) {
      status = 3;
      await Reserva.updateOne({ _id }, obj);
    } else {
      status = 1;
      const novaReserva = new Reserva(obj);
      await novaReserva.save();
    }

    res.redirect(`/reservas?s=${status}`);
  }

  static async deletar(req, res) {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
      idObject = new mongoose.Types.ObjectId(idString);
    }

    await Reserva.deleteOne({ _id: idString });

    res.redirect('/reservas?s=2');
  }
}

module.exports = ReservaController;

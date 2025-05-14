const monmgoose = require('mongoose');
const Reserva = require('../models/Reserva');
const Voo = require('../models/Voo');
const { formatDate, formatHour } = require('../utils/formatterUtils');
const { gerarCodigo } = require('../utils/nanoidUtils');

class ReservaController {
  static async relatorio(req, res) {
    const s = req.query.s;
    const listaReservas = await Reserva.find().populate('passageiro').populate('voo');
    res.render('reserva/relatorio', { listaReservas, s, formatDate });
  }

  static async cadastrar(req, res) {
    const listaVoos = await Voo.find({ data: { $gt: new Date() } }); // lista de voos disponíveis
    res.render('reserva/cadastrar', { listaVoos: JSON.stringify(listaVoos) });
  }

  static async detalhar(req, res) {
    const cod = req.params.cod;
    const reserva = await Reserva.findOne({ cod }).populate('passageiro').populate('voo');
    res.render('reserva/detalhe', { reserva, formatDate, formatHour });
  }

  static async salvar(req, res) {
    const { idVoo, idPassageiro, valorReserva, tipoPagamento } = req.body;
    const valorNormalizado = valorReserva.replace(',', '.');
    const novaReserva = new Reserva({
      cod: await gerarCodigo(5),
      valor: valorNormalizado,
      tipoPagamento,
      passageiro: idPassageiro,
      voo: idVoo,
    });
    await novaReserva.save();
    res.redirect('/reservas?s=1');
  }
}

module.exports = ReservaController;

const mongoose = require('mongoose');
const Passageiro = require('../models/Passageiro');
const { formatDate } = require('../utils/formatterUtils');

class PassageiroController {
  static async relatorio(req, res) {
    const s = req.query.s;
    const listaPassageiros = await Passageiro.find();
    res.render('passageiro/relatorio', {
      listaPassageiros,
      s,
      formatDate,
    });
  }

  static async cadastrar(req, res) {
    const _id = req.params._id;
    let passageiro = {};
    if (_id) {
      passageiro = await Passageiro.findOne({ _id });
    }

    res.render('passageiro/cadastrar', { passageiro });
  }

  static async salvar(req, res) {
    const { _id, nome, cpf, rg, dataNascimento, telefone, estado, cidade, logradouro, bairro, numeroResidencia } =
      req.body;
    let status = '';
    const obj = {
      nome,
      cpf,
      rg,
      dataNascimento: new Date(dataNascimento),
      telefone,
      estado,
      cidade,
      logradouro,
      bairro,
      numeroResidencia,
    };

    if (_id) {
      status = 3;
      await Passageiro.updateOne({ _id }, obj);
    } else {
      status = 1;
      const novoPassageiro = new Passageiro(obj);
      await novoPassageiro.save();
    }

    res.redirect(`/passageiros?s=${status}`);
  }

  static async buscarPorCpf(req, res) {
    const cpf = req.params.cpf;
    const passageiro = await Passageiro.findOne({ cpf });
    if (passageiro) {
      res.status(200).json(passageiro);
    } else {
      res.status(404).json({ mensagem: 'Passageiro não encontrado.' });
    }
  }

  static async detalhar(req, res) {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
      idObject = new mongoose.Types.ObjectId(idString);
    }
    const passageiro = await Passageiro.findOne({ _id: idObject });
    res.render('passageiro/detalhe', { passageiro, formatDate });
  }

  static async deletar(req, res) {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
      idObject = new mongoose.Types.ObjectId(idString);
    }

    await Passageiro.deleteOne({ _id: idObject });
    res.redirect('/passageiros?s=2');
  }

  static async redirectUpdate(req, res) {
    const _id = req.params._id;
    const passageiro = await Passageiro.findOne({ _id });

    res.render('passageiro/cadastrar', { passageiro });
  }
}

module.exports = PassageiroController;

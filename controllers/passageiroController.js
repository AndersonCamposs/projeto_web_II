const mongoose = require('mongoose');
const Passageiro = require('../models/Passageiro');
const { formatDate } = require('../utils/formatterUtils');
const Reserva = require('../models/Reserva');

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
    console.log(req.body);
    const _id = req.params._id;
    let passageiro = {};
    if (_id) {
      passageiro = await Passageiro.findOne({ _id });
    }

    res.render('passageiro/cadastrar', { passageiro, errorMessage: null });
  }

  static async salvar(req, res) {
    try {
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

      const passageiroExistente = await Passageiro.findOne({ cpf });

      if (passageiroExistente) {
        e = new Error(`Já existe um passageiro com o ${cpf}`);
        e.passageiro = obj;
        throw e;
      }

      if (_id) {
        status = 3;
        await Passageiro.updateOne({ _id }, obj);
      } else {
        status = 1;
        const novoPassageiro = new Passageiro(obj);
        await novoPassageiro.save();
      }

      res.redirect(`/passageiros?s=${status}`);
    } catch (e) {
      await fetch('http://localhost:5500/passageiro/cadastrar');
    }
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
    const session = await mongoose.startSession();
    try {
      const idString = req.params._id;
      let idObject = null;
      if (mongoose.Types.ObjectId.isValid(idString)) {
        idObject = new mongoose.Types.ObjectId(idString);
      }
      const passageiroExistente = await Passageiro.findOne({ _id: idObject });
      if (passageiroExistente) {
        await Reserva.deleteMany({ passageiro: passageiroExistente._id });
      }
      await Passageiro.deleteOne({ _id: idObject });

      await session.commitTransaction();
      session.endSession();

      res.redirect('/passageiros?s=2');
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw new Error('Erro ao deletar passageiro.');
    }
  }
}

module.exports = PassageiroController;

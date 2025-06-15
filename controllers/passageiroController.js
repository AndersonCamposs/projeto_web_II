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
    const { addPassageiroErro } = req.session;
    delete req.session.addPassageiroErro;
    const _id = req.params._id;
    let passageiro = {};
    let errorMessage = null;
    if (addPassageiroErro) {
      passageiro = addPassageiroErro.passageiroAdicionado;
      // converte a string armazenada na sessão para um Date
      passageiro.dataNascimento = new Date(passageiro.dataNascimento);
      errorMessage = addPassageiroErro.mensagem;
    } else {
      if (_id) {
        passageiro = await Passageiro.findOne({ _id });
      }
    }

    res.render('passageiro/cadastrar', { passageiro, errorMessage });
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

      if (!_id) {
        const passageiroExistente = await Passageiro.findOne({ cpf });

        if (passageiroExistente) {
          const e = new Error(`Já existe um passageiro com o ${cpf}`);
          e.obj = obj;
          throw e;
        }
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
      req.session.addPassageiroErro = {
        passageiroAdicionado: e.obj,
        mensagem: e.message,
      };

      res.redirect('/passageiros/cadastrar');
    }
  }

  static async buscarPorCpf(req, res) {
    const cpf = req.params.cpf;
    const passageiro = await Passageiro.findOne({ cpf });
    const listaPassageiros = await Passageiro.find();

    if (listaPassageiros.length == 0) {
      res.status(400).json({
        mensagem: 'Não existem passageiros cadastrados. Adicione algum passageiro para realizar uma reserva.',
      });
    } else {
      if (passageiro) {
        res.status(200).json({ passageiro, mensagem: `Passageiro(a) ${passageiro.nome} encontrado(a) com sucesso.` });
      } else {
        res.status(404).json({ mensagem: 'Passageiro não encontrado.' });
      }
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
      session.startTransaction();

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

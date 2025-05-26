const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

const { gerarCodigo } = require('../utils/nanoidUtils');
const { formatDate } = require('../utils/formatterUtils');

class UsuarioController {
  static async relatorio(req, res) {
    const s = req.query.s;
    const listaUsuarios = await Usuario.find();
    res.render('usuario/relatorio', {
      listaUsuarios,
      s,
      formatDate,
    });
  }

  static async cadastrar(req, res) {
    const hasAutenticacao = req.session.usuario !== undefined;

    const _id = req.params._id;
    let usuario = {};
    if (_id && hasAutenticacao) {
      usuario = await Usuario.findOne({ _id });
    }

    res.render('usuario/cadastrar', { usuario, errorMessage: null, hasAutenticacao });
  }

  static async salvar(req, res) {
    try {
      const { _id, cod, nome, email, senha } = req.body;
      let status = '';
      const obj = {
        cod: cod ? cod : await gerarCodigo(5),
        nome,
        email,
      };

      if (!_id) {
        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
          const e = new Error(`Já existe um usuario com o e-mail ${email}`);
          e.code = 409;
          throw e;
        }
      }

      if (_id) {
        status = 3;
        await Usuario.updateOne({ _id }, obj);
      } else {
        status = 1;
        const hash = bcrypt.hashSync(senha, bcrypt.genSaltSync(10));
        const novoUsuario = new Usuario({ ...obj, senha: hash });
        await novoUsuario.save();
      }

      res.redirect(`/usuarios?s=${status}`);
    } catch (e) {
      res.render('error', { error: e });
    }
  }

  static async detalhar(req, res) {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
      idObject = new mongoose.Types.ObjectId(idString);
    }
    const usuario = await Usuario.findOne({ _id: idObject });
    res.render('usuario/detalhe', { usuario, formatDate });
  }

  static async deletar(req, res) {
    try {
      const idString = req.params._id;
      let idObject = null;
      if (mongoose.Types.ObjectId.isValid(idString)) {
        idObject = new mongoose.Types.ObjectId(idString);
      }
      await Usuario.deleteOne({ _id: idObject });
      res.redirect('/usuarios?s=2');
    } catch (e) {
      console.log(e);
    }
  }

  static async loginGet(req, res) {
    const s = req.query.s;

    res.render('login', { s });
  }

  static async loginPost(req, res) {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
      req.session.usuario = { nome: usuario.nome };
      res.redirect('/');
    } else {
      res.redirect('/usuarios/login?s=1');
    }
  }

  static async logout(req, res) {
    req.session.destroy((e) => {
      if (e) {
        res.render('error', { error: e });
      }
    });

    res.clearCookie('connect.sid');
    res.redirect('/usuarios/login');
  }
}

module.exports = UsuarioController;

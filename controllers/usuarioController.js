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
      usuarioLogado: req.session.usuario,
    });
  }

  static async cadastrar(req, res) {
    const { addUsuarioErro } = req.session;
    delete req.session.addUsuarioErro;

    const hasAutenticacao = req.session.usuario !== undefined;

    const cod = req.params.cod;

    let usuario = {};
    if (cod && hasAutenticacao) {
      if (req.session.usuario.cod != cod) {
        // impede que o usuário edite o perfil que não seja dele
        res.redirect('/usuarios');
        return;
      }
      usuario = await Usuario.findOne({ cod });
    }

    let errorMessage = null;
    if (addUsuarioErro) {
      usuario = addUsuarioErro.usuarioAdicionado;
      errorMessage = addUsuarioErro.mensagem;
    }

    res.render('usuario/cadastrar', { usuario, errorMessage, hasAutenticacao });
  }

  static async salvar(req, res) {
    try {
      const { _id, cod, nome, email, senha } = req.body;
      let status = '';
      const obj = {
        cod: cod ? cod : await gerarCodigo(5),
        nome,
        email,
        senha,
      };

      if (!_id) {
        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
          const e = new Error(`E-mail indisponível.`);
          e.obj = obj;
          throw e;
        }
      }

      if (_id) {
        status = 3;
        obj.senha = bcrypt.hashSync(senha, bcrypt.genSaltSync(10)); // gera o novo hash
        await Usuario.updateOne({ _id }, obj);
        res.redirect(`/usuarios/logout?s=${status}`);
      } else {
        status = 1;
        const hash = bcrypt.hashSync(senha, bcrypt.genSaltSync(10));
        const novoUsuario = new Usuario({ ...obj, senha: hash });
        await novoUsuario.save();
        res.redirect(`/usuarios/login?s=${status}`);
      }
    } catch (e) {
      req.session.addUsuarioErro = {
        usuarioAdicionado: e.obj,
        mensagem: e.message,
      };

      res.redirect('/usuarios/cadastrar');
    }
  }

  static async detalhar(req, res) {
    const cod = req.params.cod;
    const usuario = await Usuario.findOne({ cod });
    res.render('usuario/detalhe', { usuario, formatDate });
  }

  static async deletar(req, res) {
    try {
      // o usuário só pode deletar o próprio perfil
      const cod = req.params.cod;
      if (cod != req.session.usuario.cod) {
        res.redirect('/usuarios');
        return;
      }
      await Usuario.deleteOne({ cod });
      res.redirect('/usuarios/logout?s=2');
    } catch (e) {
      console.log(e);
    }
  }

  static loginGet(req, res) {
    const s = req.query.s;

    if (req.session.usuario && req.session.usuario.nome) {
      res.render('index', { usuario: req.session.usuario });
    } else {
      res.render('login', { s });
    }
  }

  static async loginPost(req, res) {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
      req.session.usuario = { nome: usuario.nome, email: usuario.email, cod: usuario.cod };
      res.redirect('/');
    } else {
      res.redirect('/usuarios/login?s=4');
    }
  }

  static logout(req, res) {
    const s = req.query.s;

    req.session.destroy((e) => {
      if (e) {
        res.render('error', { error: e });
      }
    });

    res.clearCookie('connect.sid');

    res.redirect(`/usuarios/login${s ? '?s=' + s : ''}`);
  }

  static redirectEditarPerfil(req, res) {
    const usuarioCod = req.session.usuario.cod;
    res.redirect(`/usuarios/cadastrar/${usuarioCod}`);
  }
}

module.exports = UsuarioController;

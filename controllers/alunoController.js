const Aluno = require('../models/Aluno');

class AlunoController {
  static async relatorio(req, res) {
    const status = req.query.s;
    const lista = await Aluno.find();
    res.render('aluno/relatorio', { lista, status });
  }

  static async cadastrar(req, res) {
    res.render('aluno/cadastrar');
  }

  static async salvar(req, res) {
    const { matricula, nome, curso } = req.body;
    const novoAluno = new Aluno({
      matricula,
      nome,
      curso,
    });
    await novoAluno.save();
    res.redirect('/alunos?s=1');
  }

  static async detalhar(req, res) {
    const matricula = Number(req.params.matricula);
    const aluno = await Aluno.findOne({ matricula });
    res.render('aluno/detalhe', { aluno });
  }
}

module.exports = AlunoController;

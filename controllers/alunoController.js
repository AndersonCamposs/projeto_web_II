const AlunoModel = require("../model/Aluno");

class AlunoController {
    static async listar(req, res) {
        const alunos = await AlunoModel.find();
        res.render("aluno/relatorio", { alunos });
    }
}

module.exports = AlunoController;

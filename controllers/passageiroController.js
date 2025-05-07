const mongoose = require("mongoose");
const Passageiro = require("../models/Passageiro");
const { formatDate } = require("../utils/formatterUtils");

class PassageiroController {
    static async relatorio(req, res) {
        const s = req.query.s;
        const listaPassageiros = await Passageiro.find();
        res.render("passageiro/relatorio", {
            listaPassageiros,
            s,
            formatDate,
        });
    }

    static async cadastrar(req, res) {
        res.render("passageiro/cadastrar");
    }

    static async salvar(req, res) {
        const {
            nome,
            cpf,
            rg,
            dataNascimento,
            telefone,
            estado,
            cidade,
            logradouro,
            bairro,
            numeroResidencia,
        } = req.body;
        const novoPassageiro = new Passageiro({
            nome,
            cpf,
            rg,
            dataNascimento,
            telefone,
            estado,
            cidade,
            logradouro,
            bairro,
            numeroResidencia,
        });
        await novoPassageiro.save();

        res.redirect("/passageiros?s=1");
    }

    static async buscarPorCpf(req, res) {
        const cpf = req.params.cpf;
        const passageiro = await Passageiro.findOne({ cpf });
        if (passageiro) {
            res.status(200).json(passageiro);
        } else {
            res.status(404).json({ mensagem: "Passageiro não encontrado." });
        }
    }

    static async detalhar(req, res) {
        const idString = req.params._id;
        let idObject = null;
        if (mongoose.Types.ObjectId.isValid(idString)) {
            idObject = new mongoose.Types.ObjectId(idString);
        }
        const passageiro = await Passageiro.findOne({ _id: idObject });
        res.render("passageiro/detalhe", { passageiro, formatDate });
    }
}

module.exports = PassageiroController;

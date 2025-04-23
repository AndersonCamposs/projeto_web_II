const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Passageiro = Schema({
    nome: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    cpf: { type: String, required: true },
    rg: { type: String, required: false },
    numeroTelefone: { type: String, required: false },
    estado: { type: String, required: true },
    logradouro: { type: String, required: true },
    bairro: { type: String, required: true },
    numeroResidencia: { type: Number, required: true },
});

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Passageiro = Schema({
    nome: { type: String, required: true },
    cpf: { type: String, required: true },
    rg: { type: String, required: false },
    dataNascimento: { type: Date, required: true },
    telefone: { type: String, required: false },
    estado: { type: String, required: true },
    cidade: { type: String, required: true },
    logradouro: { type: String, required: true },
    bairro: { type: String, required: true },
    numeroResidencia: { type: Number, required: true },
});

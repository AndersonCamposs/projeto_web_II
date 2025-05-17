const mongoose = require('mongoose');
const Reserva = require('./Reserva');

const Schema = mongoose.Schema;

const passageiroSchema = Schema(
  {
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
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Passageiro', passageiroSchema);

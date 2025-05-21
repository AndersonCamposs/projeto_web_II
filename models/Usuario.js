const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = Schema(
  {
    cod: { type: String, required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Usuario', usuarioSchema);

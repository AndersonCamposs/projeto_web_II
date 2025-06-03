const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vooSchema = Schema(
  {
    cod: { type: String, required: true },
    paisOrigem: { type: String, required: true },
    estadoOrigem: { type: String, required: true },
    cidadeOrigem: { type: String, required: true },
    paisDestino: { type: String, required: true },
    estadoDestino: { type: String, required: true },
    cidadeDestino: { type: String, required: true },
    data: { type: Date, required: true },
    tipoVoo: {
      type: String,
      enum: ['Nacional', 'Internacional'],
      default: 'Nacional',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

module.exports = mongoose.model('Voo', vooSchema);

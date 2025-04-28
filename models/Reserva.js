const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservaSchema = Schema(
    {
        cod: { type: String, required: true },
        valor: { type: Number, required: true },
        pasageiro: {
            type: mongoose.Types.ObjectId,
            ref: "Passageiro",
        },
        voo: {
            type: mongoose.Types.ObjectId,
            ref: "Voo",
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

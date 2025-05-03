const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

mongoose.connect(
    "mongodb+srv://admin:acs1_admin@cluster0.0sacf0g.mongodb.net/projeto_web_II?retryWrites=true&w=majority&appName=Cluster0"
);

const Aluno = require("./models/Aluno");
const Passageiro = require("./models/Passageiro");
const Voo = require("./models/Voo");
const Reserva = require("./models/Reserva");

const { formatDate, formatHour } = require("./utils/formatterUtils");
const { gerarCodigo } = require("./utils/nanoidUtils");

app.get("/alunos", async (req, res) => {
    const status = req.query.s;
    const lista = await Aluno.find();
    res.render("aluno/relatorio", { lista, status });
});

app.get("/alunos/cadastrar", (req, res) => {
    res.render("aluno/cadastrar");
});

app.get("/alunos/:matricula", async (req, res) => {
    const matricula = Number(req.params.matricula);
    const aluno = await Aluno.findOne({ matricula });
    res.render("aluno/detalhe", { aluno });
});

app.post("/alunos", async (req, res) => {
    const { matricula, nome, curso } = req.body;
    const novoAluno = new Aluno({
        matricula,
        nome,
        curso,
    });
    await novoAluno.save();
    res.redirect("/alunos?s=1");
});

app.get("/", (req, res) => {
    res.render("index");
});

// conteúdos pertinentes ao projeto

// passageiros
app.get("/passageiros", async (req, res) => {
    const s = req.query.s;
    const listaPassageiros = await Passageiro.find();
    res.render("passageiro/relatorio", {
        listaPassageiros,
        s,
        formatDate,
    });
});

app.get("/passageiros/cadastrar", (req, res) => {
    res.render("passageiro/cadastrar");
});

// endpoint para retornar o json do passageiro a partir do cpf
app.get("/passageiros/search/:cpf", async (req, res) => {
    const cpf = req.params.cpf;
    const passageiro = await Passageiro.findOne({ cpf });
    if (passageiro) {
        res.status(200).json(passageiro);
    } else {
        res.status(404).json({ mensagem: "Passageiro não encontrado." });
    }
});

app.get("/passageiros/:_id", async (req, res) => {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
        idObject = new mongoose.Types.ObjectId(idString);
    }
    const passageiro = await Passageiro.findOne({ _id: idObject });
    res.render("passageiro/detalhe", { passageiro, formatDate });
});

app.post("/passageiros", async (req, res) => {
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
});

// voos

app.get("/voos", async (req, res) => {
    const s = req.query.s;
    const listaVoos = await Voo.find();
    res.render("voo/relatorio", { listaVoos, s, formatDate, formatHour });
});

app.get("/voos/cadastrar", async (req, res) => {
    res.render("voo/cadastrar");
});

app.get("/voos/:_id", async (req, res) => {
    const idString = req.params._id;
    let idObject = null;
    if (mongoose.Types.ObjectId.isValid(idString)) {
        idObject = new mongoose.Types.ObjectId(idString);
    }
    const voo = await Voo.findOne({ _id: idObject });
    res.render("voo/detalhe", { voo, formatDate, formatHour });
});

app.post("/voos", async (req, res) => {
    const {
        paisOrigem,
        estadoOrigem,
        cidadeOrigem,
        paisDestino,
        estadoDestino,
        cidadeDestino,
        tipoVoo,
        data,
        hora,
    } = req.body;
    const novoVoo = new Voo({
        cod: await gerarCodigo(5),
        paisOrigem,
        estadoOrigem,
        cidadeOrigem,
        paisDestino,
        estadoDestino,
        cidadeDestino,
        data: `${data}T${hora}Z`,
        tipoVoo,
    });

    await novoVoo.save();

    res.redirect("/voos?s=1");
});

// reservas
app.get("/reservas", async (req, res) => {
    const s = req.query.s;
    const listaReservas = await Reserva.find()
        .populate('passageiro')
        .populate('voo');
    res.render("reserva/relatorio", { listaReservas, s, formatDate});
});

app.get("/reservas/cadastrar", async (req, res) => {
    const listaVoos = await Voo.find({ data: { $gt: new Date() } }); // lista de voos disponíveis
    res.render("reserva/cadastrar", { listaVoos: JSON.stringify(listaVoos) });
});

app.get("/reservas/:cod", async (req, res) => {
    const cod = req.params.cod;
    const reserva = await Reserva.findOne({ cod })
        .populate('passageiro')
        .populate('voo');
    res.render("reserva/detalhe", { reserva, formatDate, formatHour })
})

app.post("/reservas", async (req, res) => {
    const { idVoo, idPassageiro, valorReserva, tipoPagamento } = req.body;
    const novaReserva = new Reserva({ 
        cod: await gerarCodigo(5),
        valor: valorReserva,
        tipoPagamento,
        passageiro: idPassageiro,
        voo: idVoo
    })
    await novaReserva.save();
    res.redirect("/reservas?s=1");
})

app.use((req, res) => {
    res.status(404).render("404");
});

app.listen("5500", () => {
    console.log(
        "Server already be running at port 5500:\nhttp://localhost:5500/"
    );
});

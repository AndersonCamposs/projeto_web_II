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

const { formatDate } = require("./utils/formatterUtils");

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
    console.log(req.body);
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

app.get("/voos/cadastrar", async (req, res) => {
    const responsePaisesLista = await fetch("https://restcountries.com/v3.1/all?fields=name");
    const paisesLista = await responsePaisesLista.json();
    res.render("voo/cadastrar", { paisesLista });
})

app.use((req, res) => {
    res.status(404).render("404");
});

app.listen("5500", () => {
    console.log(
        "Server already be running at port 5500:\nhttp://localhost:5500/"
    );
});

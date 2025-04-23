const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config()

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

mongoose.connect(
    "mongodb+srv://admin:acs1_admin@cluster0.0sacf0g.mongodb.net/projeto_web_II?retryWrites=true&w=majority&appName=Cluster0"
);

const Aluno = require("./models/Aluno");

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
app.get("/passageiros/cadastrar", (req, res) => {
    res.render("passageiro/cadastrar");
});

app.post("/passageiros", async (req, res) => {
    
})

app.use((req, res) => {
    res.status(404).render("404");
});

app.listen("5500", () => {
    console.log(
        "Server already be running at port 5500:\nhttp://localhost:5500/"
    );
});

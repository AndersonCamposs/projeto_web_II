const express = require('express');
const Aluno = require('./Aluno');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



const lista = [];
const aluno1 = new Aluno('LCA1', 'Joao', 'Licenciatura em Computação');
const aluno2 = new Aluno('LCA2', 'Maria', 'Licenciatura em Computação');
const aluno3 = new Aluno('LCA3', 'Pedro', 'Licenciatura em Computação');

lista.push(aluno1, aluno2, aluno3);


app.get('/alunos', (req, res) => {    
    res.render('aluno/relatorio', {lista})
})

app.get('/alunos/:matricula', (req, res) => {    
    const matricula = req.params.matricula;
    const aluno = lista.find((aluno) => aluno.matricula === matricula)
    res.render('aluno/detalhe', {aluno})
})

app.get('/', (req, res) => {
    res.render('index', {aluno1});
})

app.use((req, res) => {
    res.status(404).render('404');
})

app.listen('5500', () => {
    console.log("Server already be running at port 5500:\nhttp://localhost:5500/")
})
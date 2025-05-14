const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

mongoose.connect(
  'mongodb+srv://admin:acs1_admin@cluster0.0sacf0g.mongodb.net/projeto_web_II?retryWrites=true&w=majority&appName=Cluster0',
);

const alunoRoutes = require('./routes/alunoRoutes');
const passageiroRoutes = require('./routes/passageiroRoutes');
const vooRoutes = require('./routes/vooRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const { formatDate, formatHour } = require('./utils/formatterUtils');
const { gerarCodigo } = require('./utils/nanoidUtils');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/alunos', alunoRoutes);
app.use('/passageiros', passageiroRoutes);
app.use('/voos', vooRoutes);
app.use('/reservas', reservaRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen('5500', () => {
  console.log('Server already be running at port 5500:\nhttp://localhost:5500/');
});

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();
const authGuard = require('./middlewares/authGuard');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(
  session({
    secret: 'aXiY09_pO1@_lja',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

mongoose.connect(
  'mongodb+srv://admin:acs1_admin@cluster0.0sacf0g.mongodb.net/projeto_web_II?retryWrites=true&w=majority&appName=Cluster0',
);

app.use(authGuard);

const passageiroRoutes = require('./routes/passageiroRoutes');
const vooRoutes = require('./routes/vooRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/passageiros', passageiroRoutes);
app.use('/voos', vooRoutes);
app.use('/reservas', reservaRoutes);
app.use('/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen('5500', () => {
  console.log('Server already be running at port 5500:\nhttp://localhost:5500/');
});

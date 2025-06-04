require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
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
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  }),
);

mongoose.connect(process.env.MONGO_URI);

app.use(authGuard);

const passageiroRoutes = require('./routes/passageiroRoutes');
const vooRoutes = require('./routes/vooRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.get('/', (req, res) => {
  res.render('index', { usuario: req.session.usuario });
});

app.use('/passageiros', passageiroRoutes);
app.use('/voos', vooRoutes);
app.use('/reservas', reservaRoutes);
app.use('/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(process.env.PORT, () => {
  console.log('Server already be running at port 5500:\nhttp://localhost:5500/');
});

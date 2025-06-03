const rotasPublicas = ['/usuarios/login', '/usuarios/cadastrar'];

function authGuard(req, res, next) {
  if (req.session.usuario || rotasPublicas.includes(req.path) || (req.path === '/usuarios' && req.method === 'POST')) {
    next();
  } else {
    res.redirect('/usuarios/login');
  }
}

module.exports = authGuard;

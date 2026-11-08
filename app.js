const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const auth = require('./middlewares/auth');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const RUTAS_PUBLICAS = ['/login', '/registro'];

app.use(auth.cargarSesion);
app.use(RUTAS_PUBLICAS, auth.soloHuespedes);

app.use(function (req, res, next) {
  if (RUTAS_PUBLICAS.indexOf(req.path) !== -1) return next();
  auth.soloUsuarios(req, res, next);
});

app.locals.formatoPrecio = function (valor) {
  return '$' + Number(valor).toLocaleString('es-CO');
};

app.use('/', require('./routes/home'));
app.use('/products', require('./routes/products'));
app.use('/carrito', require('./routes/carrito'));
app.use('/perfil', require('./routes/perfil'));
app.use('/', require('./routes/auth'));

app.listen(3000, function () {
  console.log('Star Coffee corriendo en http://localhost:3000');
});

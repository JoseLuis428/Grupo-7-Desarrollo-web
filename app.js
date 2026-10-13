/*
  Star Coffee - Node.js + Express + EJS
  Estructura (MVC):
    routes/       -> definen qué URL llama a qué función
    controllers/  -> contienen la lógica de cada ruta
    models/       -> leen y escriben los archivos JSON de data/
    views/        -> páginas EJS
*/
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { sesion } = require('./models/estado');
const app = express();

// ---------- Configuración ----------
app.set('view engine', 'ejs');                    // usamos EJS como motor de templates
app.set('views', path.join(__dirname, 'views'));  // carpeta donde están las vistas
app.use(express.static(path.join(__dirname, 'public'))); // css, imágenes...
app.use(express.urlencoded({ extended: true }));  // para leer los datos de los formularios
app.use(methodOverride('_method'));               // permite PUT y DELETE: action="...?_method=PUT"

// ---------- Control de sesión (simple, en memoria) ----------
const RUTAS_PUBLICAS = ['/login', '/registro'];   // páginas SIN iniciar sesión

app.use(function (req, res, next) {               // sin sesión, todo lleva al login
  if (sesion.iniciada || RUTAS_PUBLICAS.indexOf(req.path) !== -1) return next();
  res.redirect('/login');
});

// Función para mostrar precios como $6.000 (se puede usar en todas las vistas)
app.locals.formatoPrecio = function (valor) {
  return '$' + Number(valor).toLocaleString('es-CO');
};

// ---------- Rutas (cada una usa su controller) ----------
app.use('/', require('./routes/home'));               // /
app.use('/products', require('./routes/products'));   // CRUD de productos
app.use('/carrito', require('./routes/carrito'));     // /carrito...
app.use('/', require('./routes/auth'));               // /login, /registro y /salir

// ---------- Iniciar el servidor ----------
app.listen(3000, function () {
  console.log('Star Coffee corriendo en http://localhost:3000');
});

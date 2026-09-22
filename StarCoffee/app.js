const express = require('express');
const path = require('path');
const app = express();

// ---------- Configuración ----------
app.set('view engine', 'ejs');                    // usamos EJS como motor de templates
app.set('views', path.join(__dirname, 'views'));  // carpeta donde están las vistas
app.use(express.static(path.join(__dirname, 'public'))); // css, imágenes...
app.use(express.urlencoded({ extended: true }));  // para leer los datos de los formularios

// ---------- Control de sesión (simple, en memoria) ----------
let sesionIniciada = false;

// Páginas a las que se puede entrar SIN haber iniciado sesión
const RUTAS_PUBLICAS = ['/login', '/registro'];

// Si no hay sesión, cualquier página lleva al login
app.use(function (req, res, next) {
  if (sesionIniciada || RUTAS_PUBLICAS.indexOf(req.path) !== -1) {
    return next();
  }
  res.redirect('/login');
});

// Función para mostrar precios como $6.000 (se puede usar en todas las vistas)
app.locals.formatoPrecio = function (valor) {
  return '$' + Number(valor).toLocaleString('es-CO');
};

// ---------- Datos (se guardan en memoria: si reinicias el servidor vuelven a los iniciales) ----------
const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600';

let productos = [
  { id: 1, nombre: 'Café Americano', descripcion: 'Café 100% colombiano, suave y balanceado, perfecto para cualquier momento del día.', precio: 6000, categoria: 'cafes', seccion: 'vendido', imagen: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600' },
  { id: 2, nombre: 'Capuchino', descripcion: 'Café con leche espumosa y un toque de sabor.', precio: 6000, categoria: 'cafes', seccion: 'recomendado', imagen: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600' },
  { id: 3, nombre: 'Café Espresso', descripcion: 'Café concentrado de sabor intenso y aroma profundo.', precio: 5000, categoria: 'cafes', seccion: 'vendido', imagen: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600' },
  { id: 4, nombre: 'Latte', descripcion: 'Espresso con abundante leche vaporizada, suave y cremoso.', precio: 7000, categoria: 'cafes', seccion: 'vendido', imagen: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600' },
  { id: 5, nombre: 'Café Colombiano', descripcion: 'Café de origen colombiano con notas achocolatadas.', precio: 6500, categoria: 'cafes', seccion: 'recomendado', imagen: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600' },
  { id: 6, nombre: 'Torta de Chocolate', descripcion: 'Fresas y chocolate.', precio: 9500, categoria: 'reposteria', seccion: 'recomendado', imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
  { id: 7, nombre: 'Sándwich Mixto', descripcion: 'Sabores inolvidables.', precio: 16500, categoria: 'alimentos', seccion: 'recomendado', imagen: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600' },
  { id: 8, nombre: 'Croissant de Almendras', descripcion: 'Clásico y cremoso.', precio: 7900, categoria: 'reposteria', seccion: 'vendido', imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600' },
  { id: 9, nombre: 'Brownie de Chocolate', descripcion: 'Cremoso y jugoso.', precio: 8900, categoria: 'reposteria', seccion: '', imagen: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600' },
  { id: 10, nombre: 'Frappé de Fresa', descripcion: 'Con chips explosivos.', precio: 11900, categoria: 'frias', seccion: '', imagen: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600' }
];
let siguienteId = 11;   // id que tendrá el próximo producto que se cree

let carrito = [];      // cada item es { id: 1, cantidad: 2 }
const ENVIO = 5000;


// =====================================================
//  HOME
// =====================================================

app.get('/', function (req, res) {
  res.render('home/home', {
    titulo: 'Inicio',
    recomendados: productos.filter(function (p) { return p.seccion === 'recomendado'; }),
    masVendidos: productos.filter(function (p) { return p.seccion === 'vendido'; }),
    nuevos: productos.slice(-4)   // los 4 últimos productos agregados
  });
});


// =====================================================
//  PRODUCTOS
// =====================================================

// Lista de productos (si viene ?categoria=cafes solo muestra esa categoría)
app.get('/productos', function (req, res) {
  let lista = productos;
  if (req.query.categoria) {
    lista = productos.filter(function (p) { return p.categoria === req.query.categoria; });
  }
  res.render('productos/lista', { titulo: 'Productos', productos: lista });
});

// Formulario para CREAR (va antes de '/productos/:id' para que "nuevo" no se tome como un id)
app.get('/productos/nuevo', function (req, res) {
  res.render('productos/nuevo', {
    titulo: 'Nuevo producto',
    error: null,
    producto: { nombre: '', descripcion: '', precio: '', imagen: '' }
  });
});

// Guardar el producto nuevo
app.post('/productos', function (req, res) {
  const { nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || !descripcion || !precio || Number(precio) <= 0) {
    return res.render('productos/nuevo', {
      titulo: 'Nuevo producto',
      error: 'Completa todos los campos. El precio debe ser mayor a 0.',
      producto: req.body
    });
  }

  productos.push({
    id: siguienteId++,
    nombre: nombre,
    descripcion: descripcion,
    precio: Number(precio),
    imagen: imagen || IMAGEN_POR_DEFECTO
  });
  res.redirect('/productos');
});

// Detalle de un producto
app.get('/productos/:id', function (req, res) {
  const producto = productos.find(function (p) { return p.id === Number(req.params.id); });
  if (!producto) return res.status(404).send('Producto no encontrado');

  // otros productos para la sección "Recomendaciones para ti"
  const relacionados = productos
    .filter(function (p) { return p.id !== producto.id; })
    .slice(0, 3);

  res.render('productos/detalle', {
    titulo: producto.nombre,
    producto: producto,
    relacionados: relacionados
  });
});

// Formulario para EDITAR
app.get('/productos/:id/editar', function (req, res) {
  const producto = productos.find(function (p) { return p.id === Number(req.params.id); });
  if (!producto) return res.status(404).send('Producto no encontrado');

  res.render('productos/editar', { titulo: 'Editar producto', error: null, producto: producto });
});

// Guardar los cambios
app.post('/productos/:id/editar', function (req, res) {
  const producto = productos.find(function (p) { return p.id === Number(req.params.id); });
  if (!producto) return res.status(404).send('Producto no encontrado');

  const { nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || !descripcion || !precio || Number(precio) <= 0) {
    return res.render('productos/editar', {
      titulo: 'Editar producto',
      error: 'Completa todos los campos. El precio debe ser mayor a 0.',
      producto: { id: producto.id, nombre: nombre, descripcion: descripcion, precio: precio, imagen: imagen }
    });
  }

  producto.nombre = nombre;
  producto.descripcion = descripcion;
  producto.precio = Number(precio);
  producto.imagen = imagen || IMAGEN_POR_DEFECTO;
  res.redirect('/productos/' + producto.id);
});


// =====================================================
//  CARRITO
// =====================================================

app.get('/carrito', function (req, res) {
  const items = [];
  let subtotal = 0;
  let totalArticulos = 0;

  carrito.forEach(function (c) {
    const p = productos.find(function (prod) { return prod.id === c.id; });
    if (p) {
      items.push({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        imagen: p.imagen,
        precio: p.precio,
        cantidad: c.cantidad,
        tamano: c.tamano,
        subtotal: p.precio * c.cantidad
      });
      subtotal += p.precio * c.cantidad;
      totalArticulos += c.cantidad;
    }
  });

  // productos que NO están en el carrito, para "Recomendaciones para ti"
  const recomendaciones = productos
    .filter(function (p) { return !carrito.some(function (c) { return c.id === p.id; }); })
    .slice(0, 3);

  const envio = items.length > 0 ? ENVIO : 0;

  res.render('carrito/carrito', {
    titulo: 'Carrito',
    items: items,
    totalArticulos: totalArticulos,
    subtotal: subtotal,
    envio: envio,
    total: subtotal + envio,
    recomendaciones: recomendaciones
  });
});

app.post('/carrito/agregar/:id', function (req, res) {
  const id = Number(req.params.id);
  const cantidad = Math.max(1, Number(req.body.cantidad) || 1);
  const tamano = req.body.tamano || 'Mediano';

  const item = carrito.find(function (c) { return c.id === id; });

  if (item) {
    item.cantidad += cantidad;
    item.tamano = tamano;
  } else {
    carrito.push({ id: id, cantidad: cantidad, tamano: tamano });
  }
  res.redirect('/carrito');
});

// Botones - y + del carrito
app.post('/carrito/cantidad/:id', function (req, res) {
  const id = Number(req.params.id);
  const item = carrito.find(function (c) { return c.id === id; });

  if (item) {
    if (req.body.accion === 'sumar') item.cantidad++;
    if (req.body.accion === 'restar') item.cantidad--;
    if (item.cantidad < 1) item.cantidad = 1;
  }
  res.redirect('/carrito');
});

app.post('/carrito/quitar/:id', function (req, res) {
  const id = Number(req.params.id);
  carrito = carrito.filter(function (c) { return c.id !== id; });
  res.redirect('/carrito');
});


// =====================================================
//  LOGIN Y REGISTRO
// =====================================================

app.get('/login', function (req, res) {
  res.render('auth/login', { titulo: 'Inicio de sesión', error: null });
});

app.post('/login', function (req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !correo.includes('@')) {
    return res.render('auth/login', { titulo: 'Inicio de sesión', error: 'Ingresa un correo válido' });
  }
  if (!contrasena || contrasena.length < 6) {
    return res.render('auth/login', { titulo: 'Inicio de sesión', error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  sesionIniciada = true;
  res.redirect('/');
});

app.get('/registro', function (req, res) {
  res.render('auth/registro', { titulo: 'Registro', error: null });
});

app.post('/registro', function (req, res) {
  const { nombre, apellidos, correo, contrasena, confirmar } = req.body;

  let error = null;
  if (!nombre || !apellidos) error = 'Completa tu nombre y apellidos';
  else if (!correo || !correo.includes('@')) error = 'Ingresa un correo válido';
  else if (!contrasena || contrasena.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
  else if (contrasena !== confirmar) error = 'Las contraseñas no coinciden';

  if (error) {
    return res.render('auth/registro', { titulo: 'Registro', error: error });
  }

  sesionIniciada = true;
  res.redirect('/');
});


app.get('/salir', function (req, res) {
  sesionIniciada = false;
  res.redirect('/login');
});


// ---------- Iniciar el servidor ----------
app.listen(3000, function () {
  console.log('Star Coffee corriendo en http://localhost:3000');
});

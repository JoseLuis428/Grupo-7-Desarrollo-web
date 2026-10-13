const productModel = require('../models/productModel');
const { estado, ENVIO } = require('../models/estado');

exports.ver = function (req, res) {
  const productos = productModel.all();
  const items = [];
  let subtotal = 0;
  let totalArticulos = 0;

  estado.carrito.forEach(function (c) {
    const p = productos.find(function (prod) { return prod.id === c.id; });
    if (p) {
      items.push({
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.image,
        price: p.price,
        cantidad: c.cantidad,
        tamano: c.tamano,
        subtotal: p.price * c.cantidad
      });
      subtotal += p.price * c.cantidad;
      totalArticulos += c.cantidad;
    }
  });

  const recomendaciones = productos
    .filter(function (p) { return !estado.carrito.some(function (c) { return c.id === p.id; }); })
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
};

exports.agregar = function (req, res) {
  const id = Number(req.params.id);
  const cantidad = Math.max(1, Number(req.body.cantidad) || 1);
  const tamano = req.body.tamano || 'Mediano';

  const item = estado.carrito.find(function (c) { return c.id === id; });

  if (item) {
    item.cantidad += cantidad;
    item.tamano = tamano;
  } else {
    estado.carrito.push({ id: id, cantidad: cantidad, tamano: tamano });
  }
  res.redirect('/carrito');
};

// Botones - y + del carrito
exports.cantidad = function (req, res) {
  const id = Number(req.params.id);
  const item = estado.carrito.find(function (c) { return c.id === id; });

  if (item) {
    if (req.body.accion === 'sumar') item.cantidad++;
    if (req.body.accion === 'restar') item.cantidad--;
    if (item.cantidad < 1) item.cantidad = 1;
  }
  res.redirect('/carrito');
};

exports.quitar = function (req, res) {
  const id = Number(req.params.id);
  estado.carrito = estado.carrito.filter(function (c) { return c.id !== id; });
  res.redirect('/carrito');
};

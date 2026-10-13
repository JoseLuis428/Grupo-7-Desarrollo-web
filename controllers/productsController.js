const productModel = require('../models/productModel');
const { estado } = require('../models/estado');

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600';
const TAMANOS = ['Pequeño', 'Mediano', 'Grande'];
const MENSAJE_ERROR = 'Completa todos los campos. El precio debe ser mayor a 0.';

function armarProducto(body) {
  const sizes = String(body.sizes || '').split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
  return {
    name: body.name,
    description: body.description,
    image: body.image || IMAGEN_POR_DEFECTO,
    category: body.category,
    sizes: sizes.length ? sizes : TAMANOS,
    price: Number(body.price)
  };
}

function esValido(b) {
  return b.name && b.description && b.category && b.price && Number(b.price) > 0;
}

exports.index = function (req, res) {
  let lista = productModel.all();
  if (req.query.category) {
    lista = lista.filter(function (p) { return p.category === req.query.category; });
  }
  res.render('products/index', { titulo: 'Productos', productos: lista });
};

exports.create = function (req, res) {
  res.render('products/create', {
    titulo: 'Nuevo producto',
    error: null,
    producto: { name: '', description: '', price: '', image: '', category: 'cafes', sizes: '' }
  });
};

exports.store = function (req, res) {
  if (!esValido(req.body)) {
    return res.render('products/create', { titulo: 'Nuevo producto', error: MENSAJE_ERROR, producto: req.body });
  }
  productModel.create(armarProducto(req.body));
  res.redirect('/products');
};

exports.show = function (req, res) {
  const producto = productModel.findById(req.params.id);
  if (!producto) return res.status(404).send('Producto no encontrado');

  const relacionados = productModel.all()
    .filter(function (p) { return p.id !== producto.id; })
    .slice(0, 3);

  res.render('products/show', { titulo: producto.name, producto: producto, relacionados: relacionados });
};

exports.edit = function (req, res) {
  const producto = productModel.findById(req.params.id);
  if (!producto) return res.status(404).send('Producto no encontrado');

  res.render('products/edit', { titulo: 'Editar producto', error: null, producto: producto });
};

exports.update = function (req, res) {
  const producto = productModel.findById(req.params.id);
  if (!producto) return res.status(404).send('Producto no encontrado');

  if (!esValido(req.body)) {
    return res.render('products/edit', {
      titulo: 'Editar producto',
      error: MENSAJE_ERROR,
      producto: Object.assign({}, req.body, { id: producto.id })
    });
  }
  productModel.update(producto.id, armarProducto(req.body));
  res.redirect('/products/' + producto.id);
};

exports.destroy = function (req, res) {
  if (!productModel.remove(req.params.id)) return res.status(404).send('Producto no encontrado');

  estado.carrito = estado.carrito.filter(function (c) { return c.id !== Number(req.params.id); });
  res.redirect('/products');
};

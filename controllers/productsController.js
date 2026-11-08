const productModel = require('../models/productModel');
const { estado } = require('../models/estado');

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600';
const TAMANOS = ['Pequeño', 'Mediano', 'Grande'];
const MENSAJE_ERROR = 'Completa todos los campos. El precio debe ser mayor a 0 y el nombre no puede superar los 100 caracteres.';

function armarProducto(body) {
  const sizes = String(body.sizes || '').split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
  return {
    name: String(body.name).trim(),
    description: String(body.description).trim(),
    image: body.image || IMAGEN_POR_DEFECTO,
    category: body.category,
    sizes: sizes.length ? sizes : TAMANOS,
    price: Math.round(Number(body.price))
  };
}

function esValido(b) {
  return b.name && b.description && b.category && b.price
    && Number(b.price) > 0 && Number(b.price) <= 1000000000
    && String(b.name).trim().length <= 100;
}

exports.index = async function (req, res) {
  const categoria = req.query.category ? String(req.query.category) : '';
  const busqueda = req.query.q ? String(req.query.q).trim() : '';
  const lista = await productModel.all({ category: categoria, q: busqueda });
  res.render('products/index', { titulo: 'Productos', productos: lista, busqueda: busqueda, categoria: categoria });
};

exports.create = function (req, res) {
  res.render('products/create', {
    titulo: 'Nuevo producto',
    error: null,
    producto: { name: '', description: '', price: '', image: '', category: 'cafes', sizes: '' }
  });
};

exports.store = async function (req, res) {
  if (!esValido(req.body)) {
    return res.render('products/create', { titulo: 'Nuevo producto', error: MENSAJE_ERROR, producto: req.body });
  }
  await productModel.create(armarProducto(req.body));
  res.redirect('/products');
};

exports.show = async function (req, res) {
  const producto = await productModel.findById(req.params.id);
  if (!producto) return res.status(404).send('Producto no encontrado');

  const todos = await productModel.all();
  const relacionados = todos
    .filter(function (p) { return p.id !== producto.id; })
    .slice(0, 3);

  res.render('products/show', { titulo: producto.name, producto: producto, relacionados: relacionados });
};

exports.edit = async function (req, res) {
  const producto = await productModel.findById(req.params.id);
  if (!producto) return res.status(404).send('Producto no encontrado');

  res.render('products/edit', { titulo: 'Editar producto', error: null, producto: producto });
};

exports.update = async function (req, res) {
  const producto = await productModel.findById(req.params.id);
  if (!producto) return res.status(404).send('Producto no encontrado');

  if (!esValido(req.body)) {
    return res.render('products/edit', {
      titulo: 'Editar producto',
      error: MENSAJE_ERROR,
      producto: Object.assign({}, req.body, { id: producto.id })
    });
  }
  await productModel.update(producto.id, armarProducto(req.body));
  res.redirect('/products/' + producto.id);
};

exports.destroy = async function (req, res) {
  if (!(await productModel.remove(req.params.id))) return res.status(404).send('Producto no encontrado');

  estado.carrito = estado.carrito.filter(function (c) { return c.id !== Number(req.params.id); });
  res.redirect('/products');
};

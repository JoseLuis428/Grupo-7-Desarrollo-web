const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const productModel = require('../models/productModel');
const subirArchivo = require('../middlewares/subirArchivo');
const { estado } = require('../models/estado');

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600';
const TAMANOS = ['Pequeño', 'Mediano', 'Grande'];
const RUTA_IMAGENES = '/uploads/productos/';
const CARPETA_IMAGENES = path.join(__dirname, '..', 'public', 'uploads', 'productos');

// Si no se subió una imagen nueva se conserva la actual (o la imagen por defecto al crear)
function armarProducto(req, imagenActual) {
  const body = req.body;
  const sizes = String(body.sizes || '').split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
  return {
    name: body.name,
    description: body.description,
    image: req.file ? RUTA_IMAGENES + req.file.filename : (imagenActual || IMAGEN_POR_DEFECTO),
    category: body.category,
    sizes: sizes.length ? sizes : TAMANOS,
    price: Number(body.price)
  };
}

// Solo se borran las imágenes que subimos nosotros, no las que son una URL externa
function borrarImagenSubida(imagen) {
  if (!imagen || imagen.indexOf(RUTA_IMAGENES) !== 0) return;
  fs.unlink(path.join(CARPETA_IMAGENES, path.basename(imagen)), function () {});
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
    errores: {},
    producto: { name: '', description: '', price: '', image: '', category: 'cafes', sizes: '' }
  });
};

exports.store = async function (req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    subirArchivo.descartar(req);
    return res.render('products/create', { titulo: 'Nuevo producto', errores: errores.mapped(), producto: req.body });
  }
  await productModel.create(armarProducto(req));
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

  res.render('products/edit', { titulo: 'Editar producto', errores: {}, producto: producto });
};

exports.update = async function (req, res) {
  const producto = await productModel.findById(req.params.id);
  if (!producto) {
    subirArchivo.descartar(req);
    return res.status(404).send('Producto no encontrado');
  }

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    subirArchivo.descartar(req);
    return res.render('products/edit', {
      titulo: 'Editar producto',
      errores: errores.mapped(),
      producto: Object.assign({}, req.body, { id: producto.id, image: producto.image })
    });
  }

  await productModel.update(producto.id, armarProducto(req, producto.image));
  if (req.file) borrarImagenSubida(producto.image);
  res.redirect('/products/' + producto.id);
};

exports.destroy = async function (req, res) {
  const producto = await productModel.findById(req.params.id);
  if (!producto || !(await productModel.remove(producto.id))) return res.status(404).send('Producto no encontrado');

  borrarImagenSubida(producto.image);
  estado.carrito = estado.carrito.filter(function (c) { return c.id !== producto.id; });
  res.redirect('/products');
};

const productModel = require('../models/productModel');

exports.inicio = async function (req, res) {
  const productos = await productModel.all();
  res.render('home/home', {
    titulo: 'Inicio',
    recomendados: productos.filter(function (p) { return p.section === 'recomendado'; }),
    masVendidos: productos.filter(function (p) { return p.section === 'vendido'; }),
    nuevos: productos.slice(-4)
  });
};

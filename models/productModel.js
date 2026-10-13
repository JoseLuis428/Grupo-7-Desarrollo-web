const fs = require('fs');
const path = require('path');
const archivo = path.join(__dirname, '..', 'data', 'products.json');

function leer() { return JSON.parse(fs.readFileSync(archivo, 'utf-8')); }
function guardar(lista) { fs.writeFileSync(archivo, JSON.stringify(lista, null, 2) + '\n'); }

exports.all = leer;

exports.findById = function (id) {
  return leer().find(function (p) { return p.id === Number(id); });
};

exports.create = function (datos) {
  const lista = leer();
  const id = lista.reduce(function (max, p) { return Math.max(max, p.id); }, 0) + 1;
  const nuevo = Object.assign({ id: id, section: '' }, datos);
  lista.push(nuevo);
  guardar(lista);
  return nuevo;
};

exports.update = function (id, datos) {
  const lista = leer();
  const producto = lista.find(function (p) { return p.id === Number(id); });
  if (!producto) return null;
  Object.assign(producto, datos);
  guardar(lista);
  return producto;
};

exports.remove = function (id) {
  const lista = leer();
  const resto = lista.filter(function (p) { return p.id !== Number(id); });
  guardar(resto);
  return resto.length < lista.length;   // true si realmente se borró
};

const fs = require('fs');
const path = require('path');
const archivo = path.join(__dirname, '..', 'data', 'users.json');

function leer() { return JSON.parse(fs.readFileSync(archivo, 'utf-8')); }

exports.findByEmail = function (email) {
  const buscado = String(email).trim().toLowerCase();
  return leer().find(function (u) { return u.email.toLowerCase() === buscado; });
};

exports.create = function (datos) {
  const lista = leer();
  const id = lista.reduce(function (max, u) { return Math.max(max, u.id); }, 0) + 1;
  const nuevo = Object.assign({ id: id }, datos);
  lista.push(nuevo);
  fs.writeFileSync(archivo, JSON.stringify(lista, null, 2) + '\n');
  return nuevo;
};

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

const crypto = require('crypto');

exports.findById = function (id) {
  return leer().find(function (u) { return u.id === Number(id); });
};

exports.sinPassword = function (usuario) {
  const copia = Object.assign({}, usuario);
  delete copia.password;
  return copia;
};

exports.hashPassword = function (contrasena) {
  const sal = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(contrasena, sal, 64).toString('hex');
  return 'scrypt$' + sal + '$' + hash;
};

exports.verificarPassword = function (usuario, contrasena) {
  const guardada = String(usuario.password || '');
  if (guardada.indexOf('scrypt$') !== 0) return guardada === contrasena;
  const partes = guardada.split('$');
  const hash = crypto.scryptSync(contrasena, partes[1], 64);
  const esperado = Buffer.from(partes[2], 'hex');
  return esperado.length === hash.length && crypto.timingSafeEqual(esperado, hash);
};

exports.update = function (id, cambios) {
  const lista = leer();
  const i = lista.findIndex(function (u) { return u.id === Number(id); });
  if (i < 0) return null;
  lista[i] = Object.assign({}, lista[i], cambios);
  fs.writeFileSync(archivo, JSON.stringify(lista, null, 2) + '\n');
  return lista[i];
};

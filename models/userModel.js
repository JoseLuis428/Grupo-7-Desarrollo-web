const crypto = require('crypto');
const db = require('../database/models');

exports.findByEmail = function (email) {
  return db.User.findOne({ where: { email: String(email).trim().toLowerCase() } });
};

exports.findById = function (id) {
  return db.User.findByPk(Number(id));
};

exports.create = function (datos) {
  return db.User.create(datos);
};

exports.update = async function (id, cambios) {
  const usuario = await db.User.findByPk(Number(id));
  if (!usuario) return null;
  return usuario.update(cambios);
};

exports.sinPassword = function (usuario) {
  const copia = Object.assign({}, typeof usuario.get === 'function' ? usuario.get({ plain: true }) : usuario);
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

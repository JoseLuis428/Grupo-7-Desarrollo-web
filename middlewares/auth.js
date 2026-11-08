const crypto = require('crypto');
const userModel = require('../models/userModel');

const SECRETO = process.env.SESSION_SECRET || 'star-coffee-secreto-cambiar-en-produccion';
const DIAS_RECORDAR = 30;
const sesiones = new Map();

function leerCookies(req) {
  const cookies = {};
  String(req.headers.cookie || '').split(';').forEach(function (par) {
    const i = par.indexOf('=');
    if (i < 0) return;
    const nombre = par.slice(0, i).trim();
    try { cookies[nombre] = decodeURIComponent(par.slice(i + 1).trim()); } catch (e) { }
  });
  return cookies;
}

function poner(res, nombre, valor, maxAgeSeg) {
  let c = nombre + '=' + encodeURIComponent(valor) + '; Path=/; HttpOnly; SameSite=Lax';
  if (maxAgeSeg) c += '; Max-Age=' + maxAgeSeg;
  res.append('Set-Cookie', c);
}

function borrar(res, nombre) {
  res.append('Set-Cookie', nombre + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

function firmar(texto) {
  return crypto.createHmac('sha256', SECRETO).update(texto).digest('hex');
}

function crearTokenRecordar(usuarioId) {
  const vence = Date.now() + DIAS_RECORDAR * 24 * 60 * 60 * 1000;
  const base = usuarioId + '.' + vence;
  return base + '.' + firmar(base);
}

function leerTokenRecordar(token) {
  const partes = String(token || '').split('.');
  if (partes.length !== 3) return null;
  const base = partes[0] + '.' + partes[1];
  const esperado = Buffer.from(firmar(base));
  const recibido = Buffer.from(partes[2]);
  if (esperado.length !== recibido.length || !crypto.timingSafeEqual(esperado, recibido)) return null;
  if (Number(partes[1]) < Date.now()) return null;
  return Number(partes[0]);
}

exports.cargarSesion = async function (req, res, next) {
  const cookies = leerCookies(req);
  let usuarioId = null;

  if (cookies.sid && sesiones.has(cookies.sid)) {
    usuarioId = sesiones.get(cookies.sid).usuarioId;
  } else if (cookies.recordar) {
    usuarioId = leerTokenRecordar(cookies.recordar);
    if (usuarioId) {
      const sid = crypto.randomBytes(24).toString('hex');
      sesiones.set(sid, { usuarioId: usuarioId });
      poner(res, 'sid', sid);
    }
  }

  const usuario = usuarioId ? await userModel.findById(usuarioId) : null;
  req.usuario = usuario || null;
  res.locals.usuario = usuario ? userModel.sinPassword(usuario) : null;
  next();
};

exports.soloUsuarios = function (req, res, next) {
  if (req.usuario) return next();
  res.redirect('/login');
};

exports.soloHuespedes = function (req, res, next) {
  if (!req.usuario) return next();
  res.redirect('/');
};

exports.iniciarSesion = function (req, res, usuario, recordar) {
  const sid = crypto.randomBytes(24).toString('hex');
  sesiones.set(sid, { usuarioId: usuario.id });
  poner(res, 'sid', sid);
  if (recordar) poner(res, 'recordar', crearTokenRecordar(usuario.id), DIAS_RECORDAR * 24 * 60 * 60);
};

exports.cerrarSesion = function (req, res) {
  const cookies = leerCookies(req);
  if (cookies.sid) sesiones.delete(cookies.sid);
  borrar(res, 'sid');
  borrar(res, 'recordar');
};

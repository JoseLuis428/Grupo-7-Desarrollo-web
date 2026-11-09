const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const auth = require('../middlewares/auth');
const subirArchivo = require('../middlewares/subirArchivo');

exports.verLogin = function (req, res) {
  res.render('auth/login', { titulo: 'Inicio de sesión', errores: {}, viejo: {} });
};

exports.login = async function (req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render('auth/login', { titulo: 'Inicio de sesión', errores: errores.mapped(), viejo: req.body });
  }

  // req.usuarioLogin lo dejó la validación del correo
  auth.iniciarSesion(req, res, req.usuarioLogin, req.body.recordar === 'on');
  res.redirect('/');
};

exports.verRegistro = function (req, res) {
  res.render('auth/registro', { titulo: 'Registro', errores: {}, viejo: {} });
};

exports.registro = async function (req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    subirArchivo.descartar(req);
    return res.render('auth/registro', { titulo: 'Registro', errores: errores.mapped(), viejo: req.body });
  }

  let nuevo;
  try {
    nuevo = await userModel.create({
      firstName: req.body.nombre,
      lastName: req.body.apellidos,
      email: req.body.correo.toLowerCase(),
      password: userModel.hashPassword(req.body.contrasena),
      photo: req.file ? req.file.filename : null,
      category: 'customer'
    });
  } catch (err) {
    subirArchivo.descartar(req);
    // dos personas registrando el mismo correo al mismo tiempo: la base de datos lo frena
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.render('auth/registro', {
        titulo: 'Registro',
        errores: { correo: { msg: 'Ese correo ya está registrado' } },
        viejo: req.body
      });
    }
    throw err;
  }

  auth.iniciarSesion(req, res, nuevo, false);
  res.redirect('/');
};

exports.salir = function (req, res) {
  auth.cerrarSesion(req, res);
  res.redirect('/login');
};

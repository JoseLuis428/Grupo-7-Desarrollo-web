const userModel = require('../models/userModel');
const auth = require('../middlewares/auth');

exports.verLogin = function (req, res) {
  res.render('auth/login', { titulo: 'Inicio de sesión', error: null });
};

exports.login = async function (req, res) {
  const { correo, contrasena, recordar } = req.body;

  let error = null;
  if (!correo || !correo.includes('@')) error = 'Ingresa un correo válido';
  else if (!contrasena || contrasena.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';

  const usuario = error ? null : await userModel.findByEmail(correo);
  if (!error && (!usuario || !userModel.verificarPassword(usuario, contrasena))) error = 'Correo o contraseña incorrectos';

  if (error) {
    return res.render('auth/login', { titulo: 'Inicio de sesión', error: error });
  }

  auth.iniciarSesion(req, res, usuario, recordar === 'on');
  res.redirect('/');
};

exports.verRegistro = function (req, res) {
  res.render('auth/registro', { titulo: 'Registro', error: null });
};

exports.registro = async function (req, res) {
  const { nombre, apellidos, correo, contrasena, confirmar } = req.body;

  let error = null;
  if (!nombre || !apellidos) error = 'Completa tu nombre y apellidos';
  else if (!correo || !correo.includes('@')) error = 'Ingresa un correo válido';
  else if (!contrasena || contrasena.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
  else if (contrasena !== confirmar) error = 'Las contraseñas no coinciden';
  else if (await userModel.findByEmail(correo)) error = 'Ese correo ya está registrado';

  if (error) {
    return res.render('auth/registro', { titulo: 'Registro', error: error });
  }

  const nuevo = await userModel.create({
    firstName: nombre,
    lastName: apellidos,
    email: correo.trim().toLowerCase(),
    password: userModel.hashPassword(contrasena),
    category: 'customer'
  });
  auth.iniciarSesion(req, res, nuevo, false);
  res.redirect('/');
};

exports.salir = function (req, res) {
  auth.cerrarSesion(req, res);
  res.redirect('/login');
};

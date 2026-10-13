const userModel = require('../models/userModel');
const { sesion } = require('../models/estado');

exports.verLogin = function (req, res) {
  res.render('auth/login', { titulo: 'Inicio de sesión', error: null });
};

exports.login = function (req, res) {
  const { correo, contrasena } = req.body;

  let error = null;
  if (!correo || !correo.includes('@')) error = 'Ingresa un correo válido';
  else if (!contrasena || contrasena.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';

  // el usuario tiene que existir en users.json y la contraseña debe coincidir
  const usuario = error ? null : userModel.findByEmail(correo);
  if (!error && (!usuario || usuario.password !== contrasena)) error = 'Correo o contraseña incorrectos';

  if (error) {
    return res.render('auth/login', { titulo: 'Inicio de sesión', error: error });
  }

  sesion.iniciada = true;
  sesion.usuario = usuario;
  res.redirect('/');
};

exports.verRegistro = function (req, res) {
  res.render('auth/registro', { titulo: 'Registro', error: null });
};

exports.registro = function (req, res) {
  const { nombre, apellidos, correo, contrasena, confirmar } = req.body;

  let error = null;
  if (!nombre || !apellidos) error = 'Completa tu nombre y apellidos';
  else if (!correo || !correo.includes('@')) error = 'Ingresa un correo válido';
  else if (!contrasena || contrasena.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
  else if (contrasena !== confirmar) error = 'Las contraseñas no coinciden';
  else if (userModel.findByEmail(correo)) error = 'Ese correo ya está registrado';

  if (error) {
    return res.render('auth/registro', { titulo: 'Registro', error: error });
  }

  // se guarda el usuario nuevo en users.json y se inicia sesión
  sesion.usuario = userModel.create({
    firstName: nombre,
    lastName: apellidos,
    email: correo.trim(),
    password: contrasena,
    category: 'customer'
  });
  sesion.iniciada = true;
  res.redirect('/');
};

exports.salir = function (req, res) {
  sesion.iniciada = false;
  sesion.usuario = null;
  res.redirect('/login');
};

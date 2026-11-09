const { body } = require('express-validator');
const userModel = require('../models/userModel');
const db = require('../database/models');

// mayúscula, minúscula, número y un carácter especial
const REGEX_CLAVE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
exports.REGEX_CLAVE = REGEX_CLAVE;

// El archivo ya lo revisó middlewares/subirArchivo.js; aquí solo se muestra su error
function validarArchivo(campo) {
  return body(campo).custom(function (valor, { req }) {
    if (req.errorArchivo) throw new Error(req.errorArchivo);
    return true;
  });
}

exports.registro = [
  body('nombre').trim()
    .notEmpty().withMessage('Escribe tu nombre').bail()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres').bail()
    .isLength({ max: 60 }).withMessage('El nombre no puede superar los 60 caracteres'),

  body('apellidos').trim()
    .notEmpty().withMessage('Escribe tus apellidos').bail()
    .isLength({ min: 2 }).withMessage('Los apellidos deben tener al menos 2 caracteres').bail()
    .isLength({ max: 80 }).withMessage('Los apellidos no pueden superar los 80 caracteres'),

  body('correo').trim()
    .notEmpty().withMessage('Escribe tu correo electrónico').bail()
    .isEmail().withMessage('Escribe un correo válido').bail()
    .isLength({ max: 120 }).withMessage('El correo no puede superar los 120 caracteres').bail()
    .custom(async function (correo) {
      if (await userModel.findByEmail(correo)) throw new Error('Ese correo ya está registrado');
      return true;
    }),

  body('contrasena')
    .notEmpty().withMessage('Escribe una contraseña').bail()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').bail()
    .matches(REGEX_CLAVE).withMessage('Debe tener mayúscula, minúscula, número y un carácter especial'),

  body('confirmar').custom(function (valor, { req }) {
    if (valor !== req.body.contrasena) throw new Error('Las contraseñas no coinciden');
    return true;
  }),

  validarArchivo('foto')
];

exports.login = [
  body('correo').trim()
    .notEmpty().withMessage('Escribe tu correo electrónico').bail()
    .isEmail().withMessage('Escribe un correo válido').bail()
    .custom(async function (correo, { req }) {
      const usuario = await userModel.findByEmail(correo);
      if (!usuario) throw new Error('Este correo no está registrado');
      req.usuarioLogin = usuario;
      return true;
    }),

  body('contrasena')
    .notEmpty().withMessage('Escribe tu contraseña').bail()
    .custom(function (contrasena, { req }) {
      if (req.usuarioLogin && !userModel.verificarPassword(req.usuarioLogin, contrasena)) {
        throw new Error('La contraseña es incorrecta');
      }
      return true;
    })
];

exports.producto = [
  body('name').trim()
    .notEmpty().withMessage('Escribe el nombre del producto').bail()
    .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres').bail()
    .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),

  body('description').trim()
    .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres'),

  body('price').trim()
    .isInt({ min: 1, max: 1000000000 }).withMessage('El precio debe ser un número entero mayor a 0'),

  // tablas secundarias: la categoría y los tamaños tienen que existir en la base
  body('category').custom(async function (slug) {
    const categoria = await db.Category.findOne({ where: { slug: String(slug) } });
    if (!categoria) throw new Error('Elige una categoría válida');
    return true;
  }),

  body('sizes').custom(async function (texto) {
    const pedidos = String(texto || '').split(',')
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (!pedidos.length) return true;

    const existentes = (await db.Size.findAll()).map(function (s) { return s.name; });
    const minusculas = existentes.map(function (n) { return n.toLowerCase(); });
    const invalidos = pedidos.filter(function (n) { return minusculas.indexOf(n.toLowerCase()) === -1; });

    if (invalidos.length) {
      throw new Error('Tamaños que no existen: ' + invalidos.join(', ') + '. Opciones: ' + existentes.join(', '));
    }
    return true;
  }),

  validarArchivo('image')
];

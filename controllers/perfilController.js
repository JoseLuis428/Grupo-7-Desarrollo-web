const fs = require('fs');
const path = require('path');
const userModel = require('../models/userModel');
const { REGEX_CLAVE } = require('../middlewares/validaciones');

const CARPETA_FOTOS = path.join(__dirname, '..', 'public', 'uploads', 'perfiles');

function mostrar(res, usuario, extra, vista) {
  res.render(vista || 'auth/perfil', Object.assign({
    titulo: vista === 'auth/foto' ? 'Foto de perfil' : 'Mi perfil',
    perfil: userModel.sinPassword(usuario),
    error: null,
    exito: null
  }, extra));
}

exports.ver = function (req, res) {
  mostrar(res, req.usuario, {});
};

exports.verFoto = function (req, res) {
  mostrar(res, req.usuario, {}, 'auth/foto');
};

exports.actualizar = async function (req, res) {
  const nombre = (req.body.nombre || '').trim();
  const apellidos = (req.body.apellidos || '').trim();

  let error = null;
  if (nombre.length < 2 || apellidos.length < 2) error = 'El nombre y los apellidos deben tener al menos 2 caracteres';
  else if (nombre.length > 60 || apellidos.length > 80) error = 'El nombre admite hasta 60 caracteres y los apellidos hasta 80';

  if (error) return mostrar(res, req.usuario, { error: error, editando: true });

  const actualizado = await userModel.update(req.usuario.id, { firstName: nombre, lastName: apellidos });
  mostrar(res, actualizado, { exito: 'Tus datos se actualizaron' });
};

exports.cambiarContrasena = async function (req, res) {
  const { actual, nueva, confirmar } = req.body;

  let error = null;
  if (!actual || !userModel.verificarPassword(req.usuario, actual)) error = 'La contraseña actual no es correcta';
  else if (!nueva || nueva.length < 8) error = 'La contraseña nueva debe tener al menos 8 caracteres';
  else if (!REGEX_CLAVE.test(nueva)) error = 'La contraseña nueva debe tener mayúscula, minúscula, número y un carácter especial';
  else if (nueva !== confirmar) error = 'Las contraseñas nuevas no coinciden';

  if (error) return mostrar(res, req.usuario, { error: error });

  const actualizado = await userModel.update(req.usuario.id, { password: userModel.hashPassword(nueva) });
  mostrar(res, actualizado, { exito: 'Tu contraseña se cambió' });
};

function borrarArchivoFoto(nombre) {
  if (!nombre) return;
  const ruta = path.join(CARPETA_FOTOS, path.basename(nombre));
  fs.unlink(ruta, function () {});
}

exports.subirFoto = async function (req, res) {
  if (req.errorArchivo) return mostrar(res, req.usuario, { error: req.errorArchivo }, 'auth/foto');
  if (!req.file) return mostrar(res, req.usuario, { error: 'Elige una imagen para subir' }, 'auth/foto');

  borrarArchivoFoto(req.usuario.photo);
  const actualizado = await userModel.update(req.usuario.id, { photo: req.file.filename });
  mostrar(res, actualizado, { exito: 'Tu foto de perfil se actualizó' }, 'auth/foto');
};

exports.quitarFoto = async function (req, res) {
  borrarArchivoFoto(req.usuario.photo);
  const actualizado = await userModel.update(req.usuario.id, { photo: null });
  mostrar(res, actualizado, { exito: 'Tu foto de perfil se quitó' }, 'auth/foto');
};

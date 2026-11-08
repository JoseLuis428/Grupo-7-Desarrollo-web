const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const userModel = require('../models/userModel');

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

  if (!nombre || !apellidos) return mostrar(res, req.usuario, { error: 'Completa tu nombre y apellidos', editando: true });

  const actualizado = await userModel.update(req.usuario.id, { firstName: nombre, lastName: apellidos });
  mostrar(res, actualizado, { exito: 'Tus datos se actualizaron' });
};

exports.cambiarContrasena = async function (req, res) {
  const { actual, nueva, confirmar } = req.body;

  let error = null;
  if (!actual || !userModel.verificarPassword(req.usuario, actual)) error = 'La contraseña actual no es correcta';
  else if (!nueva || nueva.length < 6) error = 'La contraseña nueva debe tener al menos 6 caracteres';
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
  if (req.errorFoto) return mostrar(res, req.usuario, { error: req.errorFoto }, 'auth/foto');

  fs.mkdirSync(CARPETA_FOTOS, { recursive: true });
  const nombre = 'usuario-' + req.usuario.id + '-' + crypto.randomBytes(6).toString('hex') + '.' + req.foto.ext;
  fs.writeFileSync(path.join(CARPETA_FOTOS, nombre), req.foto.buffer);

  borrarArchivoFoto(req.usuario.photo);
  const actualizado = await userModel.update(req.usuario.id, { photo: nombre });
  mostrar(res, actualizado, { exito: 'Tu foto de perfil se actualizó' }, 'auth/foto');
};

exports.quitarFoto = async function (req, res) {
  borrarArchivoFoto(req.usuario.photo);
  const actualizado = await userModel.update(req.usuario.id, { photo: null });
  mostrar(res, actualizado, { exito: 'Tu foto de perfil se quitó' }, 'auth/foto');
};

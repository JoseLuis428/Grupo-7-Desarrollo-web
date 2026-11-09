const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const MAX_BYTES = 2 * 1024 * 1024;
const EXTENSIONES = ['.jpg', '.jpeg', '.png', '.gif'];
const MENSAJE_TIPO = 'El archivo debe ser una imagen JPG, JPEG, PNG o GIF';

// La extensión se puede falsear, así que también se revisan los primeros bytes del archivo
function esImagenReal(ruta) {
  try {
    const bytes = Buffer.alloc(8);
    const fd = fs.openSync(ruta, 'r');
    fs.readSync(fd, bytes, 0, 8, 0);
    fs.closeSync(fd);

    const esJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const esPng = bytes.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const esGif = bytes.slice(0, 3).toString('latin1') === 'GIF';
    return esJpg || esPng || esGif;
  } catch (e) {
    return false;
  }
}

// Borra del disco el archivo que acaba de subir esta petición (por ejemplo, si el formulario tiene errores)
exports.descartar = function (req) {
  if (req.file) fs.unlink(req.file.path, function () {});
  req.file = undefined;
};

// Devuelve un middleware que guarda una imagen en public/uploads/<carpeta>.
// Si algo sale mal no corta la petición: deja el mensaje en req.errorArchivo
// y las validaciones (express-validator) lo muestran junto al campo.
exports.crear = function (carpeta, campo) {
  const destino = path.join(__dirname, '..', 'public', 'uploads', carpeta);

  const subir = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        fs.mkdirSync(destino, { recursive: true });
        cb(null, destino);
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, campo + '-' + Date.now() + '-' + crypto.randomBytes(6).toString('hex') + ext);
      }
    }),
    limits: { fileSize: MAX_BYTES },
    fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (EXTENSIONES.indexOf(ext) === -1) {
        req.errorArchivo = MENSAJE_TIPO;
        return cb(null, false);
      }
      cb(null, true);
    }
  }).single(campo);

  return function (req, res, next) {
    subir(req, res, function (err) {
      if (err) {
        req.errorArchivo = err.code === 'LIMIT_FILE_SIZE'
          ? 'La imagen es muy pesada (máximo 2 MB)'
          : 'No se pudo leer la imagen';
      } else if (req.file && !esImagenReal(req.file.path)) {
        exports.descartar(req);
        req.errorArchivo = MENSAJE_TIPO;
      }
      next();
    });
  };
};

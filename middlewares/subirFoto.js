const MAX_BYTES = 2 * 1024 * 1024;

function detectarExtension(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 8 && b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.length > 6 && b.slice(0, 3).toString('latin1') === 'GIF') return 'gif';
  if (b.length > 12 && b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP') return 'webp';
  return null;
}

function extraerArchivo(cuerpo, boundary) {
  const separador = Buffer.from('--' + boundary);
  let inicio = cuerpo.indexOf(separador);
  while (inicio !== -1) {
    const siguiente = cuerpo.indexOf(separador, inicio + separador.length);
    if (siguiente === -1) break;
    const parte = cuerpo.slice(inicio + separador.length, siguiente);
    const corte = parte.indexOf('\r\n\r\n');
    if (corte !== -1) {
      const cabecera = parte.slice(0, corte).toString('latin1');
      if (/name="foto"/i.test(cabecera) && /filename="/i.test(cabecera)) {
        return parte.slice(corte + 4, parte.length - 2);
      }
    }
    inicio = siguiente;
  }
  return null;
}

module.exports = function subirFoto(req, res, next) {
  const tipo = req.headers['content-type'] || '';
  const m = /^multipart\/form-data;.*boundary=(?:"([^"]+)"|([^;]+))/i.exec(tipo);
  if (!m) { req.errorFoto = 'Elige una imagen para subir'; return next(); }

  const boundary = m[1] || m[2];
  const trozos = [];
  let total = 0;
  let excedido = false;

  req.on('data', function (t) {
    total += t.length;
    if (total > MAX_BYTES + 4096) { excedido = true; return; }
    trozos.push(t);
  });

  req.on('end', function () {
    if (excedido) { req.errorFoto = 'La imagen es muy pesada (máximo 2 MB)'; return next(); }

    const archivo = extraerArchivo(Buffer.concat(trozos), boundary);
    if (!archivo || archivo.length === 0) { req.errorFoto = 'Elige una imagen para subir'; return next(); }
    if (archivo.length > MAX_BYTES) { req.errorFoto = 'La imagen es muy pesada (máximo 2 MB)'; return next(); }

    const ext = detectarExtension(archivo);
    if (!ext) { req.errorFoto = 'El archivo debe ser una imagen JPG, PNG, WEBP o GIF'; return next(); }

    req.foto = { buffer: archivo, ext: ext };
    next();
  });

  req.on('error', function () { req.errorFoto = 'No se pudo leer la imagen'; next(); });
};

// Estado en memoria (se reinicia al apagar el servidor): sesión actual y carrito
module.exports = {
  ENVIO: 5000,
  sesion: { iniciada: false, usuario: null },
  estado: { carrito: [] }   // cada item es { id: 1, cantidad: 2, tamano: 'Mediano' }
};

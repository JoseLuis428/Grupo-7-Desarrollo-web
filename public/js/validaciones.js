// Validaciones del front-end: avisan al instante y evitan mandar datos inválidos al servidor.
// El back-end (express-validator) vuelve a validar todo, porque esto se puede desactivar desde el navegador.
(function () {
  const EXTENSIONES = ['jpg', 'jpeg', 'png', 'gif'];
  const MAX_BYTES = 2 * 1024 * 1024;
  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const REGEX_CLAVE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

  // Cada regla recibe el campo y devuelve el mensaje de error ('' si está bien)
  const reglas = {
    nombre: function (campo) {
      const v = campo.value.trim();
      if (!v) return 'Escribe tu nombre';
      if (v.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (v.length > 60) return 'El nombre no puede superar los 60 caracteres';
      return '';
    },

    apellidos: function (campo) {
      const v = campo.value.trim();
      if (!v) return 'Escribe tus apellidos';
      if (v.length < 2) return 'Los apellidos deben tener al menos 2 caracteres';
      if (v.length > 80) return 'Los apellidos no pueden superar los 80 caracteres';
      return '';
    },

    correo: function (campo) {
      const v = campo.value.trim();
      if (!v) return 'Escribe tu correo electrónico';
      if (!REGEX_CORREO.test(v)) return 'Escribe un correo válido';
      if (v.length > 120) return 'El correo no puede superar los 120 caracteres';
      return '';
    },

    'contrasena-registro': function (campo) {
      const v = campo.value;
      if (!v) return 'Escribe una contraseña';
      if (v.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
      if (!REGEX_CLAVE.test(v)) return 'Debe tener mayúscula, minúscula, número y un carácter especial';
      return '';
    },

    'contrasena-login': function (campo) {
      return campo.value ? '' : 'Escribe tu contraseña';
    },

    confirmar: function (campo) {
      return campo.value === campo.form.elements.contrasena.value ? '' : 'Las contraseñas no coinciden';
    },

    imagen: function (campo) {
      const archivo = campo.files[0];
      if (!archivo) return '';
      const ext = archivo.name.split('.').pop().toLowerCase();
      if (EXTENSIONES.indexOf(ext) === -1) return 'El archivo debe ser una imagen JPG, JPEG, PNG o GIF';
      if (archivo.size > MAX_BYTES) return 'La imagen es muy pesada (máximo 2 MB)';
      return '';
    },

    'nombre-producto': function (campo) {
      const v = campo.value.trim();
      if (!v) return 'Escribe el nombre del producto';
      if (v.length < 5) return 'El nombre debe tener al menos 5 caracteres';
      if (v.length > 100) return 'El nombre no puede superar los 100 caracteres';
      return '';
    },

    descripcion: function (campo) {
      return campo.value.trim().length >= 20 ? '' : 'La descripción debe tener al menos 20 caracteres';
    },

    precio: function (campo) {
      const n = Number(campo.value);
      if (campo.value.trim() === '' || !Number.isInteger(n) || n < 1 || n > 1000000000) {
        return 'El precio debe ser un número entero mayor a 0';
      }
      return '';
    }
  };

  function mostrarError(campo, mensaje) {
    const destino = campo.form.querySelector('[data-error-de="' + campo.name + '"]');
    if (destino) destino.textContent = mensaje;
    campo.classList.toggle('invalido', mensaje !== '');
  }

  function validarCampo(campo) {
    const regla = reglas[campo.dataset.regla];
    const mensaje = regla ? regla(campo) : '';
    mostrarError(campo, mensaje);
    return mensaje === '';
  }

  document.querySelectorAll('form[data-validar]').forEach(function (form) {
    const campos = form.querySelectorAll('[data-regla]');

    campos.forEach(function (campo) {
      // al salir del campo se valida; si ya tenía error, se revisa mientras escribe
      campo.addEventListener(campo.type === 'file' ? 'change' : 'blur', function () { validarCampo(campo); });

      campo.addEventListener('input', function () {
        if (campo.classList.contains('invalido')) validarCampo(campo);
        const confirmar = form.elements.confirmar;
        if (campo.name === 'contrasena' && confirmar && confirmar.value) validarCampo(confirmar);
      });
    });

    form.addEventListener('submit', function (evento) {
      let primeroConError = null;
      campos.forEach(function (campo) {
        if (!validarCampo(campo) && !primeroConError) primeroConError = campo;
      });

      if (primeroConError) {
        evento.preventDefault();
        primeroConError.focus();
      }
    });
  });
})();

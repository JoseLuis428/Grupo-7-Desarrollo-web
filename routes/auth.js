const router = require('express').Router();
const asincrono = require('../middlewares/asincrono');
const subirArchivo = require('../middlewares/subirArchivo');
const validar = require('../middlewares/validaciones');
const c = require('../controllers/authController');

const subirFoto = subirArchivo.crear('perfiles', 'foto');

router.get('/login', asincrono(c.verLogin));
router.post('/login', validar.login, asincrono(c.login));
router.get('/registro', asincrono(c.verRegistro));
router.post('/registro', subirFoto, validar.registro, asincrono(c.registro));
router.get('/salir', asincrono(c.salir));

module.exports = router;

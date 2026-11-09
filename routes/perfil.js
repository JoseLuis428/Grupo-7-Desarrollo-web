const router = require('express').Router();
const auth = require('../middlewares/auth');
const subirArchivo = require('../middlewares/subirArchivo');
const asincrono = require('../middlewares/asincrono');
const c = require('../controllers/perfilController');

const subirFoto = subirArchivo.crear('perfiles', 'foto');

router.use(auth.soloUsuarios);

router.get('/', asincrono(c.ver));
router.put('/', asincrono(c.actualizar));
router.put('/contrasena', asincrono(c.cambiarContrasena));

router.get('/foto', asincrono(c.verFoto));
router.post('/foto', subirFoto, asincrono(c.subirFoto));
router.delete('/foto', asincrono(c.quitarFoto));

module.exports = router;

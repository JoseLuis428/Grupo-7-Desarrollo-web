const router = require('express').Router();
const auth = require('../middlewares/auth');
const subirFoto = require('../middlewares/subirFoto');
const c = require('../controllers/perfilController');

router.use(auth.soloUsuarios);

router.get('/', c.ver);
router.put('/', c.actualizar);
router.put('/contrasena', c.cambiarContrasena);

router.get('/foto', c.verFoto);
router.post('/foto', subirFoto, c.subirFoto);
router.delete('/foto', c.quitarFoto);

module.exports = router;

const router = require('express').Router();
const c = require('../controllers/authController');

router.get('/login', c.verLogin);
router.post('/login', c.login);
router.get('/registro', c.verRegistro);
router.post('/registro', c.registro);
router.get('/salir', c.salir);

module.exports = router;

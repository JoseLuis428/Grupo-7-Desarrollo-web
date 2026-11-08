const router = require('express').Router();
const asincrono = require('../middlewares/asincrono');
const c = require('../controllers/authController');

router.get('/login', asincrono(c.verLogin));
router.post('/login', asincrono(c.login));
router.get('/registro', asincrono(c.verRegistro));
router.post('/registro', asincrono(c.registro));
router.get('/salir', asincrono(c.salir));

module.exports = router;

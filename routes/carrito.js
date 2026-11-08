const router = require('express').Router();
const asincrono = require('../middlewares/asincrono');
const c = require('../controllers/carritoController');

router.get('/', asincrono(c.ver));
router.post('/agregar/:id', asincrono(c.agregar));
router.post('/cantidad/:id', asincrono(c.cantidad));
router.post('/quitar/:id', asincrono(c.quitar));

module.exports = router;

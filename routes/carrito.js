const router = require('express').Router();
const c = require('../controllers/carritoController');

router.get('/', c.ver);
router.post('/agregar/:id', c.agregar);
router.post('/cantidad/:id', c.cantidad);   // botones - y +
router.post('/quitar/:id', c.quitar);

module.exports = router;

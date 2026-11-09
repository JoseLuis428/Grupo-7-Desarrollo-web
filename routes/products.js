const router = require('express').Router();
const asincrono = require('../middlewares/asincrono');
const subirArchivo = require('../middlewares/subirArchivo');
const validar = require('../middlewares/validaciones');
const c = require('../controllers/productsController');

const subirImagen = subirArchivo.crear('productos', 'image');

router.get('/', asincrono(c.index));
router.get('/create', asincrono(c.create));
router.get('/:id', asincrono(c.show));
router.post('/', subirImagen, validar.producto, asincrono(c.store));
router.get('/:id/edit', asincrono(c.edit));
router.put('/:id', subirImagen, validar.producto, asincrono(c.update));
router.delete('/:id', asincrono(c.destroy));

module.exports = router;

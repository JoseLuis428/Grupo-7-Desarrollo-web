const router = require('express').Router();
const c = require('../controllers/productsController');

router.get('/', c.index);              // 1. Listado de productos
router.get('/create', c.create);       // 2. Formulario de creación (va antes de '/:id')
router.get('/:id', c.show);            // 3. Detalle de un producto
router.post('/', c.store);             // 4. Acción de creación
router.get('/:id/edit', c.edit);       // 5. Formulario de edición
router.put('/:id', c.update);          // 6. Acción de edición
router.delete('/:id', c.destroy);      // 7. Acción de borrado

module.exports = router;

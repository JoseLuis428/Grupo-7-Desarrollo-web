const router = require('express').Router();
const asincrono = require('../middlewares/asincrono');
const c = require('../controllers/productsController');

router.get('/', asincrono(c.index));
router.get('/create', asincrono(c.create));
router.get('/:id', asincrono(c.show));
router.post('/', asincrono(c.store));
router.get('/:id/edit', asincrono(c.edit));
router.put('/:id', asincrono(c.update));
router.delete('/:id', asincrono(c.destroy));

module.exports = router;

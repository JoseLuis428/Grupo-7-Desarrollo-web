const router = require('express').Router();
const c = require('../controllers/productsController');

router.get('/', c.index);              
router.get('/create', c.create);      
router.get('/:id', c.show);           
router.post('/', c.store);          
router.get('/:id/edit', c.edit);   
router.put('/:id', c.update);          
router.delete('/:id', c.destroy);  

module.exports = router;

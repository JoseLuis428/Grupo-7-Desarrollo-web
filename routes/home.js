const router = require('express').Router();
const c = require('../controllers/homeController');

router.get('/', c.inicio);

module.exports = router;

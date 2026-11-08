const router = require('express').Router();
const asincrono = require('../middlewares/asincrono');
const c = require('../controllers/homeController');

router.get('/', asincrono(c.inicio));

module.exports = router;

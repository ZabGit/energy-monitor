const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const alertController = require('../controllers/alertController');

router.get('/', auth, alertController.getAlerts);
// Для установки лимита
router.post('/limits', auth, alertController.setLimit);

module.exports = router;
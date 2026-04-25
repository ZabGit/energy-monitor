const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const consumptionController = require('../controllers/consumptionController');

router.get('/', auth, consumptionController.getReportByRoom);

module.exports = router;
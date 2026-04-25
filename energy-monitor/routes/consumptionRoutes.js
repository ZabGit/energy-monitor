const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const consumptionController = require('../controllers/consumptionController');

router.post('/', auth, consumptionController.addConsumption);
router.get('/points/:id/consumptions', auth, consumptionController.getConsumptionsByPoint);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pointController = require('../controllers/pointController');

router.post('/', auth, pointController.createPoint);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roomController = require('../controllers/roomController');

router.get('/', auth, roomController.getRooms);
router.post('/', auth, roomController.createRoom);
router.put('/:id', auth, roomController.updateRoom);
router.delete('/:id', auth, roomController.deleteRoom);
router.get('/:id/points', auth, roomController.getPoints);

module.exports = router;
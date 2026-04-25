const db = require('../database');

// Добавить точку учёта (прибор) в помещение
exports.createPoint = (req, res) => {
  const { roomId, name, description } = req.body;
  if (!roomId || !name) {
    return res.status(400).json({ error: 'roomId and name are required' });
  }
  // Существует ли комната
  db.get(`SELECT id FROM rooms WHERE id = ?`, [roomId], (err, room) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    db.run(
      `INSERT INTO points (roomId, name, description) VALUES (?, ?, ?)`,
      [roomId, name, description || ''],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, roomId, name, description: description || '' });
      }
    );
  });
};
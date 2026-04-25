const db = require('../database');

// Получить все помещения
exports.getRooms = (req, res) => {
  db.all(`SELECT * FROM rooms ORDER BY id`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Добавить помещение
exports.createRoom = (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }
  db.run(
    `INSERT INTO rooms (name, description) VALUES (?, ?)`,
    [name, description || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, description: description || '' });
    }
  );
};

// Изменить помещение
exports.updateRoom = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }
  db.run(
    `UPDATE rooms SET name = ?, description = ? WHERE id = ?`,
    [name, description || '', id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json({ id: parseInt(id), name, description: description || '' });
    }
  );
};

// Удалить помещение
exports.deleteRoom = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM rooms WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  });
};

// Получить все точки учёта для конкретного помещения
exports.getPoints = (req, res) => {
  const { id } = req.params;
  db.all(`SELECT * FROM points WHERE roomId = ? ORDER BY id`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
const db = require('../database');

// Добавить показание
exports.addConsumption = (req, res) => {
  const { pointId, datetime, consumptionValue } = req.body;
  if (!pointId || !datetime || consumptionValue === undefined) {
    return res.status(400).json({ error: 'pointId, datetime, consumptionValue are required' });
  }
  db.run(
    `INSERT INTO consumptions (pointId, datetime, consumptionValue) VALUES (?, ?, ?)`,
    [pointId, datetime, consumptionValue],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, pointId, datetime, consumptionValue });
    }
  );
};

// Получить показания конкретной точки за период
exports.getConsumptionsByPoint = (req, res) => {
  const { id } = req.params;        // id точки учёта
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'from and to dates are required (YYYY-MM-DD)' });
  }
  const sql = `
    SELECT datetime, consumptionValue 
    FROM consumptions 
    WHERE pointId = ? AND date(datetime) BETWEEN date(?) AND date(?)
    ORDER BY datetime
  `;
  db.all(sql, [id, from, to], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Отчёт по помещению (суммарное потребление за период по всем его точкам)
exports.getReportByRoom = (req, res) => {
  const { roomId, from, to } = req.query;
  if (!roomId || !from || !to) {
    return res.status(400).json({ error: 'roomId, from, to are required' });
  }
  // Получение имени помещения
  db.get(`SELECT name FROM rooms WHERE id = ?`, [roomId], (err, room) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    // Суммарное потребление по всем точкам помещения за период
    const sqlTotal = `
      SELECT SUM(c.consumptionValue) as total
      FROM consumptions c
      JOIN points p ON p.id = c.pointId
      WHERE p.roomId = ? AND date(c.datetime) BETWEEN date(?) AND date(?)
    `;
    db.get(sqlTotal, [roomId, from, to], (err, totalRow) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Детализация по точкам
      const sqlDetails = `
        SELECT p.name as pointName, SUM(c.consumptionValue) as consumption
        FROM consumptions c
        JOIN points p ON p.id = c.pointId
        WHERE p.roomId = ? AND date(c.datetime) BETWEEN date(?) AND date(?)
        GROUP BY p.id
      `;
      db.all(sqlDetails, [roomId, from, to], (err, details) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          roomName: room.name,
          totalConsumption: totalRow.total || 0,
          details: details || []
        });
      });
    });
  });
};
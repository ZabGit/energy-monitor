const db = require('../database');

exports.getAlerts = (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  // Запрос: Расчёт потребления для каждой точки с лимитом за текущий день
  const sql = `
    SELECT 
      p.id as pointId,
      p.name as pointName,
      l.limitValue,
      COALESCE(SUM(c.consumptionValue), 0) as todayConsumption
    FROM points p
    JOIN limits l ON l.pointId = p.id
    LEFT JOIN consumptions c ON c.pointId = p.id AND date(c.datetime) = date(?)
    GROUP BY p.id
    HAVING todayConsumption > l.limitValue
  `;
  db.all(sql, [today], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const alerts = rows.map(row => ({
      pointId: row.pointId,
      message: `Point "${row.pointName}" exceeded daily limit. Limit: ${row.limitValue}, actual: ${row.todayConsumption}`,
      limit: row.limitValue,
      current: row.todayConsumption
    }));
    res.json(alerts);
  });
};

// Дополнительно: функция для установки лимита
exports.setLimit = (req, res) => {
  const { pointId, limitValue } = req.body;
  if (!pointId || limitValue === undefined) {
    return res.status(400).json({ error: 'pointId and limitValue required' });
  }
  db.run(
    `INSERT OR REPLACE INTO limits (pointId, limitValue) VALUES (?, ?)`,
    [pointId, limitValue],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ pointId, limitValue });
    }
  );
};
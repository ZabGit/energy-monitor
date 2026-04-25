const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'energy.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Пользователи
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  // Помещения
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  )`);

  // Точки учёта (приборы)
  db.run(`CREATE TABLE IF NOT EXISTS points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomId INTEGER,
    name TEXT,
    description TEXT,
    FOREIGN KEY(roomId) REFERENCES rooms(id) ON DELETE CASCADE
  )`);

  // Показания потребления
  db.run(`CREATE TABLE IF NOT EXISTS consumptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pointId INTEGER,
    datetime TEXT,
    consumptionValue REAL,
    FOREIGN KEY(pointId) REFERENCES points(id) ON DELETE CASCADE
  )`);

  // Лимиты для оповещений
  db.run(`CREATE TABLE IF NOT EXISTS limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pointId INTEGER,
    limitValue REAL,
    FOREIGN KEY(pointId) REFERENCES points(id) ON DELETE CASCADE
  )`);

  console.log('Database tables are ready');
});

module.exports = db;
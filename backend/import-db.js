const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

let sql = fs.readFileSync(path.join(__dirname, '../database/db_coffee.sql'), 'utf8');
sql = sql
  .split('\n')
  .filter(line =>
    !line.trim().toUpperCase().startsWith('CREATE DATABASE') &&
    !line.trim().toUpperCase().startsWith('USE `DB_COFFEE`')
  )
  .join('\n');

// hapus tabel lama (bikinan migrate.js) biar CREATE TABLE di dump bikin struktur yang baru/lengkap
const dropOld = `
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS menus;
  DROP TABLE IF EXISTS users;
`;

sql = dropOld + sql;

const db = mysql.createConnection({
  host: 'mysql-32f49de5-fahdimas.d.aivencloud.com',
  port: 28308,
  user: 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false },
  multipleStatements: true
});

db.connect((err) => {
  if (err) return console.error('❌ Gagal connect ke Aiven:', err);
  console.log('Terhubung ke Aiven, mulai import...');

  db.query(sql, (err) => {
    if (err) console.error('❌ Gagal import:', err);
    else console.log('✅ Import database berhasil!');
    db.end();
  });
});
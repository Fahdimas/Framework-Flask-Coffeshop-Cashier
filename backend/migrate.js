const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'mysql-32f49de5-fahdimas.d.aivencloud.com',
  port: 28308,
  user: 'avnadmin',
  password: 'AVNS_CHEKT1Bth1wHstQwn-t', // Masukkan password Aiven yang sama
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) {
    console.error('Gagal koneksi ke Aiven:', err);
    return;
  }
  console.log('Berhasil terhubung ke Aiven MySQL!');

  const createUsers = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
  )`;

  const createMenus = `CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kopi VARCHAR(100),
    deskripsi TEXT,
    harga INT,
    stok INT DEFAULT 999,
    gambar VARCHAR(255)
  )`;

  const createOrders = `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pelanggan VARCHAR(100),
    detail_pesanan TEXT,
    total_harga INT,
    uang_dibayar INT,
    kembalian INT,
    status VARCHAR(50) DEFAULT 'Menunggu'
  )`;

  db.query(createUsers, () => console.log('✅ Tabel users berhasil dibuat!'));
  db.query(createMenus, () => console.log('✅ Tabel menus berhasil dibuat!'));
  db.query(createOrders, () => {
    console.log('✅ Tabel orders berhasil dibuat! MIGRASI SELESAI!');
    process.exit();
  });
});
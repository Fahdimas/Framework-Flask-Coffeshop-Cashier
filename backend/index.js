const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Library baru untuk upload
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Akses folder uploads agar gambar bisa ditampilkan di React
app.use('/uploads', express.static('uploads'));

const db = mysql.createConnection({
  host: 'mysql-32f49de5-fahdimas.d.aivencloud.com',
  port: 28308,
  user: 'avnadmin',
  password: process.env.DB_PASSWORD, // <--- Ubah persis jadi seperti ini
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) console.error('Gagal terhubung ke database:', err);
  else console.log('Berhasil terhubung ke database db_coffee MySQL!');
});

// Konfigurasi Multer untuk menyimpan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Simpan ke folder uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Beri nama unik pakai tanggal
  }
});
const upload = multer({ storage: storage });

// === API AUTH ===
app.post('/api/register', async (req, res) => {
  const { nama, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)';
    db.query(query, [nama, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Registrasi berhasil!' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Email tidak ditemukan' });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Password salah' });
    const token = jwt.sign({ id: user.id }, 'kunci_rahasia_coffee_project', { expiresIn: '1d' });
    res.json({ message: 'Login berhasil!', token, user: { nama: user.nama } });
  });
});

// === API MENU (Dengan Upload Gambar) ===
app.get('/api/menus', (req, res) => {
  db.query('SELECT * FROM menus ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Gunakan upload.single('gambar') untuk menerima file
app.post('/api/menus', upload.single('gambar'), (req, res) => {
  const { nama_kopi, deskripsi, harga, stok } = req.body;
  // Jika ada file yang diupload, buat URL-nya. Jika tidak, kosongkan.
  const gambarUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
  
  const query = 'INSERT INTO menus (nama_kopi, deskripsi, harga, stok, gambar) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nama_kopi, deskripsi, harga, stok || 999, gambarUrl], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Menu ditambahkan!' });
  });
});

app.put('/api/menus/:id', upload.single('gambar'), (req, res) => {
  const { id } = req.params;
  const { nama_kopi, deskripsi, harga } = req.body;
  
  let query = 'UPDATE menus SET nama_kopi = ?, deskripsi = ?, harga = ? WHERE id = ?';
  let values = [nama_kopi, deskripsi, harga, id];

  // Jika kasir mengupload gambar baru saat Edit
  if (req.file) {
    const gambarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    query = 'UPDATE menus SET nama_kopi = ?, deskripsi = ?, harga = ?, gambar = ? WHERE id = ?';
    values = [nama_kopi, deskripsi, harga, gambarUrl, id];
  }

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Menu kopi berhasil diperbarui!' });
  });
});

app.delete('/api/menus/:id', (req, res) => {
  db.query('DELETE FROM menus WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Menu berhasil dihapus!' });
  });
});

// === API ORDERS ===
app.post('/api/orders', (req, res) => {
  const { nama_pelanggan, detail_pesanan, total_harga, uang_dibayar, kembalian } = req.body;
  const query = 'INSERT INTO orders (nama_pelanggan, detail_pesanan, total_harga, uang_dibayar, kembalian) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nama_pelanggan, detail_pesanan, total_harga, uang_dibayar, kembalian], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Transaksi berhasil!' });
  });
});

app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/orders/:id', (req, res) => {
  db.query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status diperbarui!' });
  });
});

app.listen(5000, () => console.log('Server berjalan di http://localhost:5000'));
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Membaca data berita dari file JSON
const getBerita = () => {
  try {
    const data = fs.readFileSync('./data/berita.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// API: ambil semua berita
app.get('/api/berita', (req, res) => {
  const berita = getBerita();
  res.json(berita);
});

// API: kirim pesan kontak (simpan ke file JSON sementara)
app.post('/api/contact', (req, res) => {
  const { nama, email, pesan } = req.body;
  if (!nama || !email || !pesan) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const contactsPath = './data/contacts.json';
  let contacts = [];
  try {
    contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
  } catch (err) {
    contacts = [];
  }

  contacts.push({ nama, email, pesan, tanggal: new Date().toISOString() });
  fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));

  res.status(201).json({ message: 'Pesan terkirim!' });
});

// Fallback untuk SPA (semua route kembali ke index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server UNMURA berjalan di port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== API BERITA ==========
// Membaca data berita dari file JSON
const getBerita = () => {
  try {
    const data = fs.readFileSync('./data/berita.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

app.get('/api/berita', (req, res) => {
  const berita = getBerita();
  res.json(berita);
});

// ========== API DOSEN ==========
app.get('/api/dosen', (req, res) => {
  try {
    const data = fs.readFileSync('./data/dosen.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ message: 'Gagal membaca data dosen' });
  }
});

// ========== API KONTAK ==========
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

// ========== FALLBACK ROUTE ==========
// Semua route selain di atas akan diarahkan ke index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== JALANKAN SERVER ==========
app.listen(PORT, () => {
  console.log(`Server UNMURA berjalan di port ${PORT}`);
});

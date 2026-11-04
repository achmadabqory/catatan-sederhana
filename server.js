const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("catatan.db");

// 1. Buat tabel 
db.exec(`
  CREATE TABLE IF NOT EXISTS catatan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isi TEXT NOT NULL,
    dibuat TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// 2. Middleware
app.use(express.json());          
app.use(express.static("public")); 

// 3. API
app.get("/api/catatan", (req, res) => {
  const data = db.prepare("SELECT * FROM catatan ORDER BY id DESC").all();
  res.json(data);
});

app.post("/api/catatan", (req, res) => {
  const isi = (req.body.isi || "").trim();
  if (!isi) return res.status(400).json({ error: "Isi tidak boleh kosong" });

  const hasil = db.prepare("INSERT INTO catatan (isi) VALUES (?)").run(isi);
  res.status(201).json({ id: hasil.lastInsertRowid, isi });
});

app.delete("/api/catatan/:id", (req, res) => {
  db.prepare("DELETE FROM catatan WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// 4. Nyalakan server
app.listen(3000, () => console.log("Server jalan di http://localhost:3000"));
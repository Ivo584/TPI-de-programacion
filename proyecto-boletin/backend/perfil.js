const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// CORS básico
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Conexión a la base admin (donde están los usuarios activos para perfil)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   
  database: 'boletin_admin'
});

// GET /api/perfil?email=...  -> retorna { nombre, apellido, email, usuario, dni }
app.get('/api/perfil', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Falta email' });
  db.query('SELECT id, nombre, apellido, email, password_hash, dni, rol_id FROM usuarios WHERE email = ? LIMIT 1', [email], (err, rows) => {
    if (err) {
      console.error('Error obtener perfil:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const u = rows[0];
    res.json({
      id: u.id,
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      email: u.email || '',
      usuario: u.nombre || '',
      dni: u.dni || '',
      rol_id: u.rol_id || 1
    });
  });
});

app.listen(3005, () => console.log('Perfil backend en puerto 3005'));

const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Configuración MySQL (ajusta usuario/contraseña según XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // tu contraseña de XAMPP, normalmente vacío
  database: 'boletin_admin'
});

// Endpoint para listar usuarios pendientes
app.get('/api/pendientes', (req, res) => {
  db.query(
    "SELECT nombre AS usuario, email, DATE(creado_en) AS fecha FROM usuarios WHERE estado='Pendiente'",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// Endpoint para listar usuarios activos
app.get('/api/activos', (req, res) => {
  db.query(
    "SELECT nombre AS usuario, (SELECT nombre FROM roles WHERE id=rol_id) AS rol, estado FROM usuarios WHERE estado='Activo'",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// Endpoint para aceptar usuario
app.post('/api/pendientes/aceptar', (req, res) => {
  const { usuario } = req.body;
  db.query(
    "UPDATE usuarios SET estado='Activo' WHERE nombre=?",
    [usuario],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ ok: true });
    }
  );
});

// Endpoint para rechazar usuario
app.post('/api/pendientes/rechazar', (req, res) => {
  const { usuario } = req.body;
  db.query(
    "UPDATE usuarios SET estado='Rechazado' WHERE nombre=?",
    [usuario],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ ok: true });
    }
  );
});

// Endpoint para registrar usuario (estado pendiente)
app.post('/api/registro', (req, res) => {
  const { username, password, email, firstName, lastName, dni } = req.body;
  // Solo ejemplo: password sin hash, deberías hashearla en producción
  db.query(
    "INSERT INTO usuarios (nombre, email, password_hash, rol_id, estado) VALUES (?, ?, ?, 1, 'Pendiente')",
    [`${firstName} ${lastName}`, email, password],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ ok: true });
    }
  );
});

app.listen(3003, () => console.log('Admin backend en puerto 3003'));

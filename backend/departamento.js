const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Configuración MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_departamento'
});

// Endpoint para listar estudiantes
app.get('/api/estudiantes', (req, res) => {
  db.query(
    "SELECT nombre FROM usuarios WHERE rol_id=1 AND estado='Activo'",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows.map(r => r.nombre));
    }
  );
});

// Endpoint para listar asignaturas
app.get('/api/asignaturas', (req, res) => {
  db.query(
    "SELECT nombre FROM asignaturas",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows.map(r => r.nombre));
    }
  );
});

// Endpoint para guardar nota
app.post('/api/notas', (req, res) => {
  const { estudiante, asignatura, nota, fecha } = req.body;
  // Buscar IDs
  db.query(
    "SELECT e.id AS estudiante_id, a.id AS asignatura_id FROM estudiantes e JOIN usuarios u ON e.usuario_id=u.id JOIN asignaturas a ON a.nombre=? WHERE u.nombre=?",
    [asignatura, estudiante],
    (err, rows) => {
      if (err || rows.length === 0) return res.status(400).json({ error: "No encontrado" });
      const { estudiante_id, asignatura_id } = rows[0];
      db.query(
        "INSERT INTO notas (estudiante_id, asignatura_id, nota, fecha_registro) VALUES (?, ?, ?, ?)",
        [estudiante_id, asignatura_id, nota, fecha],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ ok: true });
        }
      );
    }
  );
});

app.listen(3002, () => console.log('Departamento backend en puerto 3002'));

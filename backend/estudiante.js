const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Configuración MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_estudiante'
});

// Endpoint para obtener notas del estudiante
app.get('/api/notas', (req, res) => {
  // Suponiendo id=1 para demo, deberías usar sesión/login real
  db.query(
    `SELECT a.nombre AS asignatura, n.nota, n.fecha_registro
     FROM notas n
     JOIN asignaturas a ON n.asignatura_id = a.id
     WHERE n.estudiante_id = 1`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// Endpoint para obtener datos del estudiante
app.get('/api/estudiante', (req, res) => {
  db.query(
    `SELECT nombre FROM usuarios WHERE id=1`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ nombre: rows[0]?.nombre || '' });
    }
  );
});

app.listen(3001, () => console.log('Estudiante backend en puerto 3001'));

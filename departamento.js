const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Habilitar CORS para permitir peticiones desde el frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Configuración MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin' // <-- cambiado de 'boletin_departamento' a 'boletin'
});

const axios = require('axios'); // Añade esto al inicio para hacer peticiones HTTP

// Endpoint para listar estudiantes (nombre completo y email)
app.get('/api/estudiantes', (req, res) => {
  db.query(
    "SELECT u.nombre, u.apellido, u.email FROM usuarios u WHERE u.rol_id=1 AND u.estado='Activo'",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      // Devuelve array de objetos { nombre, apellido, email }, sin nulls
      res.json(rows.map(r => ({
        nombre: r.nombre || '',
        apellido: r.apellido || '',
        email: r.email
      })));
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
  let { estudiante, asignatura, nota, fecha, cuatrimestre, informe } = req.body;

  // Forzar valores válidos exactos
  const CUATRIMESTRES_VALIDOS = ['1° Cuatrimestre', '2° Cuatrimestre'];
  const INFORMES_VALIDOS = ['1° Informe', '2° Informe', 'Final'];

  function normalizarCuatrimestre(val) {
    if (!val) return '';
    val = val.trim();
    if (val.startsWith('1')) return '1° Cuatrimestre';
    if (val.startsWith('2')) return '2° Cuatrimestre';
    if (CUATRIMESTRES_VALIDOS.includes(val)) return val;
    return '';
  }
  function normalizarInforme(val) {
    if (!val) return '';
    val = val.trim();
    if (val.startsWith('1')) return '1° Informe';
    if (val.startsWith('2')) return '2° Informe';
    if (/final/i.test(val)) return 'Final';
    if (INFORMES_VALIDOS.includes(val)) return val;
    return '';
  }
  cuatrimestre = normalizarCuatrimestre(cuatrimestre);
  informe = normalizarInforme(informe);

  // Buscar estudiante_id y asignatura_id usando email y nombre
  db.query(
    `SELECT e.id AS estudiante_id, a.id AS asignatura_id
     FROM estudiantes e
     JOIN usuarios u ON e.usuario_id = u.id
     JOIN asignaturas a ON a.nombre = ?
     WHERE u.email = ? AND u.rol_id = 1`,
    [asignatura, estudiante],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error en la consulta" });
      }
      if (!rows || rows.length === 0) {
        return res.status(400).json({ error: "No se encontró el estudiante o la asignatura. Verifica que el estudiante esté aprobado y la asignatura exista exactamente igual en la base de datos." });
      }
      const { estudiante_id, asignatura_id } = rows[0];
      db.query(
        "INSERT INTO notas (estudiante_id, asignatura_id, nota, fecha_registro, cuatrimestre, informe) VALUES (?, ?, ?, ?, ?, ?)",
        [estudiante_id, asignatura_id, nota, fecha, cuatrimestre || null, informe || null],
        (err2) => {
          if (err2) {
            return res.status(500).json({ error: "Error al guardar nota: " + err2.message });
          }
          res.json({ ok: true });
        }
      );
    }
  );
});

// Endpoint para obtener las últimas notas cargadas
app.get('/api/ultimas-notas', (req, res) => {
  db.query(
    `SELECT 
      u.nombre AS estudiante, 
      a.nombre AS asignatura, 
      n.cuatrimestre, 
      n.informe, 
      n.nota, 
      n.fecha_registro
    FROM notas n
    JOIN estudiantes e ON n.estudiante_id = e.id
    JOIN usuarios u ON e.usuario_id = u.id
    JOIN asignaturas a ON n.asignatura_id = a.id
    ORDER BY n.fecha_registro DESC
    LIMIT 20`,
    (err, rows) => {
      if (err) {
        console.error('Error en /api/ultimas-notas:', err); // <-- log para depuración
        return res.status(500).json({ error: 'DB error' });
      }
      res.json(rows);
    }
  );
});

// Endpoint para eliminar una nota
app.post('/api/eliminar-nota', (req, res) => {
  const { estudiante, asignatura, cuatrimestre, informe, nota, fecha } = req.body;
  // Buscar ids correspondientes
  db.query(
    `SELECT n.id FROM notas n
      JOIN estudiantes e ON n.estudiante_id = e.id
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN asignaturas a ON n.asignatura_id = a.id
      WHERE u.nombre = ? AND a.nombre = ? AND n.cuatrimestre = ? AND n.informe = ? AND n.nota = ? AND DATE(n.fecha_registro) = ?`,
    [estudiante, asignatura, cuatrimestre, informe, nota, fecha],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al buscar nota' });
      if (!rows.length) return res.status(404).json({ error: 'Nota no encontrada' });
      const notaId = rows[0].id;
      db.query('DELETE FROM notas WHERE id = ?', [notaId], (err2) => {
        if (err2) return res.status(500).json({ error: 'Error al eliminar nota' });
        res.json({ ok: true });
      });
    }
  );
});

app.listen(3002, () => console.log('Departamento backend en puerto 3002'));

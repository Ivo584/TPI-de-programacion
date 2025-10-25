const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// --- Añadir CORS para permitir peticiones desde el frontend ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
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
  database: 'boletin' // <-- cambiado de 'boletin_estudiante' a 'boletin'
});

// Endpoint para obtener notas del estudiante
app.get('/api/notas', (req, res) => {
  const email = req.query.email;
  if (email) {
    db.query(
      `SELECT e.id AS estudiante_id FROM estudiantes e JOIN usuarios u ON e.usuario_id=u.id WHERE u.email=? LIMIT 1`,
      [email],
      (err, rows) => {
        if (err) {
          console.error('Error buscando estudiante por email:', err);
          return res.json([]);
        }
        if (!rows.length) {
          console.warn('No se encontró estudiante para email:', email);
          return res.json([]);
        }
        const estudiante_id = rows[0].estudiante_id;
        db.query(
          `SELECT a.nombre AS asignatura, n.nota, n.fecha_registro, n.cuatrimestre, n.informe
           FROM notas n
           JOIN asignaturas a ON n.asignatura_id = a.id
           WHERE n.estudiante_id = ?`,
          [estudiante_id],
          (err2, rows2) => {
            if (err2) {
              console.error('Error obteniendo notas:', err2);
              return res.json([]);
            }
            // Log para depuración
            console.log('Notas crudas desde la base:', rows2);
            // Normalizar cuatrimestre/informe para frontend
            const CUATRIMESTRES = ['1° Cuatrimestre', '2° Cuatrimestre'];
            const INFORMES = ['1° Informe', '2° Informe', 'Final'];
            const normalizar = (val, tipo) => {
              if (!val) return '';
              val = val.trim();
              if (tipo === 'cuatrimestre') {
                if (CUATRIMESTRES.includes(val)) return val;
                if (val.startsWith('1')) return '1° Cuatrimestre';
                if (val.startsWith('2')) return '2° Cuatrimestre';
                return '';
              }
              if (tipo === 'informe') {
                if (INFORMES.includes(val)) return val;
                if (val.startsWith('1')) return '1° Informe';
                if (val.startsWith('2')) return '2° Informe';
                if (/final/i.test(val)) return 'Final';
                return '';
              }
              return val;
            };
            const notasNormalizadas = rows2.map(n => ({
              asignatura: n.asignatura,
              nota: n.nota,
              fecha_registro: n.fecha_registro,
              cuatrimestre: normalizar(n.cuatrimestre, 'cuatrimestre'),
              informe: normalizar(n.informe, 'informe')
            }));
            // Log para depuración
            console.log('Notas normalizadas para', email, ':', notasNormalizadas);
            res.json(notasNormalizadas);
          }
        );
      }
    );
  } else {
    // fallback demo
    db.query(
      `SELECT a.nombre AS asignatura, n.nota, n.fecha_registro, n.cuatrimestre, n.informe
       FROM notas n
       JOIN asignaturas a ON n.asignatura_id = a.id
       WHERE n.estudiante_id = 1`,
      (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
      }
    );
  }
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

// Endpoint para sincronizar nota desde departamento
app.post('/api/notas/sync', (req, res) => {
  const { estudiante, asignatura, nota, fecha } = req.body;
  if (!estudiante || !asignatura || typeof nota === 'undefined' || !fecha) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  // Busca el id del estudiante y asignatura en la base de notas
  db.query(
    "SELECT e.id AS estudiante_id, a.id AS asignatura_id FROM estudiantes e JOIN usuarios u ON e.usuario_id=u.id JOIN asignaturas a ON a.nombre=? WHERE u.email=?",
    [asignatura, estudiante],
    (err, rows) => {
      if (err || !rows.length) return res.status(400).json({ error: 'No encontrado' });
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

app.listen(3001, () => console.log('Estudiante backend en puerto 3001'));

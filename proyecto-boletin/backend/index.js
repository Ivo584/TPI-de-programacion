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

// Conexión a la base de datos de administración (contiene usuarios)
const dbAdmin = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_admin'
});

// Configuración MySQL para el backend de notas
const dbNotas = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin' 
});

// Inicio de sesión: busca usuario por nombre de usuario (username) y compara password (demo, sin hash)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  dbAdmin.query(
    // Buscar por nombre de usuario exacto (no nombre completo)
    'SELECT u.nombre, u.apellido, u.email, u.dni, u.rol_id, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.nombre = ? AND u.password_hash = ? AND u.estado = ?',
    [username, password, 'Activo'],
    (err, rows) => {
      if (err) {
        console.error('Error login:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      if (!rows || rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas o usuario no activo' });
      const user = rows[0];
      // Si apellido es "local", dejarlo vacío
      const apellidoFinal = (user.apellido && user.apellido.toLowerCase() === 'local') ? '' : (user.apellido || '');
      res.json({
        ok: true,
        usuario: {
          nombre: user.nombre,
          apellido: apellidoFinal,
          email: user.email,
          dni: user.dni,
          username: user.nombre // username es el campo nombre
        },
        rol: user.rol_nombre || ''
      });
    }
  );
});

// Endpoint para obtener notas de un estudiante por email
app.get('/api/notas', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Falta email' });
  // Buscar id del estudiante (toma solo el primero si hay duplicados)
  dbNotas.query(
    `SELECT e.id AS estudiante_id FROM estudiantes e JOIN usuarios u ON e.usuario_id = u.id WHERE u.email = ? AND u.rol_id = 1 LIMIT 1`,
    [email],
    (err, rows) => {
      if (err || !rows || !rows.length) return res.json([]);
      const estudiante_id = rows[0].estudiante_id;
      dbNotas.query(
        `SELECT 
          a.nombre AS asignatura, 
          n.nota, 
          n.cuatrimestre, 
          n.informe 
        FROM notas n 
        JOIN asignaturas a ON n.asignatura_id = a.id 
        WHERE n.estudiante_id = ?`,
        [estudiante_id],
        (err2, notas) => {
          if (err2) return res.json([]);
          res.json(notas);
        }
      );
    }
  );
});

// Endpoint para guardar nota
app.post('/api/notas', (req, res) => {
  const { estudiante, asignatura, nota, fecha, cuatrimestre, informe } = req.body;
  // estudiante = email, asignatura = nombre

  // Buscar el id del estudiante (tabla estudiantes) y el id de la asignatura
  dbNotas.query(
    `SELECT e.id AS estudiante_id, a.id AS asignatura_id
     FROM estudiantes e
     JOIN usuarios u ON e.usuario_id = u.id
     JOIN asignaturas a ON a.nombre = ?
     WHERE u.email = ? AND u.rol_id = 1`,
    [asignatura, estudiante], // <-- asegúrate de que el orden es [asignatura, estudiante]
    (err, rows) => {
      if (err) return res.status(400).json({ error: "No encontrado" });
      if (!rows || rows.length === 0) return res.status(400).json({ error: "No encontrado" });
      const { estudiante_id, asignatura_id } = rows[0];
      dbNotas.query(
        "INSERT INTO notas (estudiante_id, asignatura_id, nota, fecha_registro, cuatrimestre, informe) VALUES (?, ?, ?, ?, ?, ?)",
        [estudiante_id, asignatura_id, nota, fecha, cuatrimestre || null, informe || null],
        (err2) => {
          if (err2) return res.status(500).json({ error: "Error al guardar nota" });
          res.json({ ok: true });
        }
      );
    }
  );
});

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_admin'
};

let db;
async function start() {
  db = await mysql.createConnection(dbConfig);

  // Endpoint para estudiantes activos aprobados (para departamento/carga de notas)
  app.get('/api/estudiantes-aprobados', async (req, res) => {
    try {
      const [rows] = await db.execute(
        'SELECT id, nombre, apellido, email, dni, curso FROM usuarios WHERE rol_id = 1 AND estado = "Activo"'
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  });

  app.listen(3000, () => console.log('Backend index en puerto 3000'));
}
start();

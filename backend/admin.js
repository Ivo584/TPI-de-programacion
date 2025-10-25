const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// CORS básico
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Conexión a la base de administración
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_admin'
});

// Listar usuarios pendientes
app.get('/api/usuarios/pendientes', (req, res) => {
  db.query(
    `SELECT id, nombre, email, rol_id, estado FROM usuarios WHERE estado='Pendiente'`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

// Listar usuarios activos
app.get('/api/usuarios/activos', (req, res) => {
  db.query(
    `SELECT id, nombre, email, rol_id, estado FROM usuarios WHERE estado='Activo'`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows);
    }
  );
});

// Aprobar usuario (cambiar estado a Activo)
app.post('/api/usuarios/aprobar', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Falta id' });
  db.query(
    `UPDATE usuarios SET estado='Activo' WHERE id=?`,
    [id],
    async (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error' });

      // Sincronizar con boletin.usuarios
      const mysql2 = require('mysql2/promise');
      const dbNotas = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'boletin'
      });
      // Obtener datos del usuario aprobado
      db.query('SELECT nombre, apellido, email, password_hash, rol_id, dni, curso FROM usuarios WHERE id=?', [id], async (err2, rows) => {
        if (!err2 && rows && rows.length) {
          const u = rows[0];
          // Insertar solo si no existe
          const [existe] = await dbNotas.execute('SELECT id FROM usuarios WHERE email=? LIMIT 1', [u.email]);
          let usuarioId;
          if (!existe.length) {
            await dbNotas.execute(
              'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, estado, dni, curso) VALUES (?, ?, ?, ?, ?, "Activo", ?, ?)',
              [u.nombre, u.apellido, u.email, u.password_hash, u.rol_id, u.dni, u.curso]
            );
            // Obtener el id del usuario recién insertado
            const [usuarioRows] = await dbNotas.execute('SELECT id FROM usuarios WHERE email=? LIMIT 1', [u.email]);
            usuarioId = usuarioRows.length ? usuarioRows[0].id : null;
          } else {
            usuarioId = existe[0].id;
          }
          // Si es estudiante, crear también en la tabla estudiantes si no existe
          if (u.rol_id == 1 && usuarioId) {
            const [estRows] = await dbNotas.execute('SELECT id FROM estudiantes WHERE usuario_id=? LIMIT 1', [usuarioId]);
            if (!estRows.length) {
              await dbNotas.execute(
                'INSERT INTO estudiantes (usuario_id) VALUES (?)',
                [usuarioId]
              );
            }
          }
        }
        dbNotas.end();
        res.json({ ok: true });
      });
    }
  );
});

// Endpoint para estudiantes activos aprobados
app.get('/api/estudiantes-aprobados', (req, res) => {
  db.query(
    'SELECT id, nombre, apellido, email, dni, curso FROM usuarios WHERE rol_id = 1 AND estado = "Activo"',
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al obtener estudiantes' });
      res.json(rows);
    }
  );
});

module.exports = app;
app.listen(3003, () => console.log('Admin backend en puerto 3003'));
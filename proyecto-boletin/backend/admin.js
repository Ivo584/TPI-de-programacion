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


// Actualizar datos de usuario (admin)
app.put('/api/usuarios/actualizar', (req, res) => {
  const { id, nombre, apellido, email, dni, rol_id } = req.body;
  if (!id || !nombre || !email) return res.status(400).json({ error: 'Faltan campos obligatorios' });

  // Validaciones básicas
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) return res.status(400).json({ error: 'ID inválido' });

  // Permitir cambiar rol_id
  const sql = `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, dni = ?, rol_id = ? WHERE id = ?`;
  const params = [nombre, apellido || null, email, dni || null, rol_id || 1, idNum];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error actualizar usuario:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    // Opcional: comprobar affectedRows
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ ok: true });
  });
});

// Conexión a la base de datos de administración
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

// Endpoint para rechazar (eliminar) usuario por id
app.post('/api/usuarios/rechazar', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Falta id' });
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.json({ ok: true });
  });
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
app.listen(3003, () => console.log('Backend admin en puerto 3003'));
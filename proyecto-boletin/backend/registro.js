const express = require('express');
// Cambia a mysql2/promise para usar await/async
const mysql = require('mysql2/promise');
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

// Conexión a boletin_registro
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_registro'
};

const dbAdminConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_admin'
};

let db, dbAdmin;

async function startServer() {
  try {
    db = await mysql.createConnection(dbConfig);
    dbAdmin = await mysql.createConnection(dbAdminConfig);

    // POST /api/registro -> guarda un usuario como Pendiente (rol Estudiante por defecto o Profesor si indicado)
    app.post('/api/registro', async (req, res) => {
      try {
        const { username, password, email, firstName, lastName, dni, role, curso } = req.body;
        const nombre = firstName || username || '';
        const apellido = lastName || '';
        const rol_id = role === 'Profesor' ? 2 : 1;

        // Verificar si el email ya existe en boletin_registro
        const [regRows] = await db.execute('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
        if (regRows.length) {
          return res.status(400).json({ error: 'El correo ya está registrado (registro).' });
        }

        // Verificar si el email ya existe en boletin_admin
        const [admRows] = await dbAdmin.execute('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
        if (admRows.length) {
          return res.status(400).json({ error: 'El correo ya está registrado (admin).' });
        }

        // Insertar en boletin_registro
        await db.execute(
          'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, estado, dni, curso) VALUES (?, ?, ?, ?, ?, "Pendiente", ?, ?)',
          [nombre, apellido, email, password, rol_id, dni, curso]
        );
        // Replicar en admin como Pendiente, usando nombre y apellido en campos separados
        await dbAdmin.execute(
          'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, estado, dni, curso) VALUES (?, ?, ?, ?, ?, "Pendiente", ?, ?)',
          [nombre, apellido, email, password, rol_id, dni, curso]
        );
        res.json({ ok: true });
      } catch (err) {
        // Si el error es por duplicado, devolver mensaje claro
        if (err && err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El correo ya está registrado.' });
        }
        console.error('Error registro:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
      }
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    throw err;
  }
}

startServer();

app.listen(3004, () => console.log('Registro backend en puerto 3004'));
const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boletin_registro'
});

app.post('/api/registro', (req, res) => {
  const { username, password, email, firstName, lastName, dni } = req.body;
  db.query(
    "INSERT INTO usuarios (username, password, email, nombre, apellido, dni, estado) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente')",
    [username, password, email, firstName, lastName, dni],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ ok: true });
    }
  );
});

app.listen(3004, () => console.log('Backend registro en puerto 3004'));

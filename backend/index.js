const express = require('express');
const app = express();
app.use(express.json());

// Simulación de login (solo demo)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Aquí deberías validar contra la base de datos
  if (username && password) {
    res.json({ ok: true, usuario: username });
  } else {
    res.status(400).json({ error: 'Credenciales inválidas' });
  }
});

app.listen(3000, () => console.log('Backend index en puerto 3000'));

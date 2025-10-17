const express = require('express');
const app = express();

// Simulación de datos de perfil
app.get('/api/perfil', (req, res) => {
  res.json({
    nombre: 'María',
    apellido: 'Pérez',
    email: 'maria@ejemplo.com',
    usuario: 'mariap',
    dni: '12345678'
  });
});

app.listen(3005, () => console.log('Backend perfil en puerto 3005'));

const express = require('express');
const connection = require('./db'); // Importa el archivo de conexión

const app = express();

app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM ejemplo', (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

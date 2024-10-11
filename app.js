const express = require('express');
const connection = require('./db'); // Importa el archivo de conexión
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM Productos', (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server on port 3000');
});

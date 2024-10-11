const express = require('express');
const connection = require('./db'); // Importa el archivo de conexión
const cors = require('cors');
const clientesRoutes = require('./routes/clientes');
const verifyToken = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/data', verifyToken, (req, res) => {
  connection.query('SELECT * FROM Productos', (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

app.use(clientesRoutes);

app.listen(3000, () => {
  console.log('Server on port 3000');
});
const express = require('express');
const connection = require('./db'); // Importa el archivo de conexión
const cors = require('cors');
const clientesRoutes = require('./routes/clientes');
const verifyToken = require('./routes/aut'); // Cambia aquí para importar tu middleware de verificación de token

const app = express();

app.use(cors());
app.use(express.json());

// Ruta para obtener productos (requiere verificación de token)
app.get('/api/data', verifyToken, (req, res) => {
  connection.query('SELECT * FROM Productos', (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

// Usar las rutas de clientes con prefijo /api
app.use('/api', clientesRoutes);

app.listen(3000, () => {
  console.log('Server on port 3000');
});

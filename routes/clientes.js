const express = require('express');
const connection = require('../db'); // Asegúrate de tener la conexión a la base de datos
const { verifyToken } = require('./auth'); // Importar la verificación del token

const router = express.Router();

// Ruta para obtener información del cliente (requiere verificación de token)
router.get('/clientes/me', verifyToken, (req, res) => {
  connection.query(
    'SELECT * FROM Clientes WHERE id_cliente = ?',
    [req.userId],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(404).send('Cliente no encontrado');
      }
      res.json(results[0]);
    }
  );
});

// Puedes agregar más rutas para manejar clientes según sea necesario

module.exports = router;

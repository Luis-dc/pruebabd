const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../db');
const router = express.Router();

// Ruta para registrar clientes
router.post('/api/clientes', async (req, res) => {
  const { nombre, direccion, telefono, email, password } = req.body;

  // Verificar si el email ya está registrado
  connection.query('SELECT * FROM Clientes WHERE email = ?', [email], async (error, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo cliente en la base de datos
    const query = 'INSERT INTO Clientes (nombre, direccion, telefono, email, password) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nombre, direccion, telefono, email, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error al registrar cliente' });
      }
      res.status(201).json({ message: 'Cliente registrado exitosamente' });
    });
  });
});

module.exports = router;

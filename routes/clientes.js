const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    connection.query('SELECT * FROM Clientes WHERE email = ?', [email], async (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error en la consulta' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      const cliente = results[0];
  
      const match = await bcrypt.compare(password, cliente.password);
      if (!match) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      // Generar un token JWT
      const token = jwt.sign({ id: cliente.id, email: cliente.email }, 'firma', { expiresIn: '1h' });
  
      res.json({ message: 'Inicio de sesión exitoso', token });
    });
  });

module.exports = router;

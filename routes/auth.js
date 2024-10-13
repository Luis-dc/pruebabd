const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db'); // Asegúrate de tener la conexión a la base de datos
const router = express.Router();

// Configuración de JWT
const SECRET_KEY = process.env.JWT_SECRET || 'claveec2'; // Cambia esto por una clave más segura y almacénala en un lugar seguro

// Middleware de verificación del token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtén el token del encabezado

  if (!token) {
    return res.status(403).send('Se requiere autenticación');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Token no válido');
    }
    req.userId = decoded.userId; // Almacena el ID del usuario en la solicitud
    next();
  });
};

// Ruta para registro de clientes
router.post('/register', (req, res) => {
  const { nombre, direccion, telefono, email, password } = req.body;

  // Validar los campos requeridos
  if (!nombre || !direccion || !telefono || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Hashear la contraseña
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send('Error al registrar el cliente');
    }

    connection.query(
      'INSERT INTO Clientes (nombre, direccion, telefono, email, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, direccion, telefono, email, hash],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Error al registrar el cliente' });
        }
        res.status(201).json({ message: 'Cliente registrado con éxito' });
      }
    );
  });
});

// Ruta para inicio de sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  connection.query(
    'SELECT * FROM Clientes WHERE email = ?',
    [email],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(401).send('Credenciales incorrectas');
      }

      const cliente = results[0];

      // Comparar contraseñas
      bcrypt.compare(password, cliente.password, (err, match) => {
        if (err || !match) {
          return res.status(401).send('Credenciales incorrectas');
        }

        // Generar un token JWT
        const token = jwt.sign({ userId: cliente.id_cliente }, SECRET_KEY, {
          expiresIn: '1h',
        });

        res.json({ token });
      });
    }
  );
});

// Exportar el router y el middleware
module.exports = {
  router,
  verifyToken,
};

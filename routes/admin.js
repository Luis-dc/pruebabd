const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { crearProducto, actualizarProducto, pedidosProducto } = require('../controllers/productoController'); // Importa las funciones del controlador
const connection = require('../db');
const router = express.Router();

// Configuración de JWT
const SECRET_KEY = process.env.JWT_SECRET || 'claveec2';

// Middleware de verificación del token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Se requiere autenticación');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Token no válido');
    }
    req.userId = decoded.userId;
    next();
  });
};

// Registro de administradores
router.post('/admin/register', async (req, res) => {
  const { user, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      'INSERT INTO admins (user, password) VALUES (?, ?)',
      [user, hashedPassword],
      (error, results) => {
        if (error) {
          return res.status(500).send('Error al registrar el administrador');
        }
        res.status(201).json({ message: 'Administrador registrado con éxito' });
      }
    );
  } catch (err) {
    console.error('Error al registrar el administrador:', err);
    res.status(500).send('Error al registrar el administrador');
  }
});

// Inicio de sesión del administrador
router.post('/admin/login', (req, res) => {
  const { user, password } = req.body;

  connection.query(
    'SELECT * FROM admins WHERE user = ?',
    [user],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(401).send('Credenciales incorrectas');
      }

      const admin = results[0];

      bcrypt.compare(password, admin.password, (err, match) => {
        if (err || !match) {
          return res.status(401).send('Credenciales incorrectas');
        }

        const token = jwt.sign({ userId: admin.id_admin }, SECRET_KEY, {
          expiresIn: '1h',
        });

        res.json({ token });
      });
    }
  );
});

// Crear producto (requiere verificación de token)
router.post('/admin/productos', crearProducto);

// Actualizar producto (requiere verificación de token)
router.put('/admin/productos/:id_producto', actualizarProducto);

// Eliminar producto (requiere verificación de token)
router.get('/admin/productos/pedidos', pedidosProducto);

module.exports = router;

// routes/admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db'); // Asegúrate de tener la conexión a la base de datos
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

router.post('/admin/register', async (req, res) => {
    const { user, password } = req.body;

    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo administrador en la base de datos
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


// Ruta para inicio de sesión del administrador
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

// Ruta para insertar productos (requiere verificación de token)
router.post('/admin/productos', (req, res) => {
  const { nombre, descripcion, precio, id_categoria, stock, imagen_url } = req.body; // Asegúrate de que recibes estos campos

  // Consulta para insertar en la tabla Productos
  connection.query(
    'INSERT INTO Productos (nombre, descripcion, precio, id_categoria, stock, imagen_url) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, descripcion, precio, id_categoria, stock, imagen_url],
    (error, results) => {
      if (error) {
        return res.status(500).send('Error al insertar el producto');
      }
      res.json({ message: 'Producto insertado con éxito', id_producto: results.insertId });
    }
  );
});

// Exportar el router
module.exports = router;

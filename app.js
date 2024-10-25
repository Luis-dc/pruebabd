const express = require('express');
const connection = require('./db'); // Importa el archivo de conexión
const cors = require('cors');
const clientesRoutes = require('./routes/clientes');
const { router: authRoutes, verifyToken } = require('./routes/auth');
const adminRoutes = require('./routes/admin');
//const carritoRoutes = require('./routes/carritoRoutes');
//const productoController = require('./controllers/productoController');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta para obtener productos (sin necesidad de verificación de token)
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM Productos', (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

// Ruta para realizar una compra (requiere verificación de token)
app.post('/api/comprar', verifyToken, (req, res) => {
  const { total, direccion_envio, id_metodo_pago, detalles } = req.body; // Asegúrate de que detalles sea un array de objetos

  // Insertar en la tabla Ventas
  connection.query(
    'INSERT INTO Ventas (id_cliente, total, direccion_envio, id_metodo_pago) VALUES (?, ?, ?, ?)',
    [req.userId, total, direccion_envio, id_metodo_pago],
    (error, results) => {
      if (error) {
        return res.status(500).send('Error al realizar la compra');
      }

      const id_venta = results.insertId; // Obtener el ID de la venta insertada

      // Insertar en la tabla Detalles_Venta
      const detalleQueries = detalles.map(detalle => {
        return new Promise((resolve, reject) => {
          const { id_producto, cantidad, precio_unitario } = detalle;
          connection.query(
            'INSERT INTO Detalles_Venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [id_venta, id_producto, cantidad, precio_unitario],
            (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      });

      // Esperar a que se inserten todos los detalles
      Promise.all(detalleQueries)
        .then(() => res.json({ message: 'Compra realizada con éxito' }))
        .catch((error) => res.status(500).send('Error al registrar detalles de la compra'));
    }
  );
});

// Usar las rutas de clientes con prefijo /api
app.use('/api', clientesRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
//app.use('/api', carritoRoutes);
//app.use('/api/admin', productoRoutes);

app.listen(3000, () => {
  console.log('Server on port 3000');
});


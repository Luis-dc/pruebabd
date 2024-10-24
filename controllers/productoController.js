const connection = require('../db'); // Asegúrate de tener la conexión correcta

// Crear un producto
const crearProducto = (req, res) => {
  const { nombre, descripcion, precio, id_categoria, stock, imagen_url } = req.body;

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
};

// Actualizar un producto
const actualizarProducto = (req, res) => {
  const { id_producto } = req.params;
  const { nombre, descripcion, precio, id_categoria, stock, imagen_url } = req.body;

  connection.query(
    'UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, stock = ?, imagen_url = ? WHERE id_producto = ?',
    [nombre, descripcion, precio, id_categoria, stock, imagen_url, id_producto],
    (error, results) => {
      if (error) {
        return res.status(500).send('Error al actualizar el producto');
      }
      res.json({ message: 'Producto actualizado con éxito' });
    }
  );
};

// Mostrar pedidos
const pedidosProducto = (req, res) => {
  // Consulta SQL para obtener los pedidos y detalles de ventas
  const sqlQuery = `
    SELECT
      v.id_venta,
      v.fecha_venta,
      v.total,
      v.direccion_envio,
      p.nombre AS Nombre_Producto,
      c.nombre AS Nombre_Cliente,
      d.cantidad,
      d.precio_unitario
    FROM
      Ventas v
    JOIN Detalles_Venta d ON v.id_venta = d.id_venta
    JOIN Productos p ON d.id_producto = p.id_producto
    JOIN Clientes c ON v.id_cliente = c.id_cliente
    ORDER BY
      v.fecha_venta DESC;`;

  // Ejecuta la consulta
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      // Maneja errores de consulta
      console.error('Error al obtener los pedidos:', error);
      return res.status(500).json({ message: 'Error al obtener los pedidos' });
    }

    // Enviar los resultados como respuesta
    res.json(results);
  });
};

// Exporta la función
module.exports = {
  crearProducto,
  actualizarProducto,
  pedidosProducto,
};

// carritoController.js

const connection = require('../db');

// Obtener el carrito del cliente
const getCarrito = (req, res) => {
    const idCliente = req.userId; // Obtenemos el ID del cliente desde el token
    connection.query(
        'SELECT c.id_carrito, p.nombre, c.cantidad, p.precio FROM Carrito c JOIN Productos p ON c.id_producto = p.id_producto WHERE c.id_cliente = ?',
        [idCliente],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error al obtener el carrito' });
            }
            res.json(results);
        }
    );
};

// Agregar un producto al carrito
// Agregar un producto al carrito
const addProductoAlCarrito = (req, res) => {
    const idCliente = req.userId; // Obtenemos el ID del cliente desde el token
    const { id_producto, cantidad } = req.body;

    // Validar que la cantidad sea un número mayor que cero
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ message: 'La cantidad debe ser un número mayor que cero.' });
    }

    // Verificar si el producto ya está en el carrito
    connection.query(
        'SELECT * FROM Carritos WHERE id_cliente = ? AND id_producto = ?',
        [idCliente, id_producto],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error al verificar el producto en el carrito' });
            }

            if (results.length > 0) {
                // Si el producto ya está en el carrito, actualizamos la cantidad
                connection.query(
                    'UPDATE Carritos SET cantidad = cantidad + ? WHERE id_cliente = ? AND id_producto = ?',
                    [cantidad, idCliente, id_producto],
                    (error) => {
                        if (error) {
                            return res.status(500).json({ message: 'Error al actualizar el producto en el carrito' });
                        }
                        res.json({ message: 'Cantidad del producto actualizada en el carrito' });
                    }
                );
            } else {
                // Si el producto no está en el carrito, lo agregamos
                connection.query(
                    'INSERT INTO Carritos (id_cliente, id_producto, cantidad) VALUES (?, ?, ?)',
                    [idCliente, id_producto, cantidad],
                    (error) => {
                        if (error) {
                            return res.status(500).json({ message: 'Error al agregar el producto al carrito' });
                        }
                        res.json({ message: 'Producto agregado al carrito' });
                    }
                );
            }
        }
    );
};


// Eliminar un producto del carrito
const removeProductoDelCarrito = (req, res) => {
    const idCliente = req.userId;
    const { id_producto } = req.params;

    connection.query(
        'DELETE FROM Carrito WHERE id_cliente = ? AND id_producto = ?',
        [idCliente, id_producto],
        (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
            }
            res.json({ message: 'Producto eliminado del carrito' });
        }
    );
};

// Vaciar el carrito
const vaciarCarrito = (req, res) => {
    const idCliente = req.userId;

    connection.query(
        'DELETE FROM Carrito WHERE id_cliente = ?',
        [idCliente],
        (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error al vaciar el carrito' });
            }
            res.json({ message: 'Carrito vaciado' });
        }
    );
};

module.exports = {
    getCarrito,
    addProductoAlCarrito,
    removeProductoDelCarrito,
    vaciarCarrito
};

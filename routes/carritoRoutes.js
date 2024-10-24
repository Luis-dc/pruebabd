// carritoRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth'); // Asegúrate de usar el middleware de autenticación
const carritoController = require('../controllers/carritoController');

// Obtener el carrito del cliente
router.get('/carrito', verifyToken, carritoController.getCarrito);

// Agregar un producto al carrito
router.post('/carrito', verifyToken, carritoController.addProductoAlCarrito);

// Eliminar un producto del carrito
router.delete('/carrito/:id_producto', verifyToken, carritoController.removeProductoDelCarrito);

// Vaciar el carrito
router.delete('/carrito', verifyToken, carritoController.vaciarCarrito);

module.exports = router;

// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const verifyToken = require('../middlewares/verifyToken');

// Definir las rutas de productos
router.post('/productos', verifyToken, productoController.insertarProducto);
router.put('/productos/:id', verifyToken, productoController.actualizarProducto);
router.delete('/productos/:id', verifyToken, productoController.eliminarProducto);
router.get('/productos', verifyToken, productoController.obtenerProductos);

module.exports = router;

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  // Verificar si el token está presente
  if (!token) {
    return res.status(403).json({ message: 'Se requiere un token' });
  }

  // Eliminar el prefijo 'Bearer ' si está presente
  const bearerToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

  // Verificar el token
  jwt.verify(bearerToken, 'tu_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.userId = decoded.id; // Guarda el ID del usuario en la solicitud
    next(); // Llama al siguiente middleware o ruta
  });
};

module.exports = verifyToken;

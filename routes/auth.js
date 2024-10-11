const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Se requiere un token' });
  }

  jwt.verify(token, 'tu_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.userId = decoded.id; // Guarda el ID del usuario en la solicitud
    next();
  });
};

module.exports = verifyToken;

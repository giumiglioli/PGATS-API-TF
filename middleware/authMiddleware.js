const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

function authMiddleware(req, res, next) {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token não informado.' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
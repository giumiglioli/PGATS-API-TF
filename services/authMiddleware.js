const userService = require('./userService');

function authMiddleware(req, res, next) {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token não informado.' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }
  const user = userService.findByToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
  req.user = user;
  next();
}

module.exports = authMiddleware;
const { users } = require('../models/userModel');
const crypto = require('crypto');

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'Usuário já registrado.' });
  }
  const user = {
    id: crypto.randomUUID(),
    username,
    password, // Em produção, use hash!
  };
  users.push(user);
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }
  // Token simples em memória
  user.token = crypto.randomUUID();
  res.json({ token: user.token });
}

module.exports = { register, login };
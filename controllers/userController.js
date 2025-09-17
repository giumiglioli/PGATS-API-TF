const { users } = require('../models/userModel');
const crypto = require('crypto');
const userService = require('../services/userService');

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  try {
    const { error } = userService.register({ username, password });
    if (error) {
      return res.status(409).json({ message: error });
    }
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (err) {
    if (err.message === 'Usuário já registrado.') {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  const { user, error } = userService.authenticate({ username, password });
  if (error) {
    return res.status(401).json({ message: error });
  }
  res.json({ token: user.token });
}

module.exports = { register, login };
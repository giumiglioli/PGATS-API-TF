const { users } = require('../models/userModel');
const crypto = require('crypto');
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

function register(req, res) {
  const { username, lastname, password } = req.body;
  if (!username || !lastname || !password) {
    return res.status(400).json({ message: 'Usuário, sobrenome e senha são obrigatórios.' });
  }
  try {
    const { error } = userService.register({ username, lastname, password });
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
  try {
    const { user, error } = userService.authenticate({ username, password });
    if (error) {
      return res.status(401).json({ message: error });
    }
    // Gera JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
    res.json({ username: user.username, lastname: user.lastname, token });
  } catch (err) {
    if (err.message === 'Credenciais inválidas.') {
      return res.status(401).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login };
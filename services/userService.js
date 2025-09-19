const { users } = require('../models/userModel');
const crypto = require('crypto');

const userService = {
  findByUsername: (username) => users.find(u => u.username === username),
  findByToken: (token) => users.find(u => u.token === token),
  register: ({ username, lastname, password }) => {
    if (userService.findByUsername(username)) {
      return { error: 'Usuário já registrado.' };
    }
    const user = {
      id: crypto.randomUUID(),
      username,
      lastname,
      password, // Em produção, use hash!
    };
    users.push(user);
    return { user };
  },
  authenticate: ({ username, password }) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return { error: 'Credenciais inválidas.' };
    user.token = crypto.randomUUID();
    return { user };
  }
};

module.exports = userService;

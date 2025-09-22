const request = require('supertest');
const { expect } = require('chai');

const url = 'http://localhost:4000';

const username = `Giuliana${Date.now()}`;
const lastname = 'Miglioli';
const password = 'qwerty123';

describe('GraphQL - Registro e Login de Usuário', () => {
  it('deve registrar e logar um novo usuário, retornando o token', async () => {
    // 1. Registrar usuário
    const registerMutation = `
      mutation {
        registerUser(username: "${username}", lastname: "${lastname}", password: "${password}") {
          username
          lastname
        }
      }
    `;
    const registerResponse = await request(url)
      .post('/graphql')
      .send({ query: registerMutation });

    expect(registerResponse.body).to.have.nested.property('data.registerUser.username', username);
    expect(registerResponse.body).to.have.nested.property('data.registerUser.lastname', lastname);

    // 2. Logar usuário
    const loginQuery = `
      query {
        login(username: "${username}", password: "${password}") {
          token
        }
      }
    `;
    const loginResponse = await request(url)
      .post('/graphql')
      .send({ query: loginQuery });

    expect(loginResponse.body).to.have.nested.property('data.login.token');
    expect(loginResponse.body.data.login.token).to.be.a('string').and.to.have.length.greaterThan(10);
  });
});
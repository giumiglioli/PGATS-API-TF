//Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');

//Aplicação
const app = require('../../app');

//Testes do controller de usuário - sem uso do sinon/ essa rota não tem autenticação.
//1 - registro de novo usuário
//2 - registro de usuário já existente
describe('User Controller', () => {
    describe('POST /api/users/register', () => {
        it('Quando preencho os dados de um novo usuário, registro ele e tenho 201 ', async () => {
            const resposta = await request(app)
                .post('/api/users/register')
                .send({
                username: 'Giuliana',
                password: 'qwerty123'
            }); //send
        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('message', 'Usuário registrado com sucesso.');
        });//it

        it('Quando tento registrar um usuário já existente, recebo 409', async () => {
            const resposta = await request(app)
                .post('/api/users/register')
                .send({
                username: 'Giuliana',
                password: 'blablabla'
            }); //send
        expect(resposta.status).to.equal(409);
        expect(resposta.body).to.have.property('message', 'Usuário já registrado.');
        }); //it
    });//describe 'POST /api/users/register

    describe('POST /api/users/login', () => {
        //its para testes de login
    });
}); //describe 'User Controller

//Fim do arquivo
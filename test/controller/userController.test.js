//Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');

//Aplicação
const app = require('../../app');

//Mock
const userService = require('../../services/userService');

//Testes do controller de usuário - sem uso do sinon/ essa rota não tem autenticação.
//1 - registro de novo usuário 201
//2 - registro de usuário já existente - 409
//3 - registro de usuário com dados incompletos/sem dados - 400
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

        it('Usando Mock: Quando tento registrar um usuário já existente, recebo 409', async () => {
            //Mockando a função register do userService
            const userServiceMock = sinon.stub(userService, 'register');
                userServiceMock.throws(new Error('Usuário já registrado.'));
            const resposta = await request(app)
                .post('/api/users/register')
                .send({
                username: 'Giuliana',
                password: 'blablabla'
            }); //send
        expect(resposta.status).to.equal(409);
        expect(resposta.body).to.have.property('message', 'Usuário já registrado.');

        //Reseto o Mock
        sinon.restore();
        }); //it

/* Mesmo cenário está acima - sem mock.*/
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

    //ERRO 400
    it('Usando Mock: Quando tento registrar um usuário sem fornecer os dados, recebo 400', async () => {
        //Mockando a função register do userService
        const userServiceMock = sinon.stub(userService, 'register');
            userServiceMock.throws(new Error('Usuário e senha são obrigatórios.'));
        const resposta = await request(app)
            .post('/api/users/register')
            .send({
            username: '',
            password: ''
        }); //send
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('message', 'Usuário e senha são obrigatórios.');

    //Reseto o Mock
    sinon.restore();
    }); //it

/* Mesmo teste usando mock. */
    it('Quando tento registrar um usuário sem fornecer os dados, recebo 400', async () => {
        const resposta = await request(app)
            .post('/api/users/register')
            .send({
            username: '',
            password: ''
        }); //send
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('message', 'Usuário e senha são obrigatórios.');
    }); //it 
    });//describe 'POST /api/users/register

    describe('POST /api/users/login', () => {
        //its para testes de login
    });
}); //describe 'User Controller'

//Fim do arquivo
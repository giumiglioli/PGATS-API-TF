//Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');

//Aplicação
const app = require('../../app');

//Mock
const userService = require('../../services/userService');


//REGISTER
//1 - registro de novo usuário 201
//2 - registro de usuário já existente - 409 (normal e mockado)
//3 - registro de usuário com dados incompletos/sem dados - 400 (normal e mockado)
//LOGIN
//4 - login com dados corretos - 200
//5 - login com dados incorretos - 401
//6 - login com dados incompletos/sem dados - 400
describe('User Controller', () => {
    describe('POST /api/users/register', () => {
        it('Quando preencho os dados de um novo usuário, registro ele e tenho 201 ', async () => {
            const resposta = await request(app)
                .post('/api/users/register')
                .send({
                username: 'Giuliana',
                lastname: 'Miglioli',
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
                lastname: 'Miglioli',
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
                lastname: 'Miglioli',
                password: 'blablabla'
            }); //send
        expect(resposta.status).to.equal(409);
        expect(resposta.body).to.have.property('message', 'Usuário já registrado.');
        }); //it 

    //ERRO 400
    it('Usando Mock: Quando tento registrar um usuário sem fornecer os dados, recebo 400', async () => {
        //Mockando a função register do userService
        const userServiceMock = sinon.stub(userService, 'register');
            userServiceMock.throws(new Error('Usuário, sobrenome e senha são obrigatórios.'));
        const resposta = await request(app)
            .post('/api/users/register')
            .send({
            username: '',
            lastname: '',
            password: ''
        }); //send
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('message', 'Usuário, sobrenome e senha são obrigatórios.');

    //Reseto o Mock
    sinon.restore();
    }); //it


    it('Quando tento registrar um usuário sem fornecer os dados, recebo 400', async () => {
        const resposta = await request(app)
            .post('/api/users/register')
            .send({
            username: '',
            lastname: '',
            password: ''
        }); //send
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('message', 'Usuário, sobrenome e senha são obrigatórios.');
    }); //it 
    });//describe 'POST /api/users/register


//Testes de login
    describe('POST /api/users/login', () => {
        it('Quando faço login com os dados corretos, recebo 200 e o token', async() => {
            const resposta = await request(app)
            .post('/api/users/login')
            .send({
            username: 'Giuliana',
            password: 'qwerty123'
        }); //send
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('username', 'Giuliana'); //verifica se o username do body do response é igual a Giuliana
    expect(resposta.body).to.have.property('token'); //verifica se tem a propriedade token no body do response
    //console.log(resposta.body);
        }); //it

        it('Quando faço login com os dados incorretos, recebo 401', async () => {
            const resposta = await request(app)
            .post('/api/users/login')
            .send({
            username: 'Miglioli',
            password: 'lalalala'
        }); //send
    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property('message', 'Credenciais inválidas.');

        }); //it
        
        it('Quando faço login com os dados incompletos/sem dados, recebo 400 ', async () => {
            const resposta = await request(app)
            .post('/api/users/login')
            .send({
            username: '',
            password: ''
        }); //send
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('message', 'Usuário e senha são obrigatórios.');

        }); //it
    });
}); //describe 'User Controller'

//Fim do arquivo
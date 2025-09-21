//Bibliotecas
const request = require('supertest');
const {expect} = require('chai');

//Comentários sobre os testes - Esses testes não precisam de autenticação. Eles apenas registram o usuário e fazem login.
//REGISTER
//1 - registro de novo usuário 201
//2 - registro de usuário já existente - 409
//3 - registro de usuário com dados incompletos/sem dados - 400
//LOGIN
//4 - login com dados corretos - 200
//5 - login com dados incorretos - 401
//6 - login com dados incompletos/sem dados - 400

//Variaveis a serem usadas em vários testes
let nomeeUsuariounico = `Giuliana_${Date.now()}`; //Gero um nome de usuário único a cada execução dos testes para evitar conflito de usuário já existente


describe('User External', () => {
    describe('POST /api/users/register', () => {
        it('Quando preencho os dados de um novo usuário, registro ele e tenho 201 ', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/api/users/register')
                .send({
                username: nomeeUsuariounico,
                lastname: 'Miglioli',
                password: 'qwerty123'
            }); //send
        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('message', 'Usuário registrado com sucesso.');
        });//it


        it('Quando tento registrar um usuário já existente, recebo 409', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/api/users/register')
                .send({
                username: nomeeUsuariounico,
                lastname: 'Miglioli',
                password: 'blablabla'
            }); //send
        expect(resposta.status).to.equal(409);
        expect(resposta.body).to.have.property('message', 'Usuário já registrado.');
        }); //it

    //ERRO 400
    it('Quando tento registrar um usuário sem fornecer os dados, recebo 400', async () => {
        const resposta = await request('http://localhost:3000')
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
            const resposta = await request('http://localhost:3000')
            .post('/api/users/login')
            .send({
            username: nomeeUsuariounico,
            password: 'qwerty123'
        }); //send
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('username', nomeeUsuariounico); //verifica se o username do body do response é igual a Giuliana2
    expect(resposta.body).to.have.property('lastname', 'Miglioli'); //verifica se o lastname do body do response é igual a Miglioli
    expect(resposta.body).to.have.property('token'); //verifica se tem a propriedade token no body do response
    console.log(resposta.body);
        }); //it

        it('Quando faço login com os dados incorretos, recebo 401', async () => {
            const resposta = await request('http://localhost:3000')
            .post('/api/users/login')
            .send({
            username: 'Miglioli',
            password: 'lalalala'
        }); //send
    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property('message', 'Credenciais inválidas.');

        }); //it
        
        it('Quando faço login com os dados incompletos/sem dados, recebo 400 ', async () => {
            const resposta = await request('http://localhost:3000')
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
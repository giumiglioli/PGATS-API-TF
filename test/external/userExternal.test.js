//Bibliotecas
const request = require('supertest');
const {expect} = require('chai');

//Testes do controller de usuário - sem uso do sinon/ essa rota não tem autenticação.
//1 - registro de novo usuário
//2 - registro de usuário já existente (Mock/ sem o mock está comentado)
describe('User External', () => {
    describe('POST /api/users/register', () => {
        it('Quando preencho os dados de um novo usuário, registro ele e tenho 201 ', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/api/users/register')
                .send({
                username: 'Giuliana',
                password: 'qwerty123'
            }); //send
        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('message', 'Usuário registrado com sucesso.');
        });//it


        it('Quando tento registrar um usuário já existente, recebo 409', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/api/users/register')
                .send({
                username: 'Giuliana',
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
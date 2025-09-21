//Bibliotecas
const request = require('supertest');
const {expect} = require('chai');

//Planejamento dos testes - Nem todos foram desenvolvidos. Mas foram adicionados como placeholders para futuras implementações.
//TESTES QUE PRECISAM DE AUTENTICAÇÃO
//1 - criar nova receita - 201
//2 - editar receita - 200 (se dono) ou 403 (se não dono) ou 404 (se não existir)
//3 - remover receita - 204 (se dono) ou 403 (se não dono) ou 404 (se não existir)


//TESTES QUE NÃO PRECISAM DE AUTENTICAÇÃO
//4 - Listar receitas - 200 sempre
//5 - receitas por id - 200 (se existir) ou 404 (se não existir) --IGNORING ON TESTS --
//6 - ingredientes por id - 200 (se existir) ou 404 (se não existir) -- IGNORING ON TESTS --


//Variavel para ser usada em vários testes de receita
let receitaid;
let tokenUsuarioResponsavel;
let tokenOutroUsuario;
//Criação do usuário que será responsável pela receita: Criação edição e deleção e de outro que tentará editar e deletar a receita sem sucesso.
before(async () => {
    //Usuário responsável pela criação/ edição e deleção da receita 
    const nomeeUsuarioResponsavel = `Giuliana_${Date.now()}`; //Gero um nome de usuário único a cada execução dos testes para evitar conflito de usuário já existente
    await request('http://localhost:3000')
        .post('/api/users/register')
        .send({
        username: nomeeUsuarioResponsavel,
        lastname: 'Miglioli',   
        password: 'qwerty123'
        }); //send

    //Faço login para pegar o token
        const loginResp = await request('http://localhost:3000')
        .post('/api/users/login')
        .send({
        username: nomeeUsuarioResponsavel,  
        password: 'qwerty123'
        }); //send

    tokenUsuarioResponsavel = loginResp.body.token; //token do usuário responsável pela receita

    // Criação do outro Usuario, sem permissão para editar e deletar a receita
    const nomeeOutroUsuario = `OutroUsuario_${Date.now()}`; //Gero um nome de usuário único a cada execução dos testes para evitar conflito de usuário já existente
    await request('http://localhost:3000')
        .post('/api/users/register')
        .send({
        username: nomeeOutroUsuario,
        lastname: 'Tester',   
        password: 'qwerty456'
        }); //send

    //Faço login para pegar o token
        const loginRespOutro = await request('http://localhost:3000')
        .post('/api/users/login')
        .send({
        username: nomeeOutroUsuario,  
        password: 'qwerty456'
        }); //send
        
    tokenOutroUsuario = loginRespOutro.body.token; //token do outro usuário
}); //fim do before


describe('Receitas External', () => {
    describe('POST /api/recipes', () => {
        it('Quando crio uma nova receita com dados válidos, recebo 201 e o json da receita criada', async () => {

            const resposta = await request('http://localhost:3000')
                .post('/api/recipes')
                .set('Authorization', `Bearer ${tokenUsuarioResponsavel}`) //seto o token no header
                .send({
                nome: 'Bolo de cenoura',
                ingredientes: ['3 ovos', '2 xícaras de açúcar', '2 xícaras de farinha de trigo', '1 cenoura grande ralada', '1 colher de sopa de fermento em pó'],
                Preparo: 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.'
            }); //send
        expect(resposta.status).to.equal(201);

        //Resposta usando fixture
        const respostaEsperada = require('../fixture/respostaReceitas/quandoCrioReceitaComDadosValidosComsucesso201.json');
        receitaid = resposta.body.id; //pego o id da receita criada para usar nos próximos testes
        
        delete respostaEsperada.id; //deletando o id do json esperado, pois ele é gerado a cada receita e não há necessidade de testar o id
        delete resposta.body.id; //deletando o id do json retornado, pois ele é gerado a cada receita e não há necessidade de testar o id
        delete respostaEsperada.userId; //deletando o userId do json esperado, pois não há necessidade de testar o userId
        delete resposta.body.userId; //deletando o userId do json retornado, pois não há necessidade de testar o userId 


        expect(resposta.body).to.deep.equal(respostaEsperada);
        //console.log(resposta.body);

        }); //it

    }); //fim do describe 'POST /api/recipes
    describe('PUT /api/recipes/:id', () => {
        it('Quando edito uma receita que eu criei, recebo 200 e o json da receita editada', async () => {




        }); //it
        it('Quando tento editar uma receita que não existe, recebo 404', async () => {

        }); //it
        it('Quando tento editar uma receita que não é minha, recebo 403', async () => {}); //it

    }); //fim do describe 'PUT /api/recipes/:id

    describe('DELETE /api/recipes/:id', () => {
        it('Quando deleto uma receita que eu criei, recebo 204', async () => {}); //it
        it('Quando tento deletar uma receita que não existe, recebo 404', async () => {}); //it
        it('Quando tento deletar uma receita que não é minha, recebo 403', async () => {}); //it

    }); //fim do describe 'DELETE /api/recipes/:id

    //Testes que não precisam de autenticação
    describe('GET /api/recipes', () => {
        it('Quando listo todas as receitas, recebo 200 e a lista de receitas - se array vazio não tem receita', async () => {}); //it
    }); //fim do describe 'GET /api/recipes

}); //fim do descrive Receitas Controller
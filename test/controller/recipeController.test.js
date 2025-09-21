//Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');

//Aplicação
const app = require('../../app');

//Mock
const recipeService = require('../../services/recipeService');

//Planejamento dos testes - Nem todos foram desenvolvidos. Mas foram adicionados como placeholders para futuras implementações.
//TESTES QUE PRECISAM DE AUTENTICAÇÃO
//1 - criar nova receita - 201 (normal e mockado) - feito
//2 - editar receita - 200 (se dono) ou 403 (se não dono) ou 404 (se não existir) (normal e mockado)
//3 - remover receita - 204 (se dono) ou 403 (se não dono) ou 404 (se não existir) (normal e mockado)

//TESTES QUE NÃO PRECISAM DE AUTENTICAÇÃO
//4 - Listar receitas - 200 sempre ou mostra um array com as receitas ou um array vazio se  não tiver receita

//5 - receitas por id - 200 (se existir) ou 404 (se não existir) (normal e mockado)
//6 - ingredientes por id - 200 (se existir) ou 404 (se não existir) (normal e mockado)
//------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Variaveis a ser usada para todos os testes
//Criação de usuários e tokens na seção before

let receitaid, userId;
let tokenUsuarioResponsavel;
let tokenOutroUsuario;
//Criação do usuário que será responsável pela receita: Criação edição e deleção e de outro que tentará editar e deletar a receita sem sucesso.
//Adicionei aqui pois estava tendo muitos problemas com a ordem de execução dos testes.
before(async () => {
    //Usuário responsável pela criação/ edição e deleção da receita 
    await request(app)
        .post('/api/users/register')
        .send({
        username: `Giuliana_RR`,
        lastname: 'Miglioli',
        password: 'qwerty123'
        }); //send

    //Faço login para pegar o token
        const loginResp = await request(app)
        .post('/api/users/login')
        .send({
        username: `Giuliana_RR`,
        password: 'qwerty123'
        }); //send

    tokenUsuarioResponsavel = loginResp.body.token; //token do usuário responsável pela receita
    //console.log('Token do usuário responsável pela receita:', tokenUsuarioResponsavel);
    
    // Criação do outro Usuario, sem permissão para tentar editar e deletar a receita
    await request(app)
        .post('/api/users/register')
        .send({
        username: `OutroUsuario_NR`,
        lastname: 'Tester',
        password: 'qwerty456'
        }); //send

    //Faço login para pegar o token
        const loginRespOutro = await request(app)
        .post('/api/users/login')
        .send({
        username: `OutroUsuario_NR`,
        password: 'qwerty456'
        }); //send
        
    tokenOutroUsuario = loginRespOutro.body.token; //token do outro usuário
    //console.log('Token do outro usuário:', tokenOutroUsuario);
});

//INICIO DOS TESTES
describe('Receipt Controller', () => {
    describe('POST /api/recipes', () => {
        it('Quando crio uma nova receita com dados válidos, recebo 201 e o json da receita criada', async () => {            
            const resposta = await request(app)
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
        userId = resposta.body.userId; //pego o userId da receita criada para usar nos próximos testes

        delete respostaEsperada.id; //deletando o id do json esperado, pois ele é gerado a cada receita e não há necessidade de testar o id
        delete resposta.body.id; //deletando o id do json retornado, pois ele é gerado a cada receita e não há necessidade de testar o id
        delete respostaEsperada.userId; //deletando o userId do json esperado, pois não há necessidade de testar o userId
        delete resposta.body.userId; //deletando o userId do json retornado, pois não há necessidade de testar o userId

        expect(resposta.body).to.deep.equal(respostaEsperada); 

        }); //it
        it('Usando mock: Quando crio uma nova receita com dados válidos, recebo 201 e o json receita criada', async () => {
            const recipeServiceMock = sinon.stub(recipeService, 'create');
            recipeServiceMock.returns({
                "nome": 'Bolo de cenoura mockado',
                "ingredientes": ['3 ovos', '2 xícaras de açúcar', '2 xícaras de farinha de trigo', '1 cenoura grande ralada', '1 colher de sopa de fermento em pó'],
                "Preparo": 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.',
                "userId": 1,
                "id": 1
            });

            const resposta = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${tokenUsuarioResponsavel}`) //seto o token no header
                .send({
                nome: 'Bolo de cenoura mockado',
                ingredientes: ['3 ovos', '2 xícaras de açúcar', '2 xícaras de farinha de trigo', '1 cenoura grande ralada', '1 colher de sopa de fermento em pó'],
                Preparo: 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.',
                }); //send

            expect(resposta.status).to.equal(201);
            //console.log(resposta.body);
            expect(resposta.body).to.have.property('nome', 'Bolo de cenoura mockado');

            //Reseto o Mock
            sinon.restore();

        }); //it
    }); //fim do describe 'POST /api/recipes


    describe('PUT /api/recipes/:id', () => {
        it('Quando edito uma receita que eu criei, recebo 200 e o json da receita editada', async () => {
           }); //it
        it('Quando tento editar uma receita que não existe, recebo 404', async () => {

        }); //it
        it('Quando tento editar uma receita que não é minha, recebo 403', async () => {}); //it

        //Mesmo testes usando mock
        it('Usando mock: Quando edito uma receita que eu criei, recebo 200 e o json receita editada', async () => {}); //it
        it('Usando mock: Quando tento editar uma receita que não existe, recebo 404', async () => {}); //it
        it('Usando mock: Quando tento editar uma receita que não é minha, recebo 403', async () => {}); //it
    }); //fim do describe 'PUT /api/recipes/:id

    describe('DELETE /api/recipes/:id', () => {
        it('Quando deleto uma receita que eu criei, recebo 204', async () => {}); //it
        it('Quando tento deletar uma receita que não existe, recebo 404', async () => {}); //it
        it('Quando tento deletar uma receita que não é minha, recebo 403', async () => {}); //it

        //Mesmo testes usando mock
        it('Usando mock: Quando deleto uma receita que eu criei, recebo 204', async () => {}); //it
        it('Usando mock: Quando tento deletar uma receita que não existe, recebo 404', async () => {}); //it
        it('Usando mock: Quando tento deletar uma receita que não é minha, recebo 403', async () => {}); //it
    }); //fim do describe 'DELETE /api/recipes/:id

    //Testes que não precisam de autenticação
    describe('GET /api/recipes', () => {
        it('Quando listo todas as receitas, recebo 200 e a lista de receitas - se array vazio não tem receita', async () => {
            const resposta = await request(app)
                .get('/api/recipes')
                .send(); //send
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array'); //verifica se o body do response é um array
            //console.log(resposta.body);

        }); //it


    }); //fim do describe 'GET /api/recipes

    describe('GET /api/recipes/:id', () => {
        it('Quando busco uma receita que existe, recebo 200 e o json da receita', async () => {}); //it
        it('Quando busco uma receita que não existe, recebo 404', async () => {}); //it

        //Mesmo testes usando mock
        it('Usando mock: Quando busco uma receita que existe, recebo 200 e o json da receita', async () => {}); //it
        it('Usando mock: Quando busco uma receita que não existe, recebo 404', async () => {}); //it
    });

}); //fim do descrive Receitas Controller
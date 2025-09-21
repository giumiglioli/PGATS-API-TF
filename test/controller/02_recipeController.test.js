//Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');

//Aplicação
const app = require('../../app');

//Mock
const recipeService = require('../../services/recipeService');

//TESTES QUE PRECISAM DE AUTENTICAÇÃO
//1 - criar nova receita - 201 (normal e mockado)
//2 - editar receita - 200 (se dono) ou 403 (se não dono) ou 404 (se não existir) (normal e mockado)
//3 - remover receita - 204 (se dono) ou 403 (se não dono) ou 404 (se não existir) (normal e mockado)

//TESTES QUE NÃO PRECISAM DE AUTENTICAÇÃO
//4 - Listar receitas - 200 sempre ou mostra um array com as receitas ou um array vazio se  não tiver receita

//5 - receitas por id - 200 (se existir) ou 404 (se não existir) (normal e mockado) -- IGNORING THESE TESTS for now --
//6 - ingredientes por id - 200 (se existir) ou 404 (se não existir) (normal e mockado) -- IGNORING ON TESTS for now --

//Variaveis a ser usada para todos os testes
let receitaid;

describe('Receitas Controller', () => {
    describe('POST /api/recipes', () => {
        it('Quando crio uma nova receita com dados válidos, recebo 201 e o json da receita criada', async () => {
            //Primeiro faço login para pegar o token, o usuário foi criado anteriormente nos testes de userController. Por isso renomeei os arquivos. Para garantir que o teste de usuário rode primeiro. 
            //De acordo com a minha pesquisa, o Mocha roda os testes em ordem alfabética. Decidi seguir com essa solução mais simples para focar nas execuções dos testes.
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                username: 'Giuliana',
                password: 'qwerty123'
            }); //send
            
        const token = respostaLogin.body.token; //token do usuário

            const resposta = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${token}`) //seto o token no header
                .send({
                nome: 'Bolo de cenoura',
                ingredientes: ['3 ovos', '2 xícaras de açúcar', '2 xícaras de farinha de trigo', '1 cenoura grande ralada', '1 colher de sopa de fermento em pó'],
                Preparo: 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.'
            }); //send
        expect(resposta.status).to.equal(201);

          //Resposta usando fixture
        const respostaEsperada = require('../fixture/respostaReceitas/quandoCrioReceitaComDadosValidosComsucesso201.json');
        receitaid = resposta.body.id; //pego o id da receita criada para usar nos próximos testes
        expect(resposta.body).to.deep.equal(respostaEsperada);
        console.log(resposta.body);

     /* Resposta anterior sem o fixture
    expect(resposta.body).to.have.property('nome', 'Bolo de cenoura'); //verifica se o nome da receita do body do response é igual a Bolo de cenoura
    expect(resposta.body).to.have.property('ingredientes');
    expect(resposta.body.ingredientes).to.deep.equal([
        '3 ovos',
        '2 xícaras de açúcar',
        '2 xícaras de farinha de trigo',
        '1 cenoura grande ralada',
        '1 colher de sopa de fermento em pó'
    ]);//verifica se os ingredientes da receita do body do response é igual ao array enviado
    expect(resposta.body).to.have.property('Preparo', 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.'); //verifica se o preparo da receita do body do response é igual ao enviado
    */
        }); //it
        it('Usando mock: Quando crio uma nova receita com dados válidos, recebo 201 e o json receita criada', async () => {

            //login usuário
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                username: 'Giuliana',
                password: 'qwerty123'
            }); //send
            
            const token = respostaLogin.body.token; //token do usuário


            const recipeServiceMock = sinon.stub(recipeService, 'create');
            recipeServiceMock.returns({
                id: '10',
                nome: 'Bolo de cenoura',
                ingredientes: ['3 ovos', '2 xícaras de açúcar', '2 xícaras de farinha de trigo', '1 cenoura grande ralada', '1 colher de sopa de fermento em pó'],
                Preparo: 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.',
                userId: '1'
            });

            const resposta = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${token}`) //seto o token no header
                .send({
                nome: 'Bolo de cenoura',
                ingredientes: ['3 ovos', '2 xícaras de açúcar', '2 xícaras de farinha de trigo', '1 cenoura grande ralada', '1 colher de sopa de fermento em pó'],
                Preparo: 'Bata no liquidificador os ovos, o açúcar e a cenoura. Despeje em uma tigela e adicione a farinha e o fermento. Misture bem e leve ao forno preaquecido a 180°C por cerca de 40 minutos.',
                }); //send

            expect(resposta.status).to.equal(201);
            console.log(resposta.body);
            expect(resposta.body).to.have.property('nome', 'Bolo de cenoura');

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
    //Testes a seguir foram planejados, mas não implementados por enquanto
    describe('GET /api/recipes/:id', () => {
        it('Quando busco uma receita que existe, recebo 200 e o json da receita', async () => {}); //it
        it('Quando busco uma receita que não existe, recebo 404', async () => {}); //it

        //Mesmo testes usando mock
        it('Usando mock: Quando busco uma receita que existe, recebo 200 e o json da receita', async () => {}); //it
        it('Usando mock: Quando busco uma receita que não existe, recebo 404', async () => {}); //it
    });

}); //fim do descrive Receitas Controller
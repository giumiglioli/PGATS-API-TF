//Bibliotecas
const request = require('supertest');
const {expect} = require('chai');

//TESTES QUE PRECISAM DE AUTENTICAÇÃO
//1 - criar nova receita - 201
//2 - editar receita - 200 (se dono) ou 403 (se não dono) ou 404 (se não existir)
//3 - remover receita - 204 (se dono) ou 403 (se não dono) ou 404 (se não existir)


//TESTES QUE NÃO PRECISAM DE AUTENTICAÇÃO
//4 - Listar receitas - 200 sempre
//5 - receitas por id - 200 (se existir) ou 404 (se não existir) --IGNORING ON TESTS --
//6 - ingredientes por id - 200 (se existir) ou 404 (se não existir) -- IGNORING ON TESTS --

describe('Receitas Controller', () => {
    describe('POST /api/recipes', () => {
        it('Quando crio uma nova receita com dados válidos, recebo 201 e o json da receita criada', async () => {

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
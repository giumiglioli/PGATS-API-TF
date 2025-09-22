// graphql/resolvers.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const recipeService = require('../services/recipeService');
const shoppingListService = require('../services/shoppingListService');
const crypto = require('crypto');

module.exports = {
  Query: {
    async login(_, { username, password }) {
      const { user, error } = await userService.authenticate({ username, password });
      if (error) throw new Error(error);
      return {
        username: user.username,
        lastname: user.lastname,
        token: user.token
      };
    },
    recipes: () => recipeService.getAll(),
    recipe: (_, { id }) => recipeService.getById(id),
    recipeIngredients: (_, { id }) => {
      const recipe = recipeService.getById(id);
      return recipe ? recipe.ingredientes : [];
    },
  },
  Mutation: {
    async registerUser(_, { username, lastname, password }) {
      const { user, error } = await userService.register({ username, lastname, password });
      if (error) throw new Error(error);
      return {
        username: user.username,
        lastname: user.lastname
      };
    },
    async transferSomething(_, { data }, context) {
      if (!context.user) throw new Error('Não autenticado');
      // lógica de transferência
      return 'Transferência realizada';
    },
    createRecipe: (_, { nome, ingredientes, Preparo }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const recipe = {
        nome,
        ingredientes,
        Preparo,
        userId: context.user.id
      };
      return recipeService.create(recipe);
    },
    updateRecipe: (_, { id, nome, ingredientes, Preparo }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const recipe = recipeService.getById(id);
      if (!recipe) throw new Error('Receita não encontrada');
      if (recipe.userId != context.user.id) throw new Error('Apenas o dono pode editar');
      const updatedRecipe = {};
      if (nome) updatedRecipe.nome = nome;
      if (ingredientes) updatedRecipe.ingredientes = ingredientes;
      if (Preparo) updatedRecipe.Preparo = Preparo;
      return recipeService.update(Number(id), updatedRecipe);
    },
    deleteRecipe: (_, { id }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const recipe = recipeService.getById(id);
      if (!recipe) throw new Error('Receita não encontrada');
      if (recipe.userId != context.user.id) throw new Error('Apenas o dono pode deletar');
      recipeService.remove(Number(id));
      return true;
    },
    generateShoppingList: (_, { recipeIds }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      const selectedRecipes = recipeIds.map(id => recipeService.getById(id)).filter(Boolean);
      if (selectedRecipes.length === 0) throw new Error('Nenhuma receita encontrada');
      const ingredients = selectedRecipes.flatMap(r => r.ingredientes);
      const list = {
        id: crypto.randomUUID(),
        userId: context.user.id,
        ingredients
      };
      return shoppingListService.create(list);
    },
  },
};

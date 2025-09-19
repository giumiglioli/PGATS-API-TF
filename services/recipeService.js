const { recipes } = require('../models/recipeModel');

let nextRecipeId = 1; // id incremental para receitas

const recipeService = {
  getAll: () => recipes,
  getById: (id) => recipes.find(r => r.id === Number(id)),
  create: (recipe) => {
    recipe.id = nextRecipeId++; // atribui id incremental
    recipes.push(recipe);
    return recipe;
  },
  update: (id, updatedRecipe) => {
    const index = recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updatedRecipe };
      return recipes[index];
    }
    return null;
  },
  remove: (id) => {
    const index = recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      return recipes.splice(index, 1)[0];
    }
    return null;
  }
};

module.exports = recipeService;
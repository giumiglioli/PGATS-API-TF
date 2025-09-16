const { recipes } = require('../models/recipeModel');

const recipeService = {
  getAll: () => recipes,
  getById: (id) => recipes.find(r => r.id === id),
  create: (recipe) => {
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
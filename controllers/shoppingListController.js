const recipeService = require('../services/recipeService');
const shoppingListService = require('../services/shoppingListService');
const crypto = require('crypto');

function generateList(req, res) {
  const { recipeIds } = req.body;
  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return res.status(400).json({ message: 'Informe os IDs das receitas.' });
  }
  const selectedRecipes = recipeIds.map(id => recipeService.getById(id)).filter(Boolean);
  if (selectedRecipes.length === 0) {
    return res.status(404).json({ message: 'Nenhuma receita encontrada.' });
  }
  // Junta ingredientes de todas as receitas
  const ingredients = selectedRecipes.flatMap(r => r.ingredients);
  const list = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    ingredients
  };
  shoppingListService.create(list);
  res.status(201).json(list);
}

module.exports = { generateList };
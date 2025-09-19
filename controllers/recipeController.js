const recipeService = require('../services/recipeService');
const crypto = require('crypto');

function getAllRecipes(req, res) {
  res.json(recipeService.getAll());
}

function getRecipeById(req, res) {
  const recipe = recipeService.getById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Receita não encontrada.' });
  res.json(recipe);
}

function getIngredients(req, res) {
  const recipe = recipeService.getById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Receita não encontrada.' });
  res.json(recipe.ingredientes || []);
}

function createRecipe(req, res) {
  const { nome, ingredientes, Preparo } = req.body;
  if (!nome || !Array.isArray(ingredientes) || !Preparo) {
    return res.status(400).json({ message: 'Nome, ingredientes e Preparo são obrigatórios.' });
  }
  const recipe = {
    nome,
    ingredientes,
    Preparo,
    userId: req.user.id
  };
  recipeService.create(recipe);
  res.status(201).json(recipe);
}

function updateRecipe(req, res) {
  const recipe = recipeService.getById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Receita não encontrada.' });
  if (recipe.userId !== req.user.id) return res.status(403).json({ message: 'Apenas o dono pode editar.' });
  const { nome, ingredientes, Preparo } = req.body;
  const updatedRecipe = {};
  if (nome) updatedRecipe.nome = nome;
  if (Array.isArray(ingredientes)) updatedRecipe.ingredientes = ingredientes;
  if (Preparo) updatedRecipe.Preparo = Preparo;
  const result = recipeService.update(req.params.id, updatedRecipe);
  res.json(result);
}

function deleteRecipe(req, res) {
  const recipe = recipeService.getById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Receita não encontrada.' });
  if (recipe.userId !== req.user.id) return res.status(403).json({ message: 'Apenas o dono pode deletar.' });
  recipeService.remove(req.params.id);
  res.status(204).end();
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  getIngredients,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
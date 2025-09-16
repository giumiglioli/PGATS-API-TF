const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../services/authMiddleware');

router.get('/', recipeController.getAllRecipes); // pública
router.get('/:id', recipeController.getRecipeById); // pública
router.get('/:id/ingredients', recipeController.getIngredients); // pública

router.post('/', authMiddleware, recipeController.createRecipe); // autenticado
router.put('/:id', authMiddleware, recipeController.updateRecipe); // autenticado
router.delete('/:id', authMiddleware, recipeController.deleteRecipe); // autenticado

module.exports = router;
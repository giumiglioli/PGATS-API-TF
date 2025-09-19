const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, shoppingListController.generateList); // autenticado

module.exports = router;
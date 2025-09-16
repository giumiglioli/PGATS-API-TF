const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');

const app = express();

app.use(bodyParser.json());

// Rotas principais
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
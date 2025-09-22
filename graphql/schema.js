// graphql/schema.js
const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    username: String!
    lastname: String!
  }

  type AuthPayload {
    username: String!
    lastname: String!
    token: String!
  }

  type Recipe {
    id: ID!
    nome: String!
    ingredientes: [String!]!
    Preparo: String!
    userId: ID!
  }

  type ShoppingList {
    id: ID!
    userId: ID!
    ingredients: [String!]!
  }

  type Query {
    login(username: String!, password: String!): AuthPayload
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
    recipeIngredients(id: ID!): [String!]!
  }

  type Mutation {
    registerUser(username: String!, lastname: String!, password: String!): User
    # Exemplo: mutation protegida
    transferSomething(data: String!): String
    createRecipe(nome: String!, ingredientes: [String!]!, Preparo: String!): Recipe
    updateRecipe(id: ID!, nome: String, ingredientes: [String!], Preparo: String): Recipe
    deleteRecipe(id: ID!): Boolean
    generateShoppingList(recipeIds: [ID!]!): ShoppingList
  }
`;

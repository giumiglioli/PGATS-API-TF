// graphql/server.js
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const schema = require('./schema');
const resolvers = require('./resolvers');
const context = require('./context');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

startStandaloneServer(server, {
  context: async () => context,
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Servidor GraphQL rodando em ${url}`);
});
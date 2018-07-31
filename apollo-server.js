const { ApolloServer, gql } = require('apollo-server-micro');
const { importSchema } = require('graphql-import');
const users = [{ id: 1, name: 'bob' }, { id: 2, name: 'alice' }];

const typeDefs = importSchema('./schema.graphql');

const mocks = {
  Int: () => 6,
  String: () => 'Hello GraphQL!',
  Query: () => ({
    users: () => users,
  }),
};

const apolloServer = new ApolloServer({
  typeDefs,
  mocks,
});

module.exports = { apolloServer };

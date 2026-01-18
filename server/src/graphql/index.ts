import { ApolloServer } from '@apollo/server';
import { User } from './user/index.js';

async function createApolloGraphqlServer() {

    // Create Graphql server 
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String             
            }
            type Mutation {
                ${User.mutations}
            }
        `, // Schema
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation: {
                ...User.resolvers.mutations,
            }
        },
    });

    // Start Graphql server
    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphqlServer;
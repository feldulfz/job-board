import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
// import createApolloGraphqlServer from './graphql/index.js';
import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import cookieParser from "cookie-parser";
import schema from "./schema.js"
import createContext from "./context.js";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // Create Graphql server 
    const gqlServer = new ApolloServer({
        schema,
    });

    // Start Graphql server
    await gqlServer.start();    

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running!' });
    });

    app.use(
        '/graphql',
        cors({
            origin: "http://localhost:4200",
            credentials: true,
        }),
        cookieParser(),
        express.json(), 
        expressMiddleware(gqlServer, {
            context: ({ req, res}) => createContext({ req, res}),
        })
    );

    app.listen(PORT, () => { console.log(`Server started at PORT: ${PORT}`); });
}

init();
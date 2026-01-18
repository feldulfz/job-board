import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import createApolloGraphqlServer from './graphql/index.js';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running!' });
    });

    const gqlServer = await createApolloGraphqlServer();

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => { console.log(`Server started at PORT: ${PORT}`); });
}

init();
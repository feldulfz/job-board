import resolvers from "./resolvers.js";
// import typeDefs from "./type-defs.graphql";
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = readFileSync(join(__dirname, 'type-defs.graphql'), 'utf-8');

export { resolvers, typeDefs };
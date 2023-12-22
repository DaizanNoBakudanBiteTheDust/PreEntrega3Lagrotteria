import path from 'path';
import {
    dirname,
} from 'path';
import {
    fileURLToPath
} from 'url';

import dotenv from 'dotenv';
import { Command } from 'commander';


const program = new Command();
// CREO ESTO NO ES NECESARIO LO DE VARIANTE DE AMBIENTE
program.option('variable de ambiente');
program.parse();

//PATH AL ENV

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

// ENVS
const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    secretCookie: process.env.SECRET_COOKIE,
    privateHash: process.env.PRIVATE_KEY_HASH,
    privateJwt: process.env.PRIVATE_KEY_JWT
};


export default configs;

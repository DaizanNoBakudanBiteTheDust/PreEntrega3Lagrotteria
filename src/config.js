import path from 'path';
import { __dirname } from './utils.js';
import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
// CREO ESTO NO ES NECESARIO LO DE VARIANTE DE AMBIENTE
program.option('variable de ambiente');
program.parse();

//PATH AL ENV

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
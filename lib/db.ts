// db.js
import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

export const db = new Client({
  connectionString: process.env.DATABASE_URL,
});

db.connect()
  .then(() => console.log('Connecté à la BDD'))
  .catch((err) => console.error('Erreur de connexion à la BDD', err));

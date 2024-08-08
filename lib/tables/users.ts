import { db } from '../db';

export async function createTableIfNotExists() {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
        discord_id VARCHAR(255) PRIMARY KEY,
        global_name VARCHAR(255),
        avatar VARCHAR(255),
        number_of_looses INTEGER NOT NULL DEFAULT 0
      );
    `;
  try {
    await db.query(query);
  } catch (error) {
    console.error('Erreur lors de la création de la table users:', error);
  }
}

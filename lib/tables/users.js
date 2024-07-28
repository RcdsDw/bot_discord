const db = require('../db.js');

async function createTableIfNotExists() {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        discord_id VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL
      );
    `;
  try {
    await db.query(query);
  } catch (error) {
    console.error('Erreur lors de la création de la table users:', error);
  }
}

module.exports = {
  createTableIfNotExists,
};

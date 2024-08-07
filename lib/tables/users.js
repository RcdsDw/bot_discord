const db = require('../db.js');

async function createTableIfNotExists() {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        discord_id VARCHAR(255) UNIQUE NOT NULL,
        global_name VARCHAR(255) NOT NULL,
        avatar VARCHAR(255) NOT NULL,
        number_of_looses INTEGER NOT NULL DEFAULT 0
      );
    `;
  try {
    await db.query(query);
  } catch (error) {
    const query = `
        ALTER TABLE users
        ADD COLUMN number_of_looses INTEGER NOT NULL DEFAULT 0;
      `;
    await db.query(query);
  }
}

module.exports = {
  createTableIfNotExists,
};

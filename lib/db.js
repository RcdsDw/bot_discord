// db.js
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client
  .connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Database connection error', err));

module.exports = client;

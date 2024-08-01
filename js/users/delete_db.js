const db = require('../../lib/db.js');

async function DeleteDB(msg) {
  try {
    await db.query('DROP TABLE users');
    msg.reply('La base de données a été supprimée.');
  } catch (error) {
    console.error('Error deleting databse', error);
    msg.reply('Impossible de supprimer la base de données.');
  }
}

module.exports = {
  DeleteDB,
};

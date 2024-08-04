const db = require('../../lib/db.js');

async function DeleteDB(msg, author) {
  if (author.username === 'judgeobito') {
    try {
      await db.query('DROP TABLE users');
      msg.reply('La base de données a été supprimée.');
    } catch (error) {
      console.error('Error deleting databse', error);
      msg.reply('Impossible de supprimer la base de données.');
    }
  } else {
    msg.reply("Vous n'avez pas le droit de faire ça.");
    return;
  }
}

module.exports = {
  DeleteDB,
};

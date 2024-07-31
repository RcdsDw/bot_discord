const db = require('../../lib/db.js');
const { createTableIfNotExists } = require('../../lib/tables/users.js');

async function AddMe(msg) {
  createTableIfNotExists();

  const discordId = msg.author.id;
  const globalName = msg.author.globalName;
  const avatar = msg.author.displayAvatarURL();

  try {
    await db.query(
      'INSERT INTO users (discord_id, global_name, avatar) VALUES ($1, $2, $3)',
      [discordId, globalName, avatar],
    );
    msg.reply('Vous avez été ajouté à la base de données.');
  } catch (error) {
    console.error('Error adding user to database:', error);
    msg.reply('Vous ne pouvez pas être ajouté à la base de données.');
  }
}

module.exports = {
  AddMe,
};

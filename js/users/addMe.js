const db = require('../../lib/db.js');
const { createTableIfNotExists } = require('../../lib/tables/users.js');

async function AddMe(params, msg) {
  console.log("🚀 ~ AddMe ~ msg:", msg)
  createTableIfNotExists();

  const discordId = params.id;
  const globalName = params.globalName;
  const avatar = params.displayAvatarURL();

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

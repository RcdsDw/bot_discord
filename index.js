// Reply
const { Coubeh } = require('./js/reply/coubeh.js');
const { AntiCoubeh } = require('./js/reply/anti_coubeh.js');
// Automation
const { Twitter } = require('./js/automation/rename_twitter_link.js');
const { Tiktok } = require('./js/automation/integration_tiktok.js');
const { CheckPresence } = require('./js/automation/check_presence.js');
// Users
const { AddMe } = require('./js/users/add_me.js');
const { ListAll } = require('./js/users/list_all.js');
const { DeleteDB } = require('./js/users/delete_db.js');

const { bot } = require('./lib/bot.js');

require('dotenv').config();

bot
  .login(process.env.TOKEN_BOT)
  .then(() => {
    console.log('Logged in as', bot.user.tag);
  })
  .catch((err) => {
    console.error('Failed to login:', err);
  });

bot.on('messageCreate', async (msg) => {
  // Tiktok refont url for play vidéo on discord
  await Tiktok(msg).catch((err) => console.error(err));

  // Twitter refont url for play vidéo on discord
  const twitterRes = await Twitter(msg);

  if (twitterRes && !msg.author.bot) {
    const author = msg.author.username;

    try {
      // Vérifie si le message existe avant de le supprimer
      await msg.fetch();

      // Supprime le message
      await msg.delete();
      // Envoie le nouveau message
      await msg.channel.send(twitterRes.concat(`\n`, `Envoyé par ${author}`));
    } catch (error) {
      if (error.code === 10008) {
        console.error(
          'Error: Unknown Message. It might have been already deleted.',
        );
      } else {
        console.error(`An error occurred: ${error.message}`);
      }
    }
  }

  // Supprimer de la DB
  if (msg.content === '!DDB') {
    if (msg.author.username !== 'judgeobito') {
      msg.reply("Vous n'avez pas le droit de faire ça.");
      return;
    }

    DeleteDB(msg);
  }

  // Ajouter un utilisateur à la DB
  if (msg.content === '!AM') {
    AddMe(msg.author, msg);
  }

  // Lister les utilisateurs
  if (msg.content === '!LI') {
    ListAll(msg.author, msg);
  }

  // Check author
  if (
    msg.author.bot ||
    msg.author.username === 'judgeobito' ||
    msg.author.username === 'cocacolack'
  )
    return;

  // Bot anti coubeh/kette/feur
  let referencedMessage;

  if (msg.reference) {
    referencedMessage = await msg.channel.messages.fetch(
      msg.reference.messageId,
    );
  }

  if (
    (msg.reference &&
      (referencedMessage.author.username === 'judgeobito' ||
        referencedMessage.author.username === 'cocacolack')) ||
    msg.mentions.users.some((user) => user.username === 'judgeobito') ||
    msg.mentions.users.some((user) => user.username === 'cocacolack')
  ) {
    const antiCoubehRes = await AntiCoubeh(msg.content);
    if (antiCoubehRes) {
      msg.reply(antiCoubehRes);
      return;
    }
  }

  // Bot coubeh/kette/feur
  const coubehRes = await Coubeh(msg.content);
  if (coubehRes) {
    msg.reply(coubehRes);
    return;
  }

  // Away from keyboard
  if (
    msg.mentions.users.some((user) => user.username === 'judgeobito') &&
    CheckPresence(
      msg.mentions.users.find((user) => user.username === 'judgeobito').id,
      msg.guild,
    )
  ) {
    msg.reply(
      "Merci pour votre message. Le maître n'est pas disponible actuellement.\n\n" +
        "Il est sur l'île d'Apagnan mais il sera bientôt de retour pour coubeh un max avec le VC.\n\n" +
        'Merci de votre compréhension.\n\n' +
        'Cordialement,\n' +
        'Son agent.',
    );
    return;
  }
});

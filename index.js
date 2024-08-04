// Reply
const { Coubeh } = require('./js/reply/coubeh.js');
const { AntiCoubeh } = require('./js/reply/anti_coubeh.js');
// Automation
const {
  RelinkSocialVideos,
} = require('./js/automation/relink_social_videos.js');
const { CheckPresence } = require('./js/automation/check_presence.js');
// Users
const { AddMe } = require('./js/users/add_me.js');
const { ListAll } = require('./js/users/list_all.js');
const { DeleteDB } = require('./js/users/delete_db.js');

const { bot } = require('./lib/bot.js');
const { userMention } = require('discord.js');

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
  const author = userMention(msg.author.id);

  // Tiktok/Twitter refont url for play vidéo on discord
  const RelinkVideosSocialRes = await RelinkSocialVideos(msg.content);

  if (RelinkVideosSocialRes && !msg.author.bot) {
    msg
      .delete()
      .then(() => {
        msg.channel.send(
          RelinkVideosSocialRes.concat(`\n`, `Envoyé par ${author}`),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Supprimer de la DB
  if (msg.content === '!DDB') {
    DeleteDB(msg, msg.author);
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

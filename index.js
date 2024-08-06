const { bot } = require('./lib/bot.js');
const { userMention } = require('discord.js');
const moment = require('moment');

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

trashs = require('./datas/trashs.json');
compliments = require('./datas/compliments.json');

require('dotenv').config();
moment.locale('fr');

bot
  .login(process.env.TOKEN_BOT)
  .then(() => {
    console.log('Logged in as', bot.user.tag);
  })
  .catch((err) => {
    console.error('Failed to login:', err);
  });

bot.on('messageCreate', async (msg) => {
  const authorId = msg.author.id;
  const author = msg.author;
  const guild = msg.guild;
  const channel = msg.channel;
  const content = msg.content;

  const listVIP = ['judgeobito', 'cocacolack'];

  //*---------------------------------------*
  // Supprimer de la DB
  //*---------------------------------------*

  if (content === '!DDB') {
    DeleteDB(msg, author);
  }

  //*---------------------------------------*
  // Ajouter un utilisateur à la DB
  //*---------------------------------------*

  if (content === '!AM') {
    AddMe(author, msg);
  }

  //*---------------------------------------*
  // Lister les utilisateurs
  //*---------------------------------------*

  if (content === '!LI') {
    ListAll(author, msg);
  }

  //*---------------------------------------*
  // Tiktok/Twitter refont url for play vidéo on discord
  //*---------------------------------------*

  if (
    content.includes('twitter') ||
    content.includes('tiktok') ||
    content.includes('x.com')
  ) {
    const RelinkVideosSocialRes = await RelinkSocialVideos(content);

    if (RelinkVideosSocialRes && !author.bot) {
      msg
        .delete()
        .then(() => {
          channel.send(
            RelinkVideosSocialRes.concat(
              `\n`,
              `Envoyé par ${userMention(authorId)}`,
            ),
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } else {
    return;
  }

  //*---------------------------------------*
  // Mathis react
  //*---------------------------------------*
  if (author.username === 'karyan') {
    try {
      await msg.react('🇬');
      await msg.react('🇷');
      await msg.react('🇴');
      await msg.react('🇸');
      await msg.react('🇵');
      await msg.react('🇩');
    } catch (error) {
      console.error('Error adding reactions:', error);
    }
    return;
  }

  //*---------------------------------------*
  // Check if is a reply
  //*---------------------------------------*

  let referencedMessage;

  if (msg.reference) {
    referencedMessage = await channel.messages.fetch(msg.reference.messageId);
  }

  if (
    ((msg.reference && referencedMessage.author.id === bot.user.id) ||
      msg.mentions.has(bot.user)) &&
    !author.bot
  ) {
    if (author.username === 'judgeobito') {
      msg.reply(
        `${moment().hour() < 19 ? 'Bonjour ' : 'Bonsoir '}` +
          compliments[Math.floor(Math.random() * compliments.length)],
      );
    } else if (author.username === 'cocacolack') {
      msg.reply("J'accepte et mon coeur reste ouvert.");
    } else {
      msg.reply(
        'À qui tu crois parler, ' +
          trashs[Math.floor(Math.random() * trashs.length)] +
          ' ?',
      );
    }
    return;
  }

  //*---------------------------------------*
  // Check author
  //*---------------------------------------*

  if (
    author.bot ||
    author.username === 'judgeobito' ||
    author.username === 'cocacolack'
  )
    return;

  //*---------------------------------------*
  // Bot anti coubeh/kette/feur
  //*---------------------------------------*

  if (
    (msg.reference &&
      listVIP.some((vip) => referencedMessage.author.username === vip)) ||
    listVIP.some((vip) =>
      msg.mentions.users.some((user) => user.username === vip),
    )
  ) {
    const antiCoubehRes = await AntiCoubeh(content);
    if (antiCoubehRes) {
      msg.reply(antiCoubehRes);
      return;
    }
  }

  //*---------------------------------------*
  // Bot coubeh/kette/feur
  //*---------------------------------------*

  const coubehRes = await Coubeh(content);
  if (coubehRes) {
    msg.reply(coubehRes);
    return;
  }

  //*---------------------------------------*
  // Away from keyboard
  //*---------------------------------------*

  if (
    msg.mentions.users.some((user) => user.username === 'judgeobito') &&
    CheckPresence(
      msg.mentions.users.find((user) => user.username === 'judgeobito').id,
      guild,
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

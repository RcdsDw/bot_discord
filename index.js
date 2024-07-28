const { Coubeh } = require('./js/coubeh.js');
const { AntiCoubeh } = require('./js/antiCoubeh.js');
const { Twitter } = require('./js/twitter.js');
const { CheckPresence } = require('./js/checkPresence.js');

const { config } = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');

const db = require('./lib/db.js');
const { createTableIfNotExists } = require('./lib/tables/users.js');

config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

bot.login(process.env.TOKEN_BOT).catch((err) => {
  console.error('Failed to login:', err);
});

bot.on('messageCreate', async (msg) => {
  // Twitter refont url for play vidéo on discord
  const twitterRes = await Twitter(msg.content);

  if (twitterRes && !msg.author.bot) {
    msg.delete().then(() => {
      msg.channel.send(twitterRes);
      return;
    });
  }

  // Ajouter un utilisateur à la DB
  if (msg.content.startsWith('!addme')) {
    createTableIfNotExists();
    console.log(msg.author);
    const username = msg.author.username;
    const discordId = msg.author.id;

    try {
      await db.query(
        'INSERT INTO users (discord_id, username) VALUES ($1, $2)',
        [discordId, username],
      );
      msg.reply('Vous avez été ajouté à la base de données.');
    } catch (error) {
      console.error('Error adding user to database:', error);
      msg.reply('Vous ne pouvez pas être ajouté à la base de données.');
    }
  }

  // Lister les utilisateurs
  if (msg.content.startsWith('!list')) {
    try {
      let res = await db.query('SELECT * FROM users');
      res = res.rows;
      msg.channel.send(res.map((r) => r.username).join('\n'));
    } catch (error) {
      console.error('Console error list users from database:', error);
      msg.reply('La liste ne peut pas être récupérée.');
    }
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
      msg.channel.send(antiCoubehRes);
      return;
    }
  }

  // Bot coubeh/kette/feur
  const coubehRes = await Coubeh(msg.content);

  if (coubehRes) {
    msg.channel.send(coubehRes);
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
      "Merci pour votre message. Le St Gouverneur n'est pas disponible actuellement.\n\n" +
        "Il est sur l'île d'Apagnan mais il sera bientôt de retour pour coubeh un max avec le VC.\n\n" +
        'Merci de votre compréhension.\n\n' +
        'Cordialement,\n' +
        'Sa grognasse de secrétaire.',
    );
    return;
  }
});

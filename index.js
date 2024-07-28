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

  // Suprimer la DB
  if (msg.content.startsWith('!delete')) {
    if (msg.author.username === 'judgeobito') {
      try {
        await db.query('DELETE * FROM users');
        msg.reply('Vous avez supprimé la base de données.');
      } catch (error) {
        console.error('Error deleting user from database:', error);
      }
    }
  }

  // Ajouter un utilisateur à la DB
  if (msg.content.startsWith('!addme')) {
    createTableIfNotExists();
    const img = msg.author.displayAvatarURL();
    const username = msg.author.globalName;
    const discordId = msg.author.id;

    try {
      await db.query(
        'INSERT INTO users (discord_id, username, img) VALUES ($1, $2, $3)',
        [discordId, username, img],
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

      if (res.length === 0) {
        msg.reply('Aucun utilisateur enregistré.');
        return;
      }

      let index = 0;

      const updateUserEmbed = (index) => {
        const user = res[index];
        const embed = new MessageEmbed()
          .setTitle(user.username)
          .setImage(user.img || 'URL_DE_IMAGE_PAR_DEFAUT')
          .setFooter(`Utilisateur ${index + 1} sur ${res.length}`);

        return embed;
      };

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('previous')
          .setLabel('◀️')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('next')
          .setLabel('▶️')
          .setStyle('PRIMARY'),
      );

      const embedMessage = await msg.channel.send({
        embeds: [updateUserEmbed(index)],
        components: [row],
      });

      const filter = (interaction) => {
        return (
          ['previous', 'next'].includes(interaction.customId) &&
          interaction.user.id === msg.author.id
        );
      };

      const collector = embedMessage.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on('collect', (interaction) => {
        if (interaction.customId === 'previous') {
          index = index > 0 ? index - 1 : res.length - 1;
        } else if (interaction.customId === 'next') {
          index = index < res.length - 1 ? index + 1 : 0;
        }

        interaction.update({
          embeds: [updateUserEmbed(index)],
          components: [row],
        });
      });

      collector.on('end', () => {
        const disabledRow = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('previous')
            .setLabel('◀️')
            .setStyle('PRIMARY')
            .setDisabled(true),
          new MessageButton()
            .setCustomId('next')
            .setLabel('▶️')
            .setStyle('PRIMARY')
            .setDisabled(true),
        );

        embedMessage.edit({ components: [disabledRow] });
      });
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

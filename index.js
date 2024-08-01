// Reply
const { Coubeh } = require('./js/reply/coubeh.js');
const { AntiCoubeh } = require('./js/reply/antiCoubeh.js');
// Automation
const { Twitter } = require('./js/automation/twitter.js');
const { CheckPresence } = require('./js/automation/checkPresence.js');
// Users
const { AddMe } = require('./js/users/addMe.js');
const { ListUsers } = require('./js/users/list.js');

const { config } = require('dotenv');
const db = require('./lib/db.js');
const { bot } = require('./lib/bot.js');
const { Events } = require('discord.js');

config();

bot.login(process.env.TOKEN_BOT).catch((err) => {
  console.error('Failed to login:', err);
});

bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
  const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
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

  // Supprimer de la DB
  if (msg.content === "!DDB") {
    if (msg.author.username !== 'judgeobito') {
      msg.reply("Vous n'avez pas le droit de faire ça.");
      return;
    }

    try {
      await db.query('DROP TABLE users');
      msg.reply('La base de données a été supprimée.');
    } catch (error) {
      console.error('Error deleting databse', error);
      msg.reply('Impossible de supprimer la base de données.');
    }
  }

  // Ajouter un utilisateur à la DB
  if (msg.content === "!AM") {
    AddMe(msg.author, msg);
  }

  // Lister les utilisateurs
  if (msg.content === "!LI") {
    ListUsers(msg);
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
      "Merci pour votre message. Le maître n'est pas disponible actuellement.\n\n" +
        "Il est sur l'île d'Apagnan mais il sera bientôt de retour pour coubeh un max avec le VC.\n\n" +
        'Merci de votre compréhension.\n\n' +
        'Cordialement,\n' +
        'Sa secrétaire.',
    );
    return;
  }
});

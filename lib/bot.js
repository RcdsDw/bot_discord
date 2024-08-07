const { Client, GatewayIntentBits, Events } = require('discord.js');
const { getCommands } = require('./command');
const db = require('./db');
const { createTableIfNotExists } = require('./tables/users');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

bot.commands = getCommands();

bot.on('ready', async () => {
  const guild = bot.guilds.cache.get('1169725987454464051');
  if (!guild) {
    console.log('Guild not found');
    return;
  }

  const members = await guild.members.fetch();
  members.forEach(async (member) => {
    if (member.user.bot) {
      return;
    }
    await createTableIfNotExists()
    await db.query(
      `INSERT INTO users (discord_id, global_name, avatar, number_of_looses) VALUES ($1, $2, $3, $4) 
          ON CONFLICT (discord_id) DO UPDATE SET global_name = $2, avatar = $3, number_of_looses = $4`,
      [
        member.user.id,
        member.nickname ? member.nickname : member.user.globalName,
        member.user.avatarURL(),
        0,
      ],
    );
  });
});

// Redirige sur les slashs commands
bot.on(Events.InteractionCreate, async (interaction) => {
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
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});

module.exports = {
  bot,
};

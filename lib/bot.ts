import { getCommands } from './command';
import { createTableIfNotExists } from './tables/users';
import { db } from './db';
import { GuildMember, Interaction } from 'discord.js';

import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { Command } from './interfaces/interfaces';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

export const bot = new Client({
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
  await createTableIfNotExists();

  const guild = bot.guilds.cache.get('1169725987454464051');
  if (!guild) {
    console.log('Guild not found');
    return;
  }

  const members = await guild.members.fetch();
  members.forEach(async (member: GuildMember) => {
    if (member.user.bot) {
      return;
    }
    // Check if the member already exists in the database
    const result = await db.query('SELECT 1 FROM users WHERE discord_id = $1', [
      member.user.id,
    ]);
    if (result.rowCount === 0) {
      await db.query(
        `INSERT INTO users (discord_id, global_name, avatar, number_of_looses) VALUES ($1, $2, $3, $4) 
          ON CONFLICT (discord_id) DO UPDATE SET global_name = $2, avatar = $3, number_of_looses = $4`,
        [
          member.user.id,
          member.nickname
            ? member.nickname
            : member.user.globalName
              ? member.user.globalName
              : member.user.username,
          member.user.avatarURL()
            ? member.user.avatarURL()
            : 'https://cdn.discordapp.com/embed/avatars/0.png',
          0,
        ],
      );
    }
  });
});

// Redirige sur les slashs commands
bot.on(Events.InteractionCreate, async (interaction: Interaction) => {
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

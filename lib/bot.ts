import { getCommands } from './command';

import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  Interaction,
  GuildMember,
} from 'discord.js';
import { Command } from './interfaces/interfaces';

import { connectDb } from './db';
import { DiscordUser } from './models/users';

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
  await connectDb(); // Connecter à la base de données avant de continuer

  const guild = bot.guilds.cache.get('1169725987454464051');
  if (!guild) {
    console.log('Guild not found');
    return;
  }

  const members = await guild.members.fetch();
  for (const member of members.values()) {
    if (member.user.bot) continue;

    const [user, created] = await DiscordUser.findOrCreate({
      where: { discord_id: member.user.id },
      defaults: {
        global_name: member.nickname || member.user.username,
        avatar:
          member.user.avatarURL() ||
          'https://cdn.discordapp.com/embed/avatars/0.png',
        number_of_looses: 0,
      },
    });

    if (!created) {
      // Update existing user data if necessary
      await user.update({
        global_name: member.nickname || member.user.username,
        avatar:
          member.user.avatarURL() ||
          'https://cdn.discordapp.com/embed/avatars/0.png',
      });
    }
  }
  console.log('Tous les membres ont été traités.');
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

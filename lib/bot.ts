import { getCommands } from './command';

import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  Interaction,
} from 'discord.js';
import { Command } from './interfaces/interfaces';

import { connectDb } from './db';
import { DiscordUser } from './models/users';
import { DiscordGuild } from './models/guilds';

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
  try {
    await connectDb();
    console.log('Connecter à la base de données avant de continuer');

    for (const guild of bot.guilds.cache.values()) {
      if (!guild) {
        console.log('Guild not found');
        return;
      }

      const [discordGuild, guildCreated] = await DiscordGuild.findOrCreate({
        where: { guild_id: guild.id },
        defaults: {
          name: guild.name,
          avatar:
            guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png',
        },
      });

      const members = await guild.members.fetch();
      for (const member of members.values()) {
        if (member.user.bot) continue;

        const [user, created] = await DiscordUser.findOrCreate({
          where: { user_id: member.user.id },
          defaults: {
            global_name:
              member.user.globalName || member.user.username || member.nickname,
            avatar:
              member.user.avatarURL() ||
              'https://cdn.discordapp.com/embed/avatars/0.png',
            number_of_looses: 0,
          },
        });

        if (!created) {
          await user.update({
            global_name:
            member.user.globalName || member.user.username || member.nickname,
            avatar:
              member.user.avatarURL() ||
              'https://cdn.discordapp.com/embed/avatars/0.png',
          });
        }

        await user.$add('discordGuilds', discordGuild);
      }

      if (!guildCreated) {
        await discordGuild.update({
          name: guild.name,
          avatar:
            guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png',
        });
      }
    }
    console.log('Tous les membres ont été traités et associés aux guildes.');
  } catch (error) {
    console.error('Error while connecting to the database:', error);
  }
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

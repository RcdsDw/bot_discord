import {
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  User,
  CommandInteraction,
} from 'discord.js';
import { DiscordUser } from '../../../lib/models/users';
import { DiscordGuild } from '../../../lib/models/guilds';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
  .setName('listall')
  .setDescription(
    'Liste les utilisateurs enregistrés dans la base de données.',
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await ListAll(interaction, interaction.user as User);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

/* Function to execute */

export async function ListAll(msg: CommandInteraction, author: User) {
  const guildId = msg.guildId;

  if (!guildId) {
    msg.reply('Impossible de récupérer la guilde.');
    return;
  }

  try {
    const guild = await DiscordGuild.findByPk(guildId, {
      include: DiscordUser,
    });

    if (!guild || !guild.discordUsers || guild.discordUsers.length === 0) {
      msg.reply('La liste est vide pour cette guilde.');
      return;
    }

    const users = guild.discordUsers.sort(
      (a, b) => b.number_of_looses - a.number_of_looses,
    );
    let i = 0;

    const updateUserEmbed = (i: number) => {
      const user = users[i];
      const embed = new EmbedBuilder()
        .setTitle(user.global_name)
        .setImage(user.avatar)
        .setFooter({
          text: `Utilisateur ${i + 1} sur ${users.length} \n S'est fait avoir ${user.number_of_looses} fois.`,
        });

      return embed;
    };

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('<')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('>')
        .setStyle(ButtonStyle.Secondary),
    );

    const embedMessage = await msg.reply({
      embeds: [updateUserEmbed(i)],
      components: [row],
    });

    const filter = (interaction: any) => {
      return (
        ['previous', 'next'].includes(interaction.customId) &&
        interaction.user.id === author.id
      );
    };

    const collector = embedMessage.createMessageComponentCollector({
      filter,
      time: 200000,
    });

    collector.on('collect', (interaction) => {
      if (interaction.customId === 'previous') {
        i = i > 0 ? i - 1 : users.length - 1;
      } else if (interaction.customId === 'next') {
        i = i < users.length - 1 ? i + 1 : 0;
      }

      interaction.update({
        embeds: [updateUserEmbed(i)],
        components: [row],
      });
    });

    collector.on('end', () => {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('<')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('>')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
      );

      embedMessage.edit({ components: [disabledRow] });
    });
  } catch (error) {
    console.error('Console error list users from database:', error);
    msg.reply('La liste ne peut pas être récupérée.');
  }
}

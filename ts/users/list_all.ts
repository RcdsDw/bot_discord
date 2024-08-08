import { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, User } from 'discord.js';
import { db } from '../../lib/db';
// const { bot } = require('../../lib/bot.js');

export async function ListAll(msg: Message, author: User) {
  try {
    let res: any = await db.query('SELECT * FROM users');
    res = res.rows;

    if (res.length === 0) {
      msg.reply('La liste est vide.');
      return;
    }

    let i = 0;

    const updateUserEmbed = (i: number) => {
      const user = res[i];
      const embed = new EmbedBuilder()
        .setTitle(user.global_name)
        .setImage(user.avatar)
        .setFooter({
          text: `Utilisateur ${i + 1} sur ${res.length} \n S'est fait avoir ${user.number_of_looses} fois.`,
          // iconURL: bot.user.displayAvatarURL(),
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

    const embedMessage = await msg.channel.send({
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
        i = i > 0 ? i - 1 : res.length - 1;
      } else if (interaction.customId === 'next') {
        i = i < res.length - 1 ? i + 1 : 0;
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

const {
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require('discord.js');
const db = require('../../lib/db.js');
const { bot } = require('../../lib/bot.js');

async function ListUsers(msg) {
  try {
    let res = await db.query('SELECT * FROM users');
    res = res.rows;

    if (res.length === 0) {
      msg.reply('La liste est vide.');
      return;
    }

    let i = 0;

    const updateUserEmbed = (i) => {
      const user = res[i];
      const embed = new EmbedBuilder()
        .setTitle(user.global_name)
        .setImage(user.avatar)
        .setFooter({
          text: `Utilisateur ${i + 1} sur ${res.length}`,
          iconURL: bot.user.displayAvatarURL(),
        });

      return embed;
    };

    const row = new ActionRowBuilder().addComponents(
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

    const filter = (interaction) => {
      return (
        ['previous', 'next'].includes(interaction.customId) &&
        interaction.user.id === msg.author.id
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
      const disabledRow = new ActionRowBuilder().addComponents(
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

module.exports = {
  ListUsers,
};

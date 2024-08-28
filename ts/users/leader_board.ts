import { EmbedBuilder } from 'discord.js';

export async function LeaderBoard(interaction: any, author: any) {
  const updateUserEmbed = () => {
    const embed = new EmbedBuilder()
      .setTitle('http://bot.rcds-dev.fr')
      .setFooter({
        text: `Tiens ${author.username}, régale toi avec le classement des coubehs.`,
      });

    return embed;
  };
  interaction.reply({
    embeds: [updateUserEmbed()],
  });
}

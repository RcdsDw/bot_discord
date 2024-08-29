import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder, User } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Donne le lien du classement des coubehs.');

export async function execute(interaction: CommandInteraction) {
  try {
    await LeaderBoard(interaction as any, interaction.user as User);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

/* Function to execute */

async function LeaderBoard(interaction: any, author: any) {
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

import { SlashCommandBuilder } from '@discordjs/builders';
import { LeaderBoard } from '../../../ts/users/leader_board';
import { CommandInteraction, User } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription(
    'Donne le lien du classement des coubehs.',
  );

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

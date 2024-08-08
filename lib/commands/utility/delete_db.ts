import { SlashCommandBuilder } from '@discordjs/builders';
import { DeleteDB } from '../../../ts/users/delete_db';
import { CommandInteraction, User } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('deletedb')
  .setDescription('(Admin)- !DDB - Supprime la base de données.');
// .addUserOption((option) =>
//   option.setName('user').setDescription('Utilisateur à ajouter.'),
// ),

export async function execute(interaction: CommandInteraction) {
  try {
    await DeleteDB(interaction as any, interaction.user as User);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

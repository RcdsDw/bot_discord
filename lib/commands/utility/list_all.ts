import { SlashCommandBuilder } from '@discordjs/builders';
import { ListAll } from '../../../ts/users/list_all';
import { CommandInteraction, User } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('listall')
  .setDescription(
    '!LI - Liste les utilisateurs enregistrés dans la base de données.',
  );
// .addUserOption((option) =>
//   option.setName('user').setDescription('Utilisateur à ajouter.'),
// );

export async function execute(interaction: CommandInteraction) {
  try {
    await ListAll(interaction as any, interaction.user as User); // Ajoute 'await' si ListAll est une fonction asynchrone
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}
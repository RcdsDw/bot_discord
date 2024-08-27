import { SlashCommandBuilder } from '@discordjs/builders';
import { ListAll } from '../../../ts/users/list_all';
import { CommandInteraction, User } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('listall')
  .setDescription(
    'Liste les utilisateurs enregistrés dans la base de données.',
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await ListAll(interaction as any, interaction.user as User);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

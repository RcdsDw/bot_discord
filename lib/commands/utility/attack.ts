import { SlashCommandBuilder } from '@discordjs/builders';
import { Attack } from '../../../ts/users/attack';
import { CommandInteraction, User } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('attack')
  .setDescription(
    'Il va voir ce petit enculé.',
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await Attack(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

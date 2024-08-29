import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, userMention } from 'discord.js';
import trashs from '../../../datas/trashs.json';

export const data = new SlashCommandBuilder()
  .setName('attack')
  .setDescription('Attaque une personne de ton choix.')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Utilisateur à attaquer')
      .setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  try {
    // Assurez-vous que l'option utilisateur est correctement typée
    const targetUser = interaction.options.get('user')?.user;

    // Vérifiez si l'utilisateur est lui-même
    if (!targetUser) {
      await interaction.reply("Tu n'as pas spécifié de personne à attaquer.");
      return;
    }

    if (targetUser.id === interaction.user.id) {
      await interaction.reply('Tu ne peux pas te faire attaquer toi-même.');
      return;
    }

    // Si tout est correct, attaquer l'utilisateur cible
    await interaction.reply(
      `Oh ${userMention(targetUser.id)}, ferme un peu ta gueule ${trashs[Math.floor(Math.random() * trashs.length)]} !`,
    );
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

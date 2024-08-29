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
    await Attack(interaction as any);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply(
      "Il y a eu une erreur lors de l'exécution de la commande.",
    );
  }
}

/* Function to execute */

async function Attack (interaction: any) {
  const targetUser = interaction.options.get('user')?.user;

    if (!targetUser) {
      await interaction.reply("Tu n'as pas spécifié de personne à attaquer.");
      return;
    }

    if (targetUser.id === interaction.user.id) {
      await interaction.reply('Tu ne peux pas te faire attaquer toi-même.');
      return;
    }

    if (targetUser.id === "246753473587052555") {
      let random = trashs[Math.floor(Math.random() * trashs.length)];
      await interaction.reply(`${userMention(interaction.user.id)} ? Tu crois que je vais attaquer mon maître ? ${random.charAt(0).toUpperCase() + random.slice(1)} !`);
      return;
    }

    await interaction.reply(
      `Oh ${userMention(targetUser.id)}, ferme un peu ta gueule ${trashs[Math.floor(Math.random() * trashs.length)]} !`,
    );
}

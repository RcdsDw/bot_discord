import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, userMention } from 'discord.js';
import trashs from '../../../datas/trashs.json';
import { listVIP } from '../../../index';

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
      await interaction.reply("Tu ne peux pas t'attaquer toi-même.");
      return;
    }

    if (targetUser.id === "246753473587052555") {
      if (listVIP.some((vip) => interaction.user.id === vip)) {
        await interaction.reply("Tu voulais attaquer le maître ? Gourmand, je peux pas te laisser faire ça désolé.");
        return;
      } else {
        let random = trashs[Math.floor(Math.random() * trashs.length)];
        await interaction.reply(`${userMention(interaction.user.id)} ? Tu crois que je vais attaquer mon maître ? ${random.charAt(0).toUpperCase() + random.slice(1)} !`);
        return;
      }
    }

    if (listVIP.some((vip) => targetUser.id === vip)) {
      if (interaction.user.id === "246753473587052555") {
        await interaction.reply("Soyez raisonné maître, je ne peux pas attaquer un Incoubable.");
        return;
      } else if (listVIP.some((vip) => interaction.user.id === vip)) {
        await interaction.reply("Tu t'attaques à ta propre race mon frère ?");
        return;
      } else {
        await interaction.reply(`${userMention(interaction.user.id)} ? Je vais pas attaquer un Incoubable pour toi, ${trashs[Math.floor(Math.random() * trashs.length)]} !`);
        return;
      }
    }

    await interaction.reply(
      `Oh ${userMention(targetUser.id)}, ferme un peu ta gueule ${trashs[Math.floor(Math.random() * trashs.length)]} !`,
    );
}

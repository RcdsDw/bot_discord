const { SlashCommandBuilder } = require('@discordjs/builders');
const { AddMe } = require('../../../js/users/add_me.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addme')
    .setDescription('!AM - Vous ajoute à la base de données.'),
  // .addUserOption((option) =>
  //   option.setName('user').setDescription('Utilisateur à ajouter.'),
  // ),
  async execute(interaction) {
    try {
      await AddMe(interaction.user, interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply(
        "Il y a eu une erreur lors de l'exécution de la commande.",
      );
    }
  },
};
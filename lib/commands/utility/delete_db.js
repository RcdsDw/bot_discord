const { SlashCommandBuilder } = require('@discordjs/builders');
const { DeleteDB } = require('../../../js/users/delete_db.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletedb')
    .setDescription('(Admin)- !DDB - Supprime la base de données.'),
  // .addUserOption((option) =>
  //   option.setName('user').setDescription('Utilisateur à ajouter.'),
  // ),
  async execute(interaction) {
    try {
      await DeleteDB(interaction, interaction.user);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply(
        "Il y a eu une erreur lors de l'exécution de la commande.",
      );
    }
  },
};

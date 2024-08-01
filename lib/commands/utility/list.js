const { SlashCommandBuilder } = require('@discordjs/builders');
const { ListUsers } = require('../../../js/users/list.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription(
      '!LI - Liste dles utilisateurs enregistrés dans la base de données.',
    ),
  // .addUserOption((option) =>
  //   option.setName('user').setDescription('Utilisateur à ajouter.'),
  // ),
  async execute(interaction) {
    try {
      console.log('Interaction received:', interaction.user);
      await ListUsers(interaction.user, interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply(
        "Il y a eu une erreur lors de l'exécution de la commande.",
      );
    }
  },
};

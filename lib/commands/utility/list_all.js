const { SlashCommandBuilder } = require('@discordjs/builders');
const { ListAll } = require('../../../js/users/list_all.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listall')
    .setDescription(
      '!LI - Liste les utilisateurs enregistrés dans la base de données.',
    ),
  // .addUserOption((option) =>
  //   option.setName('user').setDescription('Utilisateur à ajouter.'),
  // ),
  async execute(interaction) {
    try {
      console.log('Interaction received:', interaction.user);
      ListAll(interaction.user, interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply(
        "Il y a eu une erreur lors de l'exécution de la commande.",
      );
    }
  },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const builders_1 = require("@discordjs/builders");
const list_all_1 = require("../../../ts/users/list_all");
exports.data = new builders_1.SlashCommandBuilder()
    .setName('listall')
    .setDescription('!LI - Liste les utilisateurs enregistrés dans la base de données.');
// .addUserOption((option) =>
//   option.setName('user').setDescription('Utilisateur à ajouter.'),
// );
async function execute(interaction) {
    try {
        await (0, list_all_1.ListAll)(interaction, interaction.user); // Ajoute 'await' si ListAll est une fonction asynchrone
    }
    catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply("Il y a eu une erreur lors de l'exécution de la commande.");
    }
}

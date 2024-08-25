"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const command_1 = require("./lib/command");
// Vérifiez si les variables d'environnement sont définies
const token = process.env.TOKEN_BOT ?? '';
const clientId = process.env.CLIENT_ID ?? '';
// Obtenez les commandes et convertissez-les en JSON
const commands = (0, command_1.getCommands)().map((command) => command.data.toJSON());
// Instanciez le module REST
const rest = new discord_js_1.REST({ version: '10' }).setToken(token);
// Déployez les commandes
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // Utilisez la méthode PUT pour rafraîchir toutes les commandes dans la guilde
        const data_commands = await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
        console.log(`Successfully reloaded ${data_commands.length} application (/) commands.`);
    }
    catch (error) {
        // Attrapez et loguez toutes les erreurs
        console.error('Error deploying commands:', error);
    }
})();

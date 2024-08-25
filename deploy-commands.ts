import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { getCommands } from './lib/command';

// Vérifiez si les variables d'environnement sont définies
const token = process.env.TOKEN_BOT ?? '';
const clientId = process.env.CLIENT_ID ?? '';

// Obtenez les commandes et convertissez-les en JSON
const commands: string[] = getCommands().map((command: any) => command.data.toJSON());

// Instanciez le module REST
const rest = new REST({ version: '10' }).setToken(token);

// Déployez les commandes
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Utilisez la méthode PUT pour rafraîchir toutes les commandes dans la guilde
    const data_commands: any = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data_commands.length} application (/) commands.`);
  } catch (error) {
    // Attrapez et loguez toutes les erreurs
    console.error('Error deploying commands:', error);
  }
})();

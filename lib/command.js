const { Collection } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

/**
 * Retourne une collection contenant les commandes du dossier commandes. Le nom de la commande en clé et les données de la commande en valeur
 */
const getCommands = () => {
  const commands = new Collection();

  const foldersPath = path.join(__dirname, './commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
  return commands;
};

module.exports = {
  getCommands,
};

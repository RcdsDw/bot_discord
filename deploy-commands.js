const { REST, Routes } = require('discord.js');
const { getCommands } = require('./lib/command');
require('dotenv').config();

let commands = getCommands();

commands = commands.map((command) => command.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN_BOT);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: Array.from(commands) },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

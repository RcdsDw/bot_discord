import { REST, Routes } from 'discord.js';
import { getCommands } from './lib/command';
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.TOKEN_BOT;
const clientId = process.env.CLIENT_ID;

let commands = getCommands();

let commandsArray = Array.from(commands.values()).map((command) =>
  command.data.toJSON(),
);

if (!token || !clientId) {
  throw new Error('TOKEN_BOT or CLIENT_ID not set');
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commandsArray.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data: any = await rest.put(Routes.applicationCommands(clientId), {
      body: commandsArray,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
    return;
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
    return;
  }
})();

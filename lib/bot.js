const { Client, Collection, GatewayIntentBits, Options } = require('discord.js');
const fs = require('fs')

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

//
//
// TUTO https://thomasbnt.dev/blog/creer-un-robot-discord-avec-les-slash-commands
//
//

// bot.commands = new Collection();
// const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`)
//   bot.commands.set(command.data.name, command)
// }

// Les events comme par exemple ready.js (quand le robot s'allume), 
// ou encore messageCreate.js (quand un utilisateur/robot envoie un message)
// const eventFiles = fs
//   .readdirSync('./events')
//   .filter((file) => file.endsWith('.js'))

// for (const file of eventFiles) {
//   const event = require(`./events/${file}`)
//   if (event.once) {
//     bot.once(event.name, (...args) => event.execute(...args, bot))
//   } else {
//     bot.on(event.name, (...args) => event.execute(...args, bot))
//   }
// }

// L'event interactionCreate directement ici, car c'est en soit le coeur du robot.
// bot.on('interactionCreate', async (interaction) => {
//   if (!interaction.isCommand()) return
//   const command = bot.commands.get(interaction.commandName)
//   if (!command) return

//   // On log quand un utilisateur fait une commande
//   try {
//     await console.log(
//       `/${interaction.commandName} — Par ${interaction.user.username}`
//     )
//     await command.execute(interaction, bot)
//     // Mais s'il y a une erreur, 
//     // alors on log ça et on renvoi un message d'erreur seulement à la personne (ephemeral: true)
//   } catch (error) {
//     console.error(error)
//     return interaction.reply({
//       content: "Une erreur s'est produite lors de l'exécution de cette commande !",
//       ephemeral: true,
//       fetchReply: true
//     })
//   }
// })


module.exports = {
  bot,
};

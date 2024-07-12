require('dotenv').config();

const { Client, GatewayIntentBits, GuildMember } = require('discord.js');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

bot.login(process.env.TOKEN_BOT);

bot.on('messageCreate', async function(msg) {
    if (msg.author.bot || msg.author.username === "judgeobito") return;

    if (msg.content.includes("coubeh") || msg.content.includes("kette") || msg.content.includes("quette") || msg.content.includes("feur") || msg.content.includes("quete")) {
        if (msg.reference) {
            const referencedMessage = await msg.channel.messages.fetch(msg.reference.messageId);
            if (referencedMessage.author.username === "judgeobito") {
                msg.reply("A ton grand âge, tu fais encore ça ? Ressaisis-toi !");
                return;
            }
        }
        if (msg.mentions.users.some(user => user.username === "judgeobito")) {
            msg.reply("A ton grand âge, tu fais encore ça ? Ressaisis-toi !");
            return;
        }
    } else if (msg.mentions.users.some(user => user.username === "judgeobito")) {
        msg.reply("Bonjour,\n\n" +
        "Merci pour votre message. Le St Gouverneur n'est pas disponible actuellement. " +
        "Il est sur l'île d'Apagnan mais il sera bientôt de retour pour coubeh un max avec le VC.\n\n" +
        "Merci de votre compréhension.\n\n" +
        "Cordialement,\n" +
        "Sa grognasse de secrétaire.");
    }


    if (msg.content.includes("quoi") || msg.content.includes("koi")) {
      msg.channel.send("coubeh, tu connais !");
    } else if (msg.content.includes("pourquoi") || msg.content.includes("pour quoi")) {
      msg.channel.send("pour coubeh j'pense mon reuf");
    } else if (msg.content.includes("qui")) {
        msg.channel.send("kette comme d'hab !");
    } else if (msg.content.includes("pour qui") || msg.content.includes("pour ki")) {
      msg.channel.send("pour kette j'crois bien");
    }
});
  
// bot.once('ready', async() => {
//   const messages = [];
//   const fetchedMessages = await ctx.channel.messages.fetch({ limit: null });

//   fetchedMessages.forEach(message => {
//       if (message.author.id === memberID) {
//           messages.push(message);
//       }
//   });

//   messages.forEach(message => {
//       msg.channel.send(message.content);
//   });

//     console.log('Bot is ready!');
// });


require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ]
});

bot.login(process.env.TOKEN_BOT);

function checkPresence(userId, guild) {
  const member = guild.members.cache.get(userId);
  if (member) {
    const presenceStatus = member.presence?.status;
    return presenceStatus === 'online';
  }
  return false;
}

bot.on('messageCreate', async function(msg) {
    if (msg.author.bot || msg.author.username === "judgeobito") return;

    if (msg.content.includes("coubeh") || msg.content.includes("kette") || msg.content.includes("quette") || msg.content.includes("feur") || msg.content.includes("quete")) {
        if (msg.reference) {
            const referencedMessage = await msg.channel.messages.fetch(msg.reference.messageId);
            if (referencedMessage.author.username === "judgeobito" || referencedMessage.author.username === "cocacolack") {
                msg.reply("A ton grand âge, tu fais encore ça ? Ressaisis-toi !");
                return;
            }
        }
        if (msg.mentions.users.some(user => user.username === "judgeobito") && msg.mentions.users.some(user => user.username === "cocacolack")) {
            msg.reply("A ton grand âge, tu fais encore ça ? Ressaisis-toi !");
            return;
        }
    } else if (msg.mentions.users.some(user => user.username === "judgeobito") && checkPresence(msg.mentions.users.find(user => user.username === "judgeobito").id, msg.guild)) {
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
  
bot.once('ready', () => {
  console.log('Bot is ready!');
});


const { Coubeh } = require('./js/coubeh.js');
const { Twitter } = require('./js/twitter.js');
const { config } = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');

config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

bot.login(process.env.TOKEN_BOT).catch((err) => {
  console.error('Failed to login:', err);
});

bot.once('ready', () => {
  console.log('Bot prêt !');
});

bot.on('messageCreate', async (msg) => {
  const twitterRes = await Twitter(msg.content);

  if (twitterRes && !msg.author.bot) {
    msg.delete().then(() => {
      msg.channel.send(twitterRes);
    });
  }

  if (
    msg.author.bot ||
    msg.author.username === 'judgeobito' ||
    msg.author.username === 'cocacolack'
  )
    return;

  const coubehRes = await Coubeh(msg.content);

  if (coubehRes) {
    msg.channel.send(coubehRes);
  }
});

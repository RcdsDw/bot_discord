import { bot } from './lib/bot';
import { Guild, Message, userMention } from 'discord.js';
import moment from 'moment';

// Reply
import { Coubeh } from './ts/reply/coubeh';
import { AntiCoubeh } from './ts/reply/anti_coubeh';
// Automation
import { RelinkSocialVideos } from './ts/automation/relink_social_videos';
import { CheckPresence } from './ts/automation/check_presence';
import { AddLoose, CountLooses } from './ts/automation/looses';
// Users
import { ListAll } from './ts/users/list_all';

import trashs from './datas/trashs.json';
import compliments from './datas/compliments.json';
import karyan from './datas/karyan.json';

import * as dotenv from 'dotenv';
dotenv.config();

moment.locale('fr');

bot
  .login(process.env.TOKEN_BOT)
  .then(() => {
    if (bot.user) {
      console.log('Logged in as', bot.user.tag);
    }
  })
  .catch((err: Error) => {
    console.error('Failed to login:', err);
  });

bot.on('messageCreate', async (msg: Message) => {
  const authorId = msg.author.id;
  const author = msg.author;
  const guild = msg.guild;
  const channel = msg.channel;
  const content = msg.content;

  const listVIP = ['judgeobito', 'cocacolack'];

  //*---------------------------------------*
  // Lister les utilisateurs
  //*---------------------------------------*

  if (content === '!LI') {
    ListAll(msg, author);
  }

  //*---------------------------------------*
  // Tiktok/Twitter refont url for play vidéo on discord
  //*---------------------------------------*

  if (
    content.includes('twitter') ||
    content.includes('tiktok') ||
    content.includes('x.com')
  ) {
    const RelinkVideosSocialRes = await RelinkSocialVideos(content);

    if (RelinkVideosSocialRes && !author.bot) {
      msg
        .delete()
        .then(() => {
          channel.send(
            RelinkVideosSocialRes.concat(
              `\n`,
              `Envoyé par ${userMention(authorId)}`,
            ),
          );
        })
        .catch((err) => {
          console.error(err);
        });
      return;
    }
  }

  //*---------------------------------------*
  // Mathis react
  //*---------------------------------------*

  if (author.username === 'karyan') {
    const number = Math.floor(Math.random() * 20);

    if (number === 3) {
      const reply = karyan[Math.floor(Math.random() * karyan.length)];
      const replyMessage = await msg.reply({
        content: reply,
      });
      replyMessage.react('🍔');
      replyMessage.react('🍟');
      replyMessage.react('🍦');
      return;
    }
  }

  //*---------------------------------------*
  // Check if is a reply
  //*---------------------------------------*

  let referencedMessage: Message<boolean> | undefined;

  if (msg.reference) {
    referencedMessage = await channel.messages.fetch(
      msg.reference.messageId as string,
    );
  }

  if (
    ((bot.user &&
      msg.reference &&
      referencedMessage &&
      referencedMessage.author.id === bot.user.id) ||
      (bot.user && msg.mentions.has(bot.user))) &&
    !author.bot
  ) {
    if (author.username === 'judgeobito') {
      msg.reply(
        `${moment().hour() < 19 ? 'Bonjour ' : 'Bonsoir '}` +
          compliments[Math.floor(Math.random() * compliments.length)],
      );
    } else if (author.username === 'cocacolack') {
      msg.reply("J'accepte et mon coeur reste ouvert.");
    } else {
      msg.reply(
        'À qui tu crois parler, ' +
          trashs[Math.floor(Math.random() * trashs.length)] +
          ' ?',
      );
    }
    return;
  }

  //*---------------------------------------*
  // Check author
  //*---------------------------------------*

  if (
    author.bot ||
    author.username === 'judgeobito' ||
    author.username === 'cocacolack'
  )
    return;

  //*---------------------------------------*
  // Bot anti coubeh/kette/feur
  //*---------------------------------------*

  if (
    (msg.reference &&
      referencedMessage &&
      listVIP.some((vip) => referencedMessage.author.username === vip)) ||
    listVIP.some((vip) =>
      msg.mentions.users.some((user) => user.username === vip),
    )
  ) {
    const antiCoubehRes = await AntiCoubeh(content);
    if (antiCoubehRes) {
      msg.reply(antiCoubehRes);
      return;
    }
  }

  //*---------------------------------------*
  // Bot coubeh/kette/feur
  //*---------------------------------------*

  const coubehRes = await Coubeh(content);
  if (coubehRes) {
    await AddLoose(msg.author.id)
      .then(async () => {
        await CountLooses(msg.author.id).then(async (count) => {
          msg.reply(coubehRes + `\n ${count} - 0, bouffon.`);
        });
      })
      .catch(() => {
        msg.reply(coubehRes);
      });
    return;
  }

  //*---------------------------------------*
  // Away from keyboard
  //*---------------------------------------*

  if (
    msg.mentions.users.some((user) => user.username === 'judgeobito') &&
    CheckPresence(
      msg.mentions.users.find((user) => user.username === 'judgeobito')!.id,
      guild as Guild,
    )
  ) {
    msg.reply(
      "Merci pour votre message. Le maître n'est pas disponible actuellement.\n\n" +
        "Il est sur l'île d'Apagnan mais il sera bientôt de retour pour coubeh un max avec le VC.\n\n" +
        'Merci de votre compréhension.\n\n' +
        'Cordialement,\n' +
        'Son agent.',
    );
    return;
  }
});

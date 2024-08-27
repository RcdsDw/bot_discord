import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import moment from 'moment';

import { Guild, Message, userMention } from 'discord.js';

import { DiscordUser } from './lib/models/users';
import { bot } from './lib/bot';

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
import ka from './datas/ka.json';
import ryan from './datas/ryan.json';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static(path.join(__dirname, './public')));

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

app.get('/leaderboard', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = (await DiscordUser.findAll()).sort(
      (a, b) => b.number_of_looses - a.number_of_looses,
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la récupération des données.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
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
    const number = Math.floor(Math.random() * 30);

    if (number === 3) {
      const reply = `${ka[Math.floor(Math.random() * ka.length)]} ${ryan[Math.floor(Math.random() * ryan.length)]}`;
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
          return;
        });
      })
      .catch(() => {
        msg.reply(coubehRes);
        return;
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

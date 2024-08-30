import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import moment from 'moment';

import { ChannelType, Guild, Message, userMention } from 'discord.js';

import { DiscordUser } from './lib/models/users';
import { bot } from './lib/bot';

// Reply
import { Coubeh } from './ts/reply/coubeh';
import { AntiCoubeh } from './ts/reply/anti_coubeh';
// Automation
import { RelinkSocialVideos } from './ts/automation/relink_social_videos';
import { CheckPresence } from './ts/automation/check_presence';
import { AddLoose, CountLooses } from './ts/automation/looses';

import trashs from './datas/trashs.json';
import dirgeant from './datas/dirigeant.json';
import compliments from './datas/compliments.json';
import ka from './datas/ka.json';
import ryan from './datas/ryan.json';
import parler from './datas/parler.json';

dotenv.config();

const app = express();
const port = process.env.PORT;

moment.locale('fr');
export const listVIP = ['246753473587052555', '110357707059380224', '700823009643987014'];

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$-EXPRESS-$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

app.use(express.static(path.join(__dirname, './public')));

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

app.get('/', (req: Request, res: Response) => {
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

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

setInterval(async () => {
  const guild = bot.guilds.cache.get('1169725987454464051');

  if (guild) {
    const members = await guild.members.fetch();
    const channels = await guild.channels.fetch();
  
    for (const member of members.values()) {
      if (member.user.username === "judgeobito") {
        const target = member.user;
        let isInVoiceChannel = false;

        for (const channel of channels.values()) {
          if (channel?.type === ChannelType.GuildVoice && channel.members.has(target.id)) {
            isInVoiceChannel = true;
            break;
          }
        }

        const logChannel = channels.find(c => c && c.id === "1269071240568635514");

        if (isInVoiceChannel) {
          try {
            await target.send("Sors du coubeh !");
            isInVoiceChannel = false;
          } catch (error) {
            console.error("Impossible d'envoyer un message privé à l'utilisateur:", error);
          }

          if (logChannel && logChannel.isTextBased()) {
            logChannel.send('Fait !');
          }
          return;
        } else {
          if (logChannel && logChannel.isTextBased()) {
            logChannel.send('Aie !');
          }
          return;
        }
      }
    }
  }
}, 1000 * 5);

bot.on('messageCreate', async (msg: Message) => {
  const authorId = msg.author.id;
  const author = msg.author;
  const guild = msg.guild;
  const channel = msg.channel;
  const content = msg.content;

  // Moi, Ben, Sam

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
  // Me react
  //*---------------------------------------*

  if (author.username === 'judgeobito') {
    msg.react('🐼');
  }
  
  //*---------------------------------------*
  // Mathis react
  //*---------------------------------------*

  if (author.username === 'karyan') {
    const easteregg = Math.floor(Math.random() * 500);
    const number = Math.floor(Math.random() * 30);

    if (number === 3) {
      const reply = `${ka[Math.floor(Math.random() * ka.length)]} ${ryan[Math.floor(Math.random() * ryan.length)]}.`;
      const replyMessage = await msg.reply({
        content: reply,
      });
      replyMessage.react('🍔');
      replyMessage.react('🍟');
      replyMessage.react('🍦');
      return;
    }

    if (easteregg === 418) {
      const reply =
        '# À Mathis, l’ami précieux\n\n' +
        'Quand le soleil se lève, en ce jour radieux,\n' +
        'Un éclat de bonheur illumine nos yeux.\n' +
        'On se souvient des jours où tout semblait parfait,\n' +
        'Immortelles les heures que l’on partageait.\n\n' +
        'Cher Mathis, ton amitié est un grand trésor,\n' +
        'Ou le rire et la joie battent tous les records.\n' +
        'Un pont entre nos cœurs, sans cesse renouvelé,\n' +
        'Baigne dans les couleurs de nos rêves enchantés.\n\n' +
        'Et si parfois le sort nous jette des défis,\n' +
        'Haillons-nous ensemble, vers des cieux infinies.';
      const replyMessage = await msg.reply({
        content: reply,
      });
      replyMessage.react('❤️');
      replyMessage.react('🧡');
      replyMessage.react('💛');
      replyMessage.react('💚');
      replyMessage.react('💙');
      replyMessage.react('💜');
      replyMessage.react('🤎');
      replyMessage.react('🖤');
      replyMessage.react('🤍');
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
          dirgeant[Math.floor(Math.random() * dirgeant.length)] +
          ", " +
          compliments[Math.floor(Math.random() * compliments.length)],
      );
    } else if (author.username === 'cocacolack') {
      msg.reply("J'accepte et mon coeur reste ouvert.");
    } else {
      if (msg.content.includes('@here')) {
        if (listVIP.some((vip) => author.id === vip)) {
          return;
        } else {
          msg.reply(
            'Arrête de here, ' +
              trashs[Math.floor(Math.random() * trashs.length)] +
              ' !',
          );
        }
      } else if (msg.content.includes('@everyone')) {
        if (listVIP.some((vip) => author.id === vip)) {
          return;
        } else {
          msg.reply(
            'Arrête de everyone, ' +
              trashs[Math.floor(Math.random() * trashs.length)] +
              ' !',
          );
        }
      } else {
        msg.reply(
          `${parler[Math.floor(Math.random() * parler.length)]}, ` +
            trashs[Math.floor(Math.random() * trashs.length)] +
            ' ?',
        );
      }
    }
    return;
  }

  //*---------------------------------------*
  // Check author
  //*---------------------------------------*

  if (
    author.bot || 
    listVIP.some((vip) => author.id === vip)
  )
    return;

  //*---------------------------------------*
  // Bot anti coubeh/kette/feur
  //*---------------------------------------*

  if (
    (msg.reference &&
      referencedMessage &&
      listVIP.some((vip) => referencedMessage.author.id === vip)) ||
    listVIP.some((vip) =>
      msg.mentions.users.some((user) => user.id === vip),
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
      "Merci pour votre message. Le maître est actuellement sur l'île d'Apagnan.\n\n" +
        'Kufgu.',
    );
    return;
  }
});

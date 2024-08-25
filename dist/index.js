"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./lib/bot");
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
// Reply
const coubeh_1 = require("./ts/reply/coubeh");
const anti_coubeh_1 = require("./ts/reply/anti_coubeh");
// Automation
const relink_social_videos_1 = require("./ts/automation/relink_social_videos");
const check_presence_1 = require("./ts/automation/check_presence");
const looses_1 = require("./ts/automation/looses");
// Users
const list_all_1 = require("./ts/users/list_all");
const trashs_json_1 = __importDefault(require("./datas/trashs.json"));
const compliments_json_1 = __importDefault(require("./datas/compliments.json"));
const ka_json_1 = __importDefault(require("./datas/ka.json"));
const ryan_json_1 = __importDefault(require("./datas/ryan.json"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
moment_1.default.locale('fr');
bot_1.bot
    .login(process.env.TOKEN_BOT)
    .then(() => {
    if (bot_1.bot.user) {
        console.log('Logged in as', bot_1.bot.user.tag);
    }
})
    .catch((err) => {
    console.error('Failed to login:', err);
});
bot_1.bot.on('messageCreate', async (msg) => {
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
        (0, list_all_1.ListAll)(msg, author);
    }
    //*---------------------------------------*
    // Tiktok/Twitter refont url for play vidéo on discord
    //*---------------------------------------*
    if (content.includes('twitter') ||
        content.includes('tiktok') ||
        content.includes('x.com')) {
        const RelinkVideosSocialRes = await (0, relink_social_videos_1.RelinkSocialVideos)(content);
        if (RelinkVideosSocialRes && !author.bot) {
            msg
                .delete()
                .then(() => {
                channel.send(RelinkVideosSocialRes.concat(`\n`, `Envoyé par ${(0, discord_js_1.userMention)(authorId)}`));
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
            const reply = `${ka_json_1.default[Math.floor(Math.random() * ka_json_1.default.length)]} ${ryan_json_1.default[Math.floor(Math.random() * ryan_json_1.default.length)]}`;
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
    let referencedMessage;
    if (msg.reference) {
        referencedMessage = await channel.messages.fetch(msg.reference.messageId);
    }
    if (((bot_1.bot.user &&
        msg.reference &&
        referencedMessage &&
        referencedMessage.author.id === bot_1.bot.user.id) ||
        (bot_1.bot.user && msg.mentions.has(bot_1.bot.user))) &&
        !author.bot) {
        if (author.username === 'judgeobito') {
            msg.reply(`${(0, moment_1.default)().hour() < 19 ? 'Bonjour ' : 'Bonsoir '}` +
                compliments_json_1.default[Math.floor(Math.random() * compliments_json_1.default.length)]);
        }
        else if (author.username === 'cocacolack') {
            msg.reply("J'accepte et mon coeur reste ouvert.");
        }
        else {
            msg.reply('À qui tu crois parler, ' +
                trashs_json_1.default[Math.floor(Math.random() * trashs_json_1.default.length)] +
                ' ?');
        }
        return;
    }
    //*---------------------------------------*
    // Check author
    //*---------------------------------------*
    if (author.bot ||
        author.username === 'judgeobito' ||
        author.username === 'cocacolack')
        return;
    //*---------------------------------------*
    // Bot anti coubeh/kette/feur
    //*---------------------------------------*
    if ((msg.reference &&
        referencedMessage &&
        listVIP.some((vip) => referencedMessage.author.username === vip)) ||
        listVIP.some((vip) => msg.mentions.users.some((user) => user.username === vip))) {
        const antiCoubehRes = await (0, anti_coubeh_1.AntiCoubeh)(content);
        if (antiCoubehRes) {
            msg.reply(antiCoubehRes);
            return;
        }
    }
    //*---------------------------------------*
    // Bot coubeh/kette/feur
    //*---------------------------------------*
    const coubehRes = await (0, coubeh_1.Coubeh)(content);
    if (coubehRes) {
        await (0, looses_1.AddLoose)(msg.author.id)
            .then(async () => {
            await (0, looses_1.CountLooses)(msg.author.id).then(async (count) => {
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
    if (msg.mentions.users.some((user) => user.username === 'judgeobito') &&
        (0, check_presence_1.CheckPresence)(msg.mentions.users.find((user) => user.username === 'judgeobito').id, guild)) {
        msg.reply("Merci pour votre message. Le maître n'est pas disponible actuellement.\n\n" +
            "Il est sur l'île d'Apagnan mais il sera bientôt de retour pour coubeh un max avec le VC.\n\n" +
            'Merci de votre compréhension.\n\n' +
            'Cordialement,\n' +
            'Son agent.');
        return;
    }
});

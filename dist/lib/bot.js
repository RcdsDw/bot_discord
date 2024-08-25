"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const command_1 = require("./command");
const discord_js_1 = require("discord.js");
const db_1 = require("./db");
const users_1 = require("./models/users");
const guilds_1 = require("./models/guilds");
exports.bot = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
});
exports.bot.commands = (0, command_1.getCommands)();
exports.bot.on('ready', async () => {
    try {
        await (0, db_1.connectDb)();
        console.log('Connecter à la base de données avant de continuer');
        for (const guild of exports.bot.guilds.cache.values()) {
            console.log(`Guilde ${guild.name} trouvée`);
            if (!guild) {
                console.log('Guild not found');
                return;
            }
            const [discordGuild, guildCreated] = await guilds_1.DiscordGuild.findOrCreate({
                where: { guild_id: guild.id },
                defaults: {
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png',
                },
            });
            const members = await guild.members.fetch();
            for (const member of members.values()) {
                console.log(`Membre ${member.user.username} trouvé`);
                if (member.user.bot)
                    continue;
                const [user, created] = await users_1.DiscordUser.findOrCreate({
                    where: { user_id: member.user.id },
                    defaults: {
                        global_name: member.nickname || member.user.globalName || member.user.username,
                        avatar: member.user.avatarURL() ||
                            'https://cdn.discordapp.com/embed/avatars/0.png',
                        number_of_looses: 0,
                    },
                });
                if (!created) {
                    await user.update({
                        global_name: member.nickname || member.user.globalName || member.user.username,
                        avatar: member.user.avatarURL() ||
                            'https://cdn.discordapp.com/embed/avatars/0.png',
                    });
                }
                await user.$add('discordGuilds', discordGuild.id);
            }
            if (!guildCreated) {
                await discordGuild.update({
                    name: guild.name,
                    avatar: guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png',
                });
            }
        }
        console.log('Tous les membres ont été traités et associés aux guildes.');
    }
    catch (error) {
        console.error('Error while connecting to the database:', error);
    }
});
// Redirige sur les slashs commands
exports.bot.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
        else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    }
});

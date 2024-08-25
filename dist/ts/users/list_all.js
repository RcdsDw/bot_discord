"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAll = ListAll;
const discord_js_1 = require("discord.js");
const users_1 = require("../../lib/models/users");
const guilds_1 = require("../../lib/models/guilds");
async function ListAll(msg, author) {
    const guildId = msg.guildId;
    if (!guildId) {
        msg.reply('Impossible de récupérer la guilde.');
        return;
    }
    try {
        const guild = await guilds_1.DiscordGuild.findByPk(guildId, {
            include: users_1.DiscordUser,
        });
        if (!guild || !guild.discordUsers || guild.discordUsers.length === 0) {
            msg.reply('La liste est vide pour cette guilde.');
            return;
        }
        const users = guild.discordUsers;
        let i = 0;
        const updateUserEmbed = (i) => {
            const user = users[i];
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(user.global_name)
                .setImage(user.avatar)
                .setFooter({
                text: `Utilisateur ${i + 1} sur ${users.length} \n S'est fait avoir ${user.number_of_looses} fois.`,
            });
            return embed;
        };
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('previous')
            .setLabel('<')
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId('next')
            .setLabel('>')
            .setStyle(discord_js_1.ButtonStyle.Secondary));
        const embedMessage = await msg.channel.send({
            embeds: [updateUserEmbed(i)],
            components: [row],
        });
        const filter = (interaction) => {
            return (['previous', 'next'].includes(interaction.customId) &&
                interaction.user.id === author.id);
        };
        const collector = embedMessage.createMessageComponentCollector({
            filter,
            time: 200000,
        });
        collector.on('collect', (interaction) => {
            if (interaction.customId === 'previous') {
                i = i > 0 ? i - 1 : users.length - 1;
            }
            else if (interaction.customId === 'next') {
                i = i < users.length - 1 ? i + 1 : 0;
            }
            interaction.update({
                embeds: [updateUserEmbed(i)],
                components: [row],
            });
        });
        collector.on('end', () => {
            const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId('previous')
                .setLabel('<')
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(true), new discord_js_1.ButtonBuilder()
                .setCustomId('next')
                .setLabel('>')
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(true));
            embedMessage.edit({ components: [disabledRow] });
        });
    }
    catch (error) {
        console.error('Console error list users from database:', error);
        msg.reply('La liste ne peut pas être récupérée.');
    }
}

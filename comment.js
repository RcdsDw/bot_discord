// // Suprimer la DB
// if (msg.content.startsWith('!delete')) {
//     if (msg.author.username === 'judgeobito') {
//       try {
//         await db.query('DELETE * FROM users');
//         msg.reply('Vous avez supprimé la base de données.');
//       } catch (error) {
//         console.error('Error deleting user from database:', error);
//         msg.reply('Une erreur est survenue lors de la suppression de la base de données.');
//       }
//     }
//   }

//   // Ajouter un utilisateur à la DB
//   if (msg.content.startsWith('!addme')) {
//     createTableIfNotExists();
//     const img = msg.author.displayAvatarURL();
//     const username = msg.author.globalName;
//     const discordId = msg.author.id;

//     try {
//       await db.query(
//         'INSERT INTO users (discord_id, username, img) VALUES ($1, $2, $3)',
//         [discordId, username, img],
//       );
//       msg.reply('Vous avez été ajouté à la base de données.');
//     } catch (error) {
//       console.error('Error adding user to database:', error);
//       msg.reply('Vous ne pouvez pas être ajouté à la base de données.');
//     }
//   }

//   // Lister les utilisateurs
//   if (msg.content.startsWith('!list')) {
//     try {
//       let res = await db.query('SELECT * FROM users');
//       res = res.rows;

//       if (res.length === 0) {
//         msg.reply('Aucun utilisateur enregistré.');
//         return;
//       }

//       let index = 0;

//       const updateUserEmbed = (index) => {
//         const user = res[index];
//         const embed = new MessageEmbed()
//           .setTitle(user.username)
//           .setImage(user.img || 'URL_DE_IMAGE_PAR_DEFAUT')
//           .setFooter(`Utilisateur ${index + 1} sur ${res.length}`);

//         return embed;
//       };

//       const row = new MessageActionRow().addComponents(
//         new MessageButton()
//           .setCustomId('previous')
//           .setLabel('◀️')
//           .setStyle('PRIMARY'),
//         new MessageButton()
//           .setCustomId('next')
//           .setLabel('▶️')
//           .setStyle('PRIMARY'),
//       );

//       const embedMessage = await msg.channel.send({
//         embeds: [updateUserEmbed(index)],
//         components: [row],
//       });

//       const filter = (interaction) => {
//         return (
//           ['previous', 'next'].includes(interaction.customId) &&
//           interaction.user.id === msg.author.id
//         );
//       };

//       const collector = embedMessage.createMessageComponentCollector({
//         filter,
//         time: 60000,
//       });

//       collector.on('collect', (interaction) => {
//         if (interaction.customId === 'previous') {
//           index = index > 0 ? index - 1 : res.length - 1;
//         } else if (interaction.customId === 'next') {
//           index = index < res.length - 1 ? index + 1 : 0;
//         }

//         interaction.update({
//           embeds: [updateUserEmbed(index)],
//           components: [row],
//         });
//       });

//       collector.on('end', () => {
//         const disabledRow = new MessageActionRow().addComponents(
//           new MessageButton()
//             .setCustomId('previous')
//             .setLabel('◀️')
//             .setStyle('PRIMARY')
//             .setDisabled(true),
//           new MessageButton()
//             .setCustomId('next')
//             .setLabel('▶️')
//             .setStyle('PRIMARY')
//             .setDisabled(true),
//         );

//         embedMessage.edit({ components: [disabledRow] });
//       });
//     } catch (error) {
//       console.error('Console error list users from database:', error);
//       msg.reply('La liste ne peut pas être récupérée.');
//     }
//   }
const { EmbedBuilder } = require('discord.js');

async function Tiktok(msg) {
  const tiktokReg =
    /^https:\/\/www\.tiktok\.com/ | /^https:\/\/vm\.tiktok\.com\//;
  let count = 0;
  if (msg.match(tiktokReg) && count === 0) {
    count++;
    if (msg.content.startsWith('!tiktok')) {
      const args = msg.content.split(' ');
      const tiktokUrl = args[1];

      if (!tiktokUrl) {
        msg.channel.send('Merci de fournir une URL TikTok.');
        return;
      }

      try {
        // Utilise l'API TikTok pour obtenir les données de la vidéo
        const response = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`,
        );
        const data = await response.json();

        const embed = new EmbedBuilder()
          .setTitle(data.title)
          .setURL(tiktokUrl)
          .setAuthor({ name: data.author_name, url: data.author_url })
          .setThumbnail(data.thumbnail_url)
          .setDescription(data.html)
          .setImage(data.thumbnail_url)
          .setFooter({
            text: 'TikTok',
            iconURL: 'https://www.tiktok.com/favicon.ico',
          });

        msg.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        msg.channel.send('Erreur lors de la récupération de la vidéo.');
      }
    }
  }
}

module.exports = {
  Tiktok,
};

const { EmbedBuilder } = require('discord.js');

async function Tiktok(msg) {
  const tiktokReg = /^https:\/\/www\.tiktok\.com/;
  const tiktokVmReg = /^https:\/\/vm\.tiktok\.com\//;

  let count = 0;
  if (
    (msg.content.match(tiktokReg) || msg.content.match(tiktokVmReg)) &&
    count === 0
  ) {
    count++;
    try {
      console.log('🚀 ~ Tiktok ~ msg.content:', msg.content);
      // Utilise l'API TikTok pour obtenir les données de la vidéo
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(msg.content)}`,
      );
      const data = await response.json();
      console.log('🚀 ~ Tiktok ~ data:', data);

      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setURL(msg.content)
        .setAuthor({ name: data.author_name, url: data.author_url })
        .setThumbnail(data.thumbnail_url)
        .setDescription(data.html)
        .setImage(data.thumbnail_url)
        .setFooter({
          text: 'TikTok',
          iconURL: 'https://www.tiktok.com/favicon.ico',
        });

      msg.delete.then(() => {
        msg.channel.send({ embeds: [embed] });
      });
    } catch (error) {
      console.error(error);
      msg.channel.send('Erreur lors de la récupération de la vidéo.');
    }
  }
}

module.exports = {
  Tiktok,
};

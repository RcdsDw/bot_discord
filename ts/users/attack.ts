import { userMention } from 'discord.js';
import ryan from '../../datas/ryan.json';
import trashV2 from '../../datas/trashV2.json';

export async function Attack(interaction: any) {
  const reply = `${userMention("113722828695535623")} Oh ${ryan[Math.floor(Math.random() * ryan.length)]}, ${trashV2[Math.floor(Math.random() * trashV2.length)]} !`;
  const replyMessage = await interaction.reply({
    content: reply,
  });
  replyMessage.react("🅶");
  replyMessage.react("🆁");
  replyMessage.react("🅾");
  replyMessage.react("🆂");
  replyMessage.react("🅵");
  replyMessage.react("🅳");
  replyMessage.react("🅿");
  return;
}
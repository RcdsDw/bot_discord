import { userMention } from 'discord.js';
import ryan from '../../datas/ryan.json';

const emojis = ["🅶", "🆁", "🅾", "🆂", "🅵", "🅳", "🅿"]
const test = ["🅾", "🅿"]

export async function Attack(interaction: any) {
  const reply = `${userMention("113722828695535623")} Oh ${ryan[Math.floor(Math.random() * ryan.length)]}, nique ta mère de là !`;
  const replyMessage = await interaction.reply({
    content: reply,
  });

  for (let i = 0; i < test.length; i++) {
    replyMessage.react(`${test[i]}`);
  }
  return;
}
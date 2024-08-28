import { userMention } from 'discord.js';
import ryan from '../../datas/ryan.json';

export async function Attack(interaction: any) {
  interaction.reply(
    `${userMention("113722828695535623")} Oh ${ryan[Math.floor(Math.random() * ryan.length)]}, nique ta mère de là !`,
  );
}
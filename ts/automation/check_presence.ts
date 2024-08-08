import { Guild } from 'discord.js';

export function CheckPresence(userId: string, guild: Guild) {
  const member = guild.members.cache.get(userId);
  if (member) {
    const presenceStatus = member.presence?.status;
    return presenceStatus !== 'online' && presenceStatus !== 'dnd';
  }
  return false;
}

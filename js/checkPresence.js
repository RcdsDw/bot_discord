function checkPresence(userId, guild) {
  const member = guild.members.cache.get(userId);
  if (member) {
    const presenceStatus = member.presence?.status;
    return presenceStatus !== 'online';
  }
  return false;
}

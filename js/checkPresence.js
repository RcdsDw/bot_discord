function CheckPresence(userId, guild) {
  const member = guild.members.cache.get(userId);
  if (member) {
    const presenceStatus = member.presence?.status;
    return presenceStatus !== 'online' && presenceStatus !== 'dnd';
  }
  return false;
}

module.exports = {
  CheckPresence,
};

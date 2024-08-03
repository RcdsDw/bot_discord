function Twitter(msg) {
  const xReg = /^https:\/\/x\.com/;
  const twitterReg = /^https:\/\/twitter\.com/;

  if (msg.content.match(twitterReg)) {
    const newMsg = msg.content.replace(twitterReg, 'https://fxtwitter.com');
    return newMsg;
  } else if (msg.content.match(xReg)) {
    const newMsg = msg.content.replace(xReg, 'https://fxtwitter.com');
    return newMsg;
  }
}

module.exports = {
  Twitter,
};

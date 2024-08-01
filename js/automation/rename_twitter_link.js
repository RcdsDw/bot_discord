function Twitter(msg) {
  const twitterReg = /^https:\/\/x\.com/;
  let count = 0;
  if (msg.match(twitterReg) && count === 0) {
    count++;
    const newMsg = msg.replace(twitterReg, 'https://fxtwitter.com');
    return newMsg;
  }
}

module.exports = {
  Twitter,
};

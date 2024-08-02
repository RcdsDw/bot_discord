function Twitter(msg) {
  const twitterReg = /^https:\/\/x\.com/;
  let count = 0;
  if (msg.content.match(twitterReg) && count === 0) {
    console.log('🚀 ~ Twitter ~ msg.content:', msg.content);
    count++;
    const newMsg = msg.content.replace(twitterReg, 'https://fxtwitter.com');
    return newMsg;
  }
}

module.exports = {
  Twitter,
};

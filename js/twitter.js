function Twitter(msg) {
    const twitterReg = /^https:\/\/x\.com/;
    if (msg.test(twitterReg)) {
        const newMsg = msg.replace(twitterReg, 'https://fxtwitter.com');
        return newMsg;
    }
}

module.exports = { 
    Twitter 
};
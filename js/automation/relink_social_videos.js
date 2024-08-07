async function RelinkSocialVideos(msg) {
  const twitterReg = [/^https?:\/\/x\.com/, /^https?:\/\/twitter\.com/];
  const tiktokReg = /^https?:\/\/(www\.)?tiktok\.com/;
  const vmTiktokReg = /^https?:\/\/vm.tiktok\.com/;

  const res = {
    twitter: 'https://fxtwitter.com',
    tiktok: 'https://vxtiktok.com',
  };

  // Vérification et remplacement pour Twitter
  for (let reg of twitterReg) {
    if (reg.test(msg)) {
      const newMsg = msg.replace(reg, res.twitter);
      return newMsg;
    }
  }

  // Vérification et remplacement pour TikTok
  if (tiktokReg.test(msg)) {
    const newMsg = msg.replace(tiktokReg, res.tiktok);
    return newMsg;
  } else if (vmTiktokReg.test(msg)) {
    const data = await followRedirect(msg);
    const index = data.match(/[?]/).index;
    let newData = data.slice(0, index);

    if (tiktokReg.test(newData)) {
      const newMsg = newData.replace(tiktokReg, res.tiktok);
      return newMsg;
    }
  }
}

async function followRedirect(url) {
  const response = await fetch(url, { redirect: 'manual' });
  const location = response.headers.get('location');

  if (!location) {
    console.error('Could not follow redirect', url);
    return;
  }

  return location;
}

module.exports = {
  RelinkSocialVideos,
};

function AntiCoubeh(msg) {
  const coubehReg = /\bcoubeh(?=\s|$)/i;
  const ketteReg = /\b(kette|quette|quete|kete)(?=\s|$)/i;
  const feurReg = /\bfeur(?=\s|$)/i;

  if (msg.match(coubehReg)) {
    return 'À ton âge tu dis "coubeh" ? Ressaisis toi !';
  } else if (msg.match(ketteReg)) {
    return 'Tu es cringe frérot';
  } else if (msg.match(feurReg)) {
    return 'Tu dis "feur" à qui tocard ?';
  }
}

module.exports = {
  AntiCoubeh,
};

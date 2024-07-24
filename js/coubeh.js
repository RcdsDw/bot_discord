function Coubeh(msg) {
  const quiReg = /\b(qui|ki)(?=\s.*\?|$)/i;
  const quoiReg = /\b(quoi|koi)(?=\s.*\?|$)/i;
  const pourQuiReg = /\b(pour qui|pour ki)(?=\s.*\?|$)/i;
  const pourQuoiReg = /\b(pour quoi|pour koi|pourquoi|pourkoi)(?=\s.*\?|$)/i;

  if (msg.match(pourQuoiReg)) {
    return 'Pour coubeh je pense mon reuf !';
  } else if (msg.match(pourQuiReg)) {
    return 'Pour kette mon pote !';
  } else if (msg.match(quoiReg)) {
    return 'Coubeh mon gars tu connais !';
  } else if (msg.match(quiReg)) {
    return 'Kette mon grand, tu le sais !';
  }
}

module.exports = {
  Coubeh,
};

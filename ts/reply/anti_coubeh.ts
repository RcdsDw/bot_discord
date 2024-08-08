export async function AntiCoubeh(msg: string) {
  const coubehReg = /\bcoubeh(?=\s|$)/;
  const ketteReg = /\b(kette|quette|quete|kete)(?=\s|$)/;
  const feurReg = /\bfeur(?=\s|$)/;

  if (msg.match(coubehReg)) {
    return 'À ton âge tu dis "coubeh" ? Ressaisis toi !';
  } else if (msg.match(ketteReg)) {
    return 'Tu es cringe frérot';
  } else if (msg.match(feurReg)) {
    return 'Tu dis "feur" à qui tocard ?';
  }
}

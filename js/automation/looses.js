const db = require('../../lib/db');

async function AddLoose(id) {
  try {
    await db.query(
      `
      UPDATE users
      SET number_of_looses = number_of_looses + 1
      WHERE discord_id = $1
    `,
      [id],
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la table users:', error);
  }
}

async function CountLooses(id) {
  try {
    const res = await db.query(
      `
      SELECT number_of_looses
      FROM users
      WHERE discord_id = $1
    `,
      [id],
    );
    return res.rows[0].number_of_looses;
  } catch (error) {
    console.error('Erreur lors de la récupération de la table users:', error);
  }
}

module.exports = {
  AddLoose,
  CountLooses,
};

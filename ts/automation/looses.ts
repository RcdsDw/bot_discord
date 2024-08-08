import { db } from '../../lib/db';

export async function AddLoose(id: string) {
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

export async function CountLooses(id: string) {
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

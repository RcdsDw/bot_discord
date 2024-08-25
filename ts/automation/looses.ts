import { connectDb } from '../../lib/db';
import { DiscordUser } from '../../lib/models/users';

export async function AddLoose(id: string) {
  await connectDb();

  try {
    const user: DiscordUser | null = await DiscordUser.findOne({
      where: {
        user_id: id,
      },
    });
    if (user) {
      await user.update({
        number_of_looses: user.number_of_looses + 1,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la table users:', error);
  }
}

export async function CountLooses(id: string) {
  await connectDb();

  try {
    const res: DiscordUser | null = await DiscordUser.findOne({
      where: {
        user_id: id,
      },
    });
    return res ? res.number_of_looses : 0;
  } catch (error) {
    console.error('Erreur lors de la récupération de la table users:', error);
  }
}

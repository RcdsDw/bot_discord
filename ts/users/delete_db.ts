import { Message, User } from 'discord.js';
import { db } from '../../lib/db';

export async function DeleteDB(msg: Message, author: User) {
  if (author.username === 'judgeobito') {
    try {
      await db.query('DROP TABLE users');
      msg.reply('La base de données a été supprimée.');
    } catch (error) {
      console.error('Error deleting databse', error);
      msg.reply('Impossible de supprimer la base de données.');
    }
  } else {
    msg.reply("Vous n'avez pas le droit de faire ça.");
    return;
  }
}

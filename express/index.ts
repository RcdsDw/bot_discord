import express, { Request, Response } from 'express';
import path from 'path';
import { config } from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { DiscordUser } from '../lib/models/users';

config();

// Configure Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  models: [DiscordUser],
});

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static('display'));

app.get('/leaderboard', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, './html/leader_board.html'));
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate(); // Assure-toi que la connexion fonctionne
    const users = await DiscordUser.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: 'Une erreur est survenue lors de la récupération des données.',
      });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

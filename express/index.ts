import express, { Request, Response } from 'express';
import path from 'path';
import * as dotenv from 'dotenv';
import { DiscordUser } from '../lib/models/users';
import { connectDb } from '../lib/db';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static(path.join(__dirname, './public')));

connectDb().then(() => {
  app.get('/leaderboard', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './leader_board.html'));
  });

  app.get('/api/users', async (req: Request, res: Response) => {
    try {
      const users = await DiscordUser.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Une erreur est survenue lors de la récupération des données.',
      });
    }
  });

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});

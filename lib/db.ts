import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL not set');
}

export const sequelize = new Sequelize(dbUrl, {
  models: [__dirname + './models/*.ts'],
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Authentifié avec la base de données');

    await sequelize.sync({ alter: true });
    console.log('Base de données synchronisée');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    throw error;
  }
};

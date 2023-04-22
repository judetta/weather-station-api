import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectMongoDb } from './src/db/mongodb';
import { router } from './src/sensorData/sensorData.routes';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

app.use(express.json());
app.use('/', router);

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const start = async () => {
  if (mongoUri) {
    try {
      await connectMongoDb(mongoUri).then(() => {
        console.log('[server]: Connected to MongoDB');
        app.listen(port, () => {
          console.log(`[server]: Server is running at http://localhost:${port}`);
        });
      });
    } catch (error) {
      console.log('[server]: Error while connecting to MongoDB:');
      console.log(error);
    }
  } else {
    console.log('[server]: MongoDB URI is not defined!');
  }
};

start();


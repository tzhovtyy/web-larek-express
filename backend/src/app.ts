import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes';

dotenv.config();

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(routes);

const connect = async () => {
  await mongoose.connect(DB_ADDRESS);
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

connect().catch((err) => {
  console.error('Failed to start the server:', err);
  process.exit(1);
});

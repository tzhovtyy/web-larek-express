import { errors } from 'celebrate';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { DB_ADDRESS, PORT } from './config';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

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

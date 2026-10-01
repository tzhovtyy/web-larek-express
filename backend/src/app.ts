import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

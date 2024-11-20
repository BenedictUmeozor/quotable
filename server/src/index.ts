import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import z from 'zod';
import { quoteSchema } from './lib/zod';
import axios, { type AxiosError, type AxiosResponse } from 'axios';

dotenv.config();

type Quote = z.infer<typeof quoteSchema>;
const favorites: Quote[] = [];

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/quote', async (req: Request, res: Response) => {
  try {
    const { data }: AxiosResponse<Quote> = await axios.get(
      'https://dummyjson.com/quotes/random'
    );
    res.status(200).json(data);
  } catch (error) {
    const errorData = (error as AxiosError).response?.data as {
      error?: string;
    };
    res
      .status(500)
      .json({ error: errorData?.error || 'Internal Server Error' });
  }
});

app.post('/quote', async (req: Request, res: Response) => {
  try {
    const quote = quoteSchema.parse(req.body);
    const exists = favorites.find(f => f.id === quote.id);

    if (exists) throw new Error('Quote already exists');

    favorites.push(quote);
    res.status(200).json(favorites);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        details: error.errors,
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }
});

const PORT = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

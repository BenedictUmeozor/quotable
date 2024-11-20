import z from 'zod';

export const quoteSchema = z.object({
  id: z.number().positive(),
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
});

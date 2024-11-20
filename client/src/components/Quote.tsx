import type { z } from 'zod';
import type { quoteSchema } from '../lib/zod';

const Quote = ({ item }: { item: z.infer<typeof quoteSchema> }) => {
  return (
    <div className='bg-neutral-50 rounded-xl p-4 flex justify-between items-center hover:bg-neutral-100 transition-colors'>
      <div className='flex-grow pr-4'>
        <p className='text-neutral-700 text-md italic'>"{item.quote}"</p>
        <p className='text-neutral-500 text-sm mt-1'>- {item.author}</p>
      </div>
    </div>
  );
};
export default Quote;

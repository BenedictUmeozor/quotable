import { BookmarkPlus, Repeat } from 'lucide-react';
import { z } from 'zod';
import type { quoteSchema } from './lib/zod';
import { Fragment, useEffect, useState } from 'react';
import { TailwindSpinner } from './components/ui/Spinner';
import Quote from './components/Quote';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import toast, { Toaster } from 'react-hot-toast';

type IQuote = z.infer<typeof quoteSchema>;

const App = () => {
  const [currentQuote, setCurrentQuote] = useState<IQuote | null>(null);
  const [error, setError] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<IQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  const fetchQuote = async () => {
    try {
      setError(false);
      const { data }: { data: IQuote } = await axios.get('/quote');
      setCurrentQuote(data);
    } catch {
      setError(true);
    }
  };

  const fetchNextQuote = async () => {
    setIsLoading(true);
    await fetchQuote();
    setIsLoading(false);
  };

  const saveQuote = async () => {
    try {
      setIsSaving(true);
      const { data }: AxiosResponse<IQuote[]> = await axios.post(
        '/quote',
        currentQuote
      );
      setSavedQuotes(data);
      toast.success('Quote saved');
    } catch (error) {
      const errorData = (error as AxiosError).response?.data as {
        message?: string;
      };
      toast.error(errorData?.message || 'Error saving quote');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Fragment>
      <Toaster />
      <main className='min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4'>
        <div className='w-full max-w-2xl'>
          <div className='bg-white shadow-lg rounded-2xl p-8 mb-6 relative'>
            <div className='absolute top-4 right-4 flex space-x-2'>
              <button
                disabled={isLoading || isSaving}
                onClick={fetchNextQuote}
                className='text-neutral-500 hover:text-neutral-700'>
                {isLoading ? <TailwindSpinner /> : <Repeat size={20} />}
              </button>
              {!!currentQuote && (
                <button
                  disabled={isSaving || isLoading}
                  onClick={saveQuote}
                  className='text-neutral-500 hover:text-neutral-700'>
                  {isSaving ? <TailwindSpinner /> : <BookmarkPlus size={20} />}
                </button>
              )}
            </div>

            {error ? (
              <p className='text-center text-red-600'>
                We are having a problem with the server, please try again later
              </p>
            ) : currentQuote ? (
              <>
                <blockquote className='text-2xl font-light text-neutral-800 italic text-center mb-4'>
                  "{currentQuote.quote}"
                </blockquote>
                <p className='text-center text-neutral-600 font-medium'>
                  - {currentQuote.author}
                </p>
              </>
            ) : (
              <div className='flex items-center justify-center'>
                <TailwindSpinner className='h-8 w-8' />
              </div>
            )}
          </div>

          <div className='bg-white shadow-lg rounded-2xl p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-neutral-800'>
                Saved Quotes
              </h2>
              <span className='text-neutral-500 text-sm'>
                {savedQuotes.length} Saved
              </span>
            </div>

            <div className='space-y-4'>
              {savedQuotes.length > 0 ? (
                savedQuotes.map(quote => <Quote key={quote.id} item={quote} />)
              ) : (
                <p className='text-neutral-500 text-center'>
                  You have not saved any quotes yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default App;

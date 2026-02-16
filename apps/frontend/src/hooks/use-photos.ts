import useSWR from 'swr';
import { photosApi } from '../lib/api';
import type { Photo } from '../types';

const fetcher = () => photosApi.getAll().then(res => res.data);

export const usePhotos = (pollingInterval: 'slow' | 'fast' | false = 'slow') => {
  const { data, error, mutate } = useSWR<Photo[]>(
    '/photos',
    fetcher,
    pollingInterval === 'fast' ? { 
      refreshInterval: 5000,
      revalidateOnFocus: false,
    } : pollingInterval === 'slow' ? {
      refreshInterval: 20000,
      revalidateOnFocus: false,
    } : {}
  );

  return {
    photos: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  };
};

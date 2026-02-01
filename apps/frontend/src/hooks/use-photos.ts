import useSWR from 'swr';
import { photosApi } from '../lib/api';
import type { Photo } from '../types';

const fetcher = (url: string) => photosApi.getAll().then(res => res.data);

export const usePhotos = (polling = true) => {
  const { data, error, mutate } = useSWR<Photo[]>(
    '/photos',
    fetcher,
    polling ? { 
      refreshInterval: 10000,
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

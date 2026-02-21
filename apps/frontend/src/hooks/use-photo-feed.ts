import { useCallback, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { photosApi } from '@/lib/api';
import type { Photo, PhotoFeedResponse } from '@/types';

const PAGE_SIZE = 10;

type FeedKey = readonly ['photo-feed', number, string | null];

const fetchFeedPage = async ([, limit, cursor]: FeedKey): Promise<PhotoFeedResponse> => {
  const response = await photosApi.getFeed(limit, cursor ?? undefined);

  return response.data;
};

const getFeedKey = (pageIndex: number, previousPageData: PhotoFeedResponse | null): FeedKey | null => {
  if (previousPageData && !previousPageData.has_more) {
    return null;
  }

  if (pageIndex === 0) {
    return ['photo-feed', PAGE_SIZE, null] as const;
  }

  return ['photo-feed', PAGE_SIZE, previousPageData?.next_cursor ?? null] as const;
};

export const usePhotoFeed = () => {
  const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite<PhotoFeedResponse, Error>(
    getFeedKey,
    fetchFeedPage,
    {
      refreshInterval: 20000,
      revalidateOnFocus: false,
      persistSize: true,
    }
  );

  const photos = useMemo<Photo[]>(() => {
    if (!data) {
      return [];
    }

    const deduped = new Map<string, Photo>();

    data.forEach((page) => {
      page.data.forEach((photo) => {
        deduped.set(photo.id, photo);
      });
    });

    return Array.from(deduped.values());
  }, [data]);

  const hasMore = data ? data[data.length - 1]?.has_more ?? false : false;
  const isLoading = !data && !error;
  const isLoadingMore = (isLoading || isValidating) && Boolean(data);

  const loadMore = useCallback(async () => {
    if (!hasMore || isValidating) {
      return;
    }

    await setSize((currentSize) => currentSize + 1);
  }, [hasMore, isValidating, setSize]);

  const removePhoto = useCallback(
    (photoId: string) => {
      mutate(
        (pages) => {
          if (!pages) {
            return pages;
          }

          return pages.map((page) => ({
            ...page,
            data: page.data.filter((photo) => photo.id !== photoId),
          }));
        },
        { revalidate: false }
      );
    },
    [mutate]
  );

  return {
    photos,
    error,
    mutate,
    removePhoto,
    loadMore,
    hasMore,
    isLoading,
    isLoadingMore,
    pageSize: PAGE_SIZE,
    size,
  };
};

import { CacheKey } from '@/api';
import { SearchResultUnion } from '@isi-insight/client';
import { createQuery } from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor } from 'solid-js';

export const useSearchQuery = (phrase: Accessor<string>) => {
  return createQuery(() => ({
    queryKey: [CacheKey.SEARCH, phrase()] as const,
    staleTime: 60_000,
    queryFn: async ({ queryKey }) => {
      const [, phrase] = queryKey;

      if (phrase.length === 0) return [];

      const response = await axios.get<SearchResultUnion[]>(
        `/api/v1/search?phrase=${phrase}`
      );

      return response.data;
    },
  }));
};

import useSWR from 'swr';
import { settingsApi } from '../lib/api';
import type { PartySettings } from '../types';

export const useSettings = () => {
  const { data, error, mutate } = useSWR<PartySettings>(
    '/settings',
    () => settingsApi.get().then(res => res.data.data)
  );

  const updateSettings = async (newSettings: Partial<PartySettings>) => {
    const response = await settingsApi.update(newSettings);
    mutate(response.data.data);
    return response.data;
  };

  return {
    settings: data,
    isLoading: !error && !data,
    error,
    updateSettings,
    mutate,
  };
};

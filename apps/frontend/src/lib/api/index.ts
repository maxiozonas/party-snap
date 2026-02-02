import axios from 'axios';
import type { Photo, PartySettings } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const photosApi = {
  getAll: () => api.get<Photo[]>('/photos'),
  upload: (data: FormData) => api.post('/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id: string) => api.delete(`/admin/photo/${id}`),
};

export const settingsApi = {
  get: () => api.get<{ data: PartySettings }>('/settings'),
  update: (data: Partial<PartySettings>) => 
    api.put<{ success: boolean; data: PartySettings }>('/settings', data),
};

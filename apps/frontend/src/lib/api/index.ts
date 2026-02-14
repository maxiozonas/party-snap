import axios from 'axios';
import type { Photo, PartySettings, CreateGuestSessionResponse, ValidateGuestSessionResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const guestToken = localStorage.getItem('guest_token');
  const adminToken = localStorage.getItem('admin_token');
  
  if (guestToken) {
    config.headers['X-Guest-Token'] = guestToken;
  }
  
  if (adminToken) {
    config.headers['Authorization'] = `Bearer ${adminToken}`;
  }
  
  return config;
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

export const sessionsApi = {
  // Register new guest session from QR scan (creates individual session)
  create: (data: { master_token: string; guest_name: string }) => 
    api.post<CreateGuestSessionResponse>('/sessions/register', data),
  
  // Validate individual session token
  validate: (token: string) => 
    api.get<ValidateGuestSessionResponse>(`/sessions/validate/${token}`),
  
  // Update guest name
  update: (token: string, guestName: string) =>
    api.put(`/sessions/${token}`, { guest_name: guestName }),
};

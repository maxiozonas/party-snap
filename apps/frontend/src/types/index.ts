export interface Photo {
  id: string;
  url: string;
  guest_name: string;
  created_at: string;
}

export interface PartySettings {
  id?: number;
  title: string;
  subtitle: string;
  event_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GuestSession {
  id: string;
  token: string;
  guest_name: string;
  first_seen_at: string;
  last_seen_at: string;
  photos_count: number;
}

export interface CreateGuestSessionResponse {
  valid: boolean;
  exists: boolean;
  guest_name: string;
  session_id: string;
}

export interface ValidateGuestSessionResponse {
  valid: boolean;
  guest_name?: string;
  session_id?: string;
  message?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

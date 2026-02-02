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

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

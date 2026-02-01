export interface Photo {
  id: string;
  url: string;
  guest_name: string;
  created_at: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

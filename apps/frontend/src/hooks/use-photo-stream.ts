import { useEffect, useState } from 'react';

interface PhotoStreamOptions {
  enabled?: boolean;
  onNewPhotos?: () => void;
}

export const usePhotoStream = (options: PhotoStreamOptions = {}) => {
  const { enabled = true, onNewPhotos } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const eventSource = new EventSource('http://localhost:8000/api/v1/photos/stream');

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log('📡 SSE Conectado - Recibiendo actualizaciones en tiempo real');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.new_photos) {
          console.log('🎉 Nuevas fotos detectadas - Actualizando...');
          onNewPhotos?.();
        }

        if (data.photo_count !== undefined) {
          console.log(`📊 Total de fotos: ${data.photo_count}`);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('❌ SSE Error:', err);
      setIsConnected(false);
      setError('Conexión perdida. Reintentando...');

      setTimeout(() => {
        eventSource.close();
      }, 5000);
    };

    return () => {
      console.log('🔌 Cerrando conexión SSE');
      eventSource.close();
    };
  }, [enabled, onNewPhotos]);

  return { isConnected, error };
};

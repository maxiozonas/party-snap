import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotos } from '@/hooks/use-photos';

export function TVMode() {
  const { photos } = usePhotos('fast');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const lastPhotoCountRef = useRef(0);

  useEffect(() => {
    if (photos.length > 0 && !initialized) {
      lastPhotoCountRef.current = photos.length;
      requestAnimationFrame(() => setInitialized(true));
    }
  }, [photos.length, initialized]);

  useEffect(() => {
    if (photos.length === 0 || !initialized) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % photos.length;
        console.log(`🖼️ Mostrando foto ${nextIndex + 1}/${photos.length}`);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length, initialized]);

  useEffect(() => {
    if (photos.length > lastPhotoCountRef.current && initialized) {
      console.log(`✨ Nuevas fotos agregadas: ${lastPhotoCountRef.current} → ${photos.length}`);
      console.log('🔄 El slideshow continuará desde la posición actual sin reiniciar');
      lastPhotoCountRef.current = photos.length;
    }
  }, [photos.length, initialized]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f') {
        document.documentElement.requestFullscreen();
      }
      if (e.key === 'Escape') {
        document.exitFullscreen();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  if (photos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-display text-6xl font-bold text-aqua-400">
            PartySnap
          </h1>
          <p className="mt-4 text-2xl text-white/80">
            Esperando fotos...
          </p>
        </motion.div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={currentPhoto.url}
            alt={`Photo by ${currentPhoto.guest_name}`}
            className="max-h-screen max-w-screen object-contain"
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 pb-12"
      >
        <div className="container mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-aqua-400">
            {currentPhoto.guest_name}
          </h2>
          <p className="mt-2 text-lg text-white/80">
            {new Date(currentPhoto.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </motion.div>

      <div className="absolute top-8 right-8 text-white/50 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      <div className="absolute bottom-8 left-8 text-white/50 text-sm">
        Presiona <kbd className="px-2 py-1 bg-white/10 rounded">F</kbd> para pantalla completa
      </div>
    </div>
  );
}

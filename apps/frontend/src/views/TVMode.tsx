import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import { usePhotos } from '@/hooks/use-photos';
import { usePhotoStream } from '@/hooks/use-photo-stream';

export function TVMode() {
  const { photos, mutate } = usePhotos(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const lastPhotoCountRef = useRef(0);

  usePhotoStream({
    onNewPhotos: () => {
      mutate();
    },
  });

  useEffect(() => {
    if (photos.length > 0 && !initialized) {
      lastPhotoCountRef.current = photos.length;
      requestAnimationFrame(() => setInitialized(true));
    }
  }, [photos.length, initialized]);

  useEffect(() => {
    if (photos.length === 0 || !initialized) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length, initialized]);

  useEffect(() => {
    if (photos.length > lastPhotoCountRef.current && initialized) {
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
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-400">
            <Camera className="h-10 w-10 text-neutral-950" />
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground tracking-tight">
            PartySnap
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Esperando fotos...
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-16 animate-pulse-slow rounded-full bg-accent-400/40" />
          </div>
        </motion.div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 h-screen w-screen bg-neutral-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={currentPhoto.url}
            alt={`Photo by ${currentPhoto.guest_name}`}
            className="max-h-screen max-w-screen object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom info bar */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      >
        <div className="flex items-end justify-between px-10 pb-10 pt-20">
          <div>
            <p className="font-display text-3xl font-bold text-white tracking-tight">
              {currentPhoto.guest_name}
            </p>
            <p className="mt-1 text-base text-white/50">
              {new Date(currentPhoto.created_at).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2">
              <Camera className="h-4 w-4 text-accent-400" />
              <span className="text-sm font-medium text-white/80">
                {currentIndex + 1} / {photos.length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
        <motion.div
          key={currentIndex}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-accent-400"
        />
      </div>

      <div className="absolute bottom-4 left-10 text-white/30 text-xs">
        Presiona <kbd className="px-1.5 py-0.5 bg-white/10 rounded-md text-white/50 font-mono">F</kbd> para pantalla completa
      </div>
    </div>
  );
}

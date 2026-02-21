import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import type { Photo } from '@/types';

interface PhotoGalleryProps {
  readonly open: boolean;
  readonly photos: readonly Photo[];
  readonly initialIndex: number;
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly onLoadMore: () => Promise<void>;
  readonly onClose: () => void;
}

export function PhotoGallery({
  open,
  photos,
  initialIndex,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onClose,
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const lastIndex = photos.length - 1;
  const visibleIndex = useMemo(
    () => Math.max(0, Math.min(currentIndex, Math.max(lastIndex, 0))),
    [currentIndex, lastIndex]
  );
  const currentPhoto = photos[visibleIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }, []);

  const goToNext = useCallback(async () => {
    const isLastVisiblePhoto = currentIndex >= lastIndex;

    if (!isLastVisiblePhoto) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    if (!hasMore || isLoadingMore) {
      return;
    }

    setCurrentIndex((index) => index + 1);
    await onLoadMore();
  }, [currentIndex, hasMore, isLoadingMore, lastIndex, onLoadMore]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        void goToPrevious();
      }

      if (event.key === 'ArrowRight') {
        void goToNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [goToNext, goToPrevious, onClose, open]);

  if (!open || !currentPhoto) {
    return null;
  }

  const canGoPrevious = visibleIndex > 0;
  const canGoNext = visibleIndex < lastIndex || hasMore;

  return (
    <div className="fixed inset-0 z-[70] bg-black/95">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
        aria-label="Cerrar galeria"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => void goToPrevious()}
        disabled={!canGoPrevious}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={() => void goToNext()}
        disabled={!canGoNext}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Foto siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="flex h-full w-full items-center justify-center p-4 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={`Photo by ${currentPhoto.guest_name}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-semibold">{currentPhoto.guest_name}</p>
            <p className="text-sm text-white/75">
              {new Date(currentPhoto.created_at).toLocaleString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-white/80">
            {isLoadingMore && (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando mas
              </span>
            )}
            <span>
              {visibleIndex + 1} / {photos.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '@/types';

interface PhotoGridProps {
  readonly photos: readonly Photo[];
  onImageError?: (id: string) => void;
}

export const PhotoGrid = memo(function PhotoGrid({ photos, onImageError }: PhotoGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-display text-lg font-semibold text-foreground">
            No hay fotos todavia
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Se el primero en subir una foto
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="columns-2 gap-3 sm:columns-3 md:columns-4 lg:columns-5"
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onImageError={onImageError}
        />
      ))}
    </motion.div>
  );
});

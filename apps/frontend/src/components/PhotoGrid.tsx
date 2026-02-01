import { memo } from 'react';
import { motion } from 'framer-motion';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '@/types';

interface PhotoGridProps {
  readonly photos: readonly Photo[];
  onDelete?: (id: string) => void;
}

export const PhotoGrid = memo(function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-gold-500">
            No hay fotos todavía
          </p>
          <p className="mt-2 text-sm text-gray-600">
            ¡Sé el primero en subir una foto!
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
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onDelete={onDelete}
        />
      ))}
    </motion.div>
  );
});

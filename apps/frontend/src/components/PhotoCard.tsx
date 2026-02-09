import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Photo } from '@/types';

interface PhotoCardProps {
  photo: Photo;
  onImageError?: (id: string) => void;
  className?: string;
}

export function PhotoCard({ photo, onImageError, className }: PhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn('group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-card', className)}
    >
      <img
        src={photo.url}
        alt={`Photo by ${photo.guest_name}`}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={() => onImageError?.(photo.id)}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-sm font-medium text-white">
            {photo.guest_name}
          </p>
          <p className="text-xs text-white/60">
            {new Date(photo.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

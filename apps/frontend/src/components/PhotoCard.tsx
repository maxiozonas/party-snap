import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn('relative group aspect-square overflow-hidden rounded-lg bg-sky-50 shadow-md', className)}
    >
      <img
        src={photo.url}
        alt={`Photo by ${photo.guest_name}`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        onError={() => onImageError?.(photo.id)}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="font-display text-sm font-medium">
            {photo.guest_name}
          </p>
          <p className="text-xs text-white/80">
            {new Date(photo.created_at).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-red-50 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-0" style={{ opacity: 0 }}>
        <ImageOff className="h-12 w-12 text-red-400" />
      </div>
    </motion.div>
  );
}

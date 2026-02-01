import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Photo } from '@/types';

interface PhotoCardProps {
  photo: Photo;
  onDelete?: (id: string) => void;
  className?: string;
}

export function PhotoCard({ photo, onDelete, className }: PhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={cn('relative group aspect-square overflow-hidden rounded-lg bg-cream shadow-md', className)}
    >
      <img
        src={photo.url}
        alt={`Photo by ${photo.guest_name}`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
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
        
        {onDelete && (
          <button
            onClick={() => onDelete(photo.id)}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity duration-200 hover:bg-red-600 group-hover:opacity-100"
            aria-label="Delete photo"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

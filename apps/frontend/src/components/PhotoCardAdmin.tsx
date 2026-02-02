import { motion } from 'framer-motion';
import { Check, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Photo } from '@/types';

interface PhotoCardAdminProps {
  readonly photo: Photo;
  readonly isSelected: boolean;
  readonly onSelect: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly isDeleting: boolean;
}

export function PhotoCardAdmin({
  photo,
  isSelected,
  onSelect,
  onDelete,
  isDeleting
}: PhotoCardAdminProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-200',
        isSelected ? 'ring-4 ring-aqua-500 ring-offset-2' : 'hover:shadow-lg'
      )}
      onClick={() => onSelect(photo.id)}
    >
      <img
        src={photo.url}
        alt={`Photo by ${photo.guest_name}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-200',
          isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-60'
        )}
      />

      <div className="absolute top-2 right-2">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
            isSelected
              ? 'bg-aqua-500 text-white'
              : 'bg-white/80 text-gray-600'
          )}
        >
          <Check size={16} className={cn(isSelected ? 'opacity-100' : 'opacity-0')} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
        <p className="text-xs font-medium truncate">{photo.guest_name}</p>
        <div className="flex items-center gap-1 text-[10px] text-white/80">
          <Clock size={10} />
          {new Date(photo.created_at).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(photo.id);
        }}
        disabled={isDeleting}
        className={cn(
          'absolute bottom-2 right-2 rounded-full bg-red-500 p-2 text-white transition-all duration-200 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed',
          'opacity-0 group-hover:opacity-100'
        )}
        style={{ opacity: isSelected || isDeleting ? 1 : 0 }}
      >
        <Trash2 size={14} />
      </button>

      <div
        className={cn(
          'absolute inset-0 border-4 border-aqua-500 rounded-lg transition-opacity duration-200',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </motion.div>
  );
}

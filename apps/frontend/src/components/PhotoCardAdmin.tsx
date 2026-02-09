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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative aspect-square overflow-hidden rounded-2xl bg-card cursor-pointer transition-all duration-200',
        isSelected ? 'ring-2 ring-accent-400 ring-offset-2 ring-offset-background' : 'hover:ring-1 hover:ring-border'
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
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
        )}
      />

      <div className="absolute top-2 right-2">
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200',
            isSelected
              ? 'bg-accent-400 text-neutral-950'
              : 'bg-black/40 text-white/60 backdrop-blur-sm'
          )}
        >
          <Check size={14} className={cn(isSelected ? 'opacity-100' : 'opacity-0')} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-xs font-medium text-white truncate">{photo.guest_name}</p>
        <div className="flex items-center gap-1 text-[10px] text-white/60">
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
          'absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/90 text-white transition-all duration-200 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
          isSelected || isDeleting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <Trash2 size={12} />
      </button>

      <div
        className={cn(
          'absolute inset-0 border-2 border-accent-400 rounded-2xl transition-opacity duration-200 pointer-events-none',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </motion.div>
  );
}

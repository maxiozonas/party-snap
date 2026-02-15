import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';

interface UploadButtonProps {
  onClick: () => void;
}

export function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center py-3"
    >
      <Button
        onClick={onClick}
        size="lg"
        className="relative overflow-hidden rounded-full px-12 py-8 text-xl font-semibold shadow-xl"
      >
        <div className="shimmer-effect absolute inset-0 animate-shimmer" />
        <span className="relative flex items-center gap-3">
          <Camera size={28} />
          Subir Foto
        </span>
      </Button>
    </motion.div>
  );
}

import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface UploadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function UploadButton({ onClick, disabled }: UploadButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="default"
      className="rounded-xl px-4 py-2 text-sm font-semibold"
    >
      <Plus size={18} />
      <span className="hidden sm:inline">Subir Foto</span>
      <span className="sm:hidden">Subir</span>
    </Button>
  );
}

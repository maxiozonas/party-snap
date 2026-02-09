import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

interface SettingsPreviewProps {
  title: string;
  subtitle: string;
}

export function SettingsPreview({ title, subtitle }: SettingsPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mb-5 overflow-hidden rounded-xl bg-muted/50 border border-border p-4"
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Vista previa</p>
      <div className="rounded-xl bg-background border border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400">
            <Camera className="h-4 w-4 text-neutral-950" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold text-foreground">
              {title || 'PartySnap'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {subtitle || 'Comparte tus mejores momentos'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { Images, CheckSquare } from 'lucide-react';

interface AdminStatsProps {
  readonly totalPhotos: number;
  readonly selectedCount: number;
}

export function AdminStats({ totalPhotos, selectedCount }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400/10">
            <Images className="h-4 w-4 text-accent-400" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold text-foreground">{totalPhotos}</p>
        <p className="text-xs text-muted-foreground">fotos subidas</p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400/10">
            <CheckSquare className="h-4 w-4 text-accent-400" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-bold text-foreground">{selectedCount}</p>
        <p className="text-xs text-muted-foreground">seleccionadas</p>
      </div>
    </div>
  );
}

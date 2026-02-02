import { Images, Clock } from 'lucide-react';

interface AdminStatsProps {
  readonly totalPhotos: number;
  readonly selectedCount: number;
}

export function AdminStats({ totalPhotos, selectedCount }: AdminStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-white p-4 shadow-md border-2 border-aqua-200">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-aqua-600" />
          <p className="text-xs font-semibold text-gray-600 uppercase">Total</p>
        </div>
        <p className="mt-2 text-3xl font-bold text-aqua-600">{totalPhotos}</p>
        <p className="text-xs text-gray-500">fotos subidas</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-md border-2 border-sky-200">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-sky-600" />
          <p className="text-xs font-semibold text-gray-600 uppercase">Seleccionadas</p>
        </div>
        <p className="mt-2 text-3xl font-bold text-sky-600">{selectedCount}</p>
        <p className="text-xs text-gray-500">para eliminar</p>
      </div>
    </div>
  );
}

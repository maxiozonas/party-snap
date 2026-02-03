import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trash2, AlertTriangle } from 'lucide-react';
import { PhotoCardAdmin } from '@/components/PhotoCardAdmin';
import { AdminStats } from '@/components/AdminStats';
import { SettingsEditor } from '@/components/SettingsEditor';
import { usePhotos } from '@/hooks/use-photos';
import { photosApi } from '@/lib/api';
import { toastSuccess, toastError } from '@/lib/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Admin() {
  const { photos, isLoading, mutate } = usePhotos(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<'single' | 'multiple'>('single');

  const handleSelectPhoto = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map((p) => p.id)));
    }
  };

  const openDeleteDialog = (mode: 'single' | 'multiple', photoId?: string) => {
    setDeleteMode(mode);
    if (mode === 'single' && photoId) {
      setPhotoToDelete(photoId);
    }
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteMode === 'multiple') {
      if (selectedPhotos.size === 0) return;

      setIsDeleting(true);
      setDeleteDialogOpen(false);

      try {
        await Promise.all(
          Array.from(selectedPhotos).map((id) => photosApi.delete(id))
        );
        setSelectedPhotos(new Set());
        mutate();
        toastSuccess(`${selectedPhotos.size} foto(s) eliminada(s) exitosamente`);
      } catch {
        toastError('Error al eliminar fotos. Por favor, intenta de nuevo.');
      } finally {
        setIsDeleting(false);
      }
    } else {
      if (!photoToDelete) return;

      setIsDeleting(true);
      setDeleteDialogOpen(false);

      try {
        await photosApi.delete(photoToDelete);
        mutate();
        toastSuccess('Foto eliminada exitosamente');
      } catch {
        toastError('Error al eliminar foto. Por favor, intenta de nuevo.');
      } finally {
        setIsDeleting(false);
        setPhotoToDelete(null);
      }
    }
  };

  const handleDeleteSelected = () => {
    openDeleteDialog('multiple');
  };

  const handleDeleteSingle = (photoId: string) => {
    openDeleteDialog('single', photoId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-aqua-50">
      <header className="border-b-4 border-aqua-600 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-aqua-600" />
              <div>
                <h1 className="font-display text-2xl font-bold text-aqua-600">
                  Panel de Admin
                </h1>
                <p className="text-xs text-sky-700">Gestiona las fotos de la fiesta</p>
              </div>
            </div>

            <a
              href={window.location.pathname.startsWith('/party-snap') ? '/party-snap/' : '/'}
              className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-200 transition-colors"
            >
              ← Volver
            </a>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <SettingsEditor />
        
        <AdminStats totalPhotos={photos.length} selectedCount={selectedPhotos.size} />

        {selectedPhotos.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-aqua-50 border-2 border-aqua-500 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-aqua-700">
                {selectedPhotos.size} foto(s) seleccionada(s)
              </p>
              <Button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Eliminando...' : 'Eliminar seleccionadas'}
              </Button>
            </div>
          </motion.div>
        )}

        {photos.length === 0 && !isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-aqua-400" />
              <p className="font-display text-xl text-aqua-600">
                No hay fotos para gestionar
              </p>
              <p className="mt-2 text-sm text-sky-700">
                Las fotos aparecerán aquí cuando los invitados las suban.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <button
                onClick={handleSelectAll}
                className="text-sm font-semibold text-sky-700 hover:text-aqua-600 transition-colors"
              >
                {selectedPhotos.size === photos.length
                  ? 'Deseleccionar todas'
                  : 'Seleccionar todas'}
              </button>
              <p className="text-sm text-gray-600">
                {photos.length} foto(s) total
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {photos.map((photo) => (
                <PhotoCardAdmin
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.has(photo.id)}
                  onSelect={handleSelectPhoto}
                  onDelete={handleDeleteSingle}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteMode === 'multiple'
                ? `¿Eliminar ${selectedPhotos.size} foto(s)?`
                : '¿Eliminar esta foto?'}
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Las fotos serán eliminadas permanentemente de la base de datos y de Cloudinary.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

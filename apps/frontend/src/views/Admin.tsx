import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trash2, Camera, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                <Shield className="h-5 w-5 text-accent-400" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Panel de Admin
                </h1>
                <p className="text-xs text-muted-foreground">Gestiona las fotos de la fiesta</p>
              </div>
            </div>

            <a
              href={window.location.pathname.startsWith('/party-snap') ? '/party-snap/' : '/'}
              className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-neutral-700"
            >
              <ArrowLeft size={16} />
              Volver
            </a>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <SettingsEditor />
        
        <AdminStats totalPhotos={photos.length} selectedCount={selectedPhotos.size} />

        {selectedPhotos.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-accent-400/10 border border-accent-400/20 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-accent-400">
                {selectedPhotos.size} foto(s) seleccionada(s)
              </p>
              <Button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                variant="destructive"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Eliminando...' : 'Eliminar seleccionadas'}
              </Button>
            </div>
          </motion.div>
        )}

        {photos.length === 0 && !isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-display text-lg font-semibold text-foreground">
                No hay fotos para gestionar
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Las fotos apareceran aqui cuando los invitados las suban.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleSelectAll}
                className="text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors"
              >
                {selectedPhotos.size === photos.length
                  ? 'Deseleccionar todas'
                  : 'Seleccionar todas'}
              </button>
              <p className="text-sm text-muted-foreground">
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
                ? `Eliminar ${selectedPhotos.size} foto(s)?`
                : 'Eliminar esta foto?'}
            </DialogTitle>
            <DialogDescription>
              Esta accion no se puede deshacer. Las fotos seran eliminadas permanentemente de la base de datos y de Cloudinary.
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
              variant="destructive"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

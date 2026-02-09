import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import { PhotoGrid } from '@/components/PhotoGrid';
import { UploadButton } from '@/components/UploadButton';
import { UploadModal } from '@/components/UploadModal';
import { usePhotos } from '@/hooks/use-photos';
import { useSettings } from '@/hooks/use-settings';

export function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { photos, isLoading, error, mutate } = usePhotos();
  const { settings } = useSettings();

  const handleImageError = (photoId: string) => {
    mutate(
      photos.filter((photo) => photo.id !== photoId),
      false
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-400">
                <Camera className="h-5 w-5 text-neutral-950" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {settings?.title || 'PartySnap'}
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {settings?.subtitle || 'Comparte tus mejores momentos'}
                </p>
              </div>
            </div>
            <UploadButton onClick={() => setIsUploadModalOpen(true)} />
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Hero subtitle on mobile */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center text-sm text-muted-foreground sm:hidden"
        >
          {settings?.subtitle || 'Comparte tus mejores momentos'}
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center"
          >
            <p className="text-sm text-red-400">
              Error al cargar las fotos. Por favor, recarga la pagina.
            </p>
          </motion.div>
        )}

        {isLoading && photos.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="mx-auto mb-4"
              >
                <Loader2 className="h-8 w-8 text-accent-400" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Cargando fotos...</p>
            </div>
          </div>
        ) : (
          <PhotoGrid photos={photos} onImageError={handleImageError} />
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}

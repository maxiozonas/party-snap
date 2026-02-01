import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PhotoGrid } from '@/components/PhotoGrid';
import { UploadButton } from '@/components/UploadButton';
import { UploadModal } from '@/components/UploadModal';
import { usePhotos } from '@/hooks/use-photos';

export function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { photos, isLoading, error } = usePhotos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-champagne to-cream">
      <header className="border-b-4 border-gold-500 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl font-bold text-gold-500 sm:text-5xl md:text-6xl">
              🎉 PartySnap
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Comparte tus mejores momentos
            </p>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <UploadButton onClick={() => setIsUploadModalOpen(true)} />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 rounded-lg bg-red-50 border border-red-200 p-4 text-center"
          >
            <p className="text-red-600">
              Error al cargar las fotos. Por favor, recarga la página.
            </p>
          </motion.div>
        )}

        {isLoading && photos.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100"
              >
                <Sparkles className="h-8 w-8 text-gold-500" />
              </motion.div>
              <p className="text-lg text-gray-600">Cargando fotos...</p>
            </div>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/image-compression';
import { photosApi } from '@/lib/api';
import { usePhotos } from '@/hooks/use-photos';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate } = usePhotos();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen. Intenta con otra.');
    }
  }, []);

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('photo', dataURLtoFile(preview, 'photo.jpg'));
      if (guestName.trim()) {
        formData.append('guest_name', guestName.trim());
      }

      await photosApi.upload(formData);
      
      setUploadProgress(100);
      mutate();
      
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error al subir la foto. Intenta de nuevo.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setGuestName('');
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const dataURLtoFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full bg-black/10 p-2 transition-colors hover:bg-black/20"
                disabled={isUploading}
              >
                <X size={20} />
              </button>

              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-aqua-600">
                  Subir Foto
                </h2>

                {!preview ? (
                  <div className="mt-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="photo-input"
                    />
                    <label
                      htmlFor="photo-input"
                      className={cn(
                        "flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-aqua-300 bg-sky-50 transition-colors hover:border-aqua-500 hover:bg-aqua-50",
                        isUploading && "pointer-events-none opacity-50"
                      )}
                    >
                      <div className="text-center">
                        <p className="font-display text-lg text-aqua-600">
                          Toca para seleccionar una foto
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          Máximo 8MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-sky-50">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Loader2 className="h-12 w-12 animate-spin text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Tu nombre (opcional)
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Ej: María González"
                        maxLength={20}
                        disabled={isUploading}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-500 disabled:opacity-50"
                      />
                    </div>

                    {isUploading && (
                      <div className="mt-4">
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="h-full bg-aqua-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          Subiendo... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="flex-1 rounded-lg bg-aqua-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-aqua-600 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {isUploading ? 'Subiendo...' : 'Subir Foto'}
                      </button>
                      <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

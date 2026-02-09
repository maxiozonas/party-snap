import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ImagePlus, Upload } from 'lucide-react';
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />
          
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-card border border-border sm:rounded-2xl"
            >
              {/* Drag handle for mobile */}
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="h-1 w-10 rounded-full bg-neutral-600" />
              </div>

              <button
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-neutral-700 hover:text-foreground"
                disabled={isUploading}
              >
                <X size={16} />
              </button>

              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Subir Foto
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Comparte tu mejor momento
                </p>

                {!preview ? (
                  <div className="mt-5">
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
                        "flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-600 bg-muted/50 transition-all hover:border-accent-400 hover:bg-muted",
                        isUploading && "pointer-events-none opacity-50"
                      )}
                    >
                      <div className="text-center">
                        <ImagePlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Toca para seleccionar
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          JPG, PNG - Max 8MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <Loader2 className="h-10 w-10 animate-spin text-accent-400" />
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Tu nombre (opcional)
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Ej: Maria Gonzalez"
                        maxLength={20}
                        disabled={isUploading}
                        className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-50"
                      />
                    </div>

                    {isUploading && (
                      <div className="mt-4">
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full bg-accent-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="mt-2 text-center text-xs text-muted-foreground">
                          Subiendo... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-accent-300 active:bg-accent-500 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Upload size={16} />
                        {isUploading ? 'Subiendo...' : 'Subir Foto'}
                      </button>
                      <button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
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

import { motion } from 'framer-motion';
import { QrCode, Camera } from 'lucide-react';

export function ScanQRModal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md mx-4"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-aqua-400 via-sky-400 to-aqua-400" />
        
        {/* Contenido del modal */}
        <div className="p-8 text-center">
          {/* Icono QR animado */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-100 to-sky-100"
          >
            <QrCode className="h-12 w-12 text-aqua-600" />
          </motion.div>

          {/* Título */}
          <h2 
            className="text-2xl sm:text-3xl font-normal text-aqua-700 mb-3"
            style={{ fontFamily: 'Strongmark, serif' }}
          >
            ¡Escanea el QR!
          </h2>

          {/* Descripción */}
          <p className="text-sky-600 text-base sm:text-lg mb-6 leading-relaxed">
            Busca los carteles de <strong>PartySnap</strong> en la fiesta y escanea el código QR para acceder a todas las fotos y subir las tuyas.
          </p>

          {/* Instrucciones visuales */}
          <div className="flex items-center justify-center gap-2 text-sky-500 text-sm">
            <Camera className="h-5 w-5" />
            <span>Abre la cámara de tu celular</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sky-500 text-sm mt-1">
            <QrCode className="h-5 w-5" />
            <span>Apunta al código QR</span>
          </div>

          {/* Decoración inferior */}
          <div className="mt-6 pt-6 border-t border-aqua-100">
            <p className="text-aqua-500 text-sm">
              ¡Es rápido y fácil! 📸✨
            </p>
          </div>
        </div>

        {/* Confeti decorativo sutil */}
        <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-aqua-300 opacity-50" />
        <div className="absolute -bottom-2 -left-2 h-3 w-3 rounded-full bg-sky-300 opacity-50" />
        <div className="absolute top-1/2 -right-3 h-2 w-2 rounded-full bg-aqua-400 opacity-40" />
      </div>
    </motion.div>
  );
}

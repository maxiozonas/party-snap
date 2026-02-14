import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';

export function ScanQRNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl border-2 border-aqua-300 bg-gradient-to-r from-aqua-50 to-sky-50 p-6 shadow-lg"
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex-shrink-0 rounded-xl bg-gradient-to-br from-aqua-500 to-sky-500 p-3"
        >
          <QrCode className="h-8 w-8 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-aqua-700">
            Escanea el QR en los carteles
          </h3>
          <p className="mt-1 text-sky-600">
            Busca los carteles de PartySnap en la fiesta y escanea el código QR para poder subir tus fotos. ¡Es rápido y fácil!
          </p>
        </div>
      </div>
    </motion.div>
  );
}

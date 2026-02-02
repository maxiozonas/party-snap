import { motion } from 'framer-motion';

interface SettingsPreviewProps {
  title: string;
  subtitle: string;
}

export function SettingsPreview({ title, subtitle }: SettingsPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 rounded-lg bg-gradient-to-br from-sky-50 via-white to-aqua-50 border-2 border-aqua-300 p-4"
    >
      <p className="text-xs font-semibold text-gray-500 mb-2">VISTA PREVIA</p>
      <div className="border-b-4 border-aqua-500 bg-white/80 backdrop-blur-sm">
        <div className="px-4 py-6 text-center">
          <h1 className="font-display text-2xl font-bold text-aqua-600 sm:text-3xl md:text-4xl">
            {title || '🎉 PartySnap'}
          </h1>
          <p className="mt-2 text-sm text-sky-700">
            {subtitle || 'Comparte tus mejores momentos'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

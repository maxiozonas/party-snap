import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';

interface GuestNameModalProps {
  token: string;
  onSuccess: () => void;
}

export function GuestNameModal({ token, onSuccess }: GuestNameModalProps) {
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (guestName.trim().length < 2) {
      setError('Por favor, ingresa tu nombre (mínimo 2 caracteres)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Use the new registration endpoint to create individual session
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          master_token: token,        // Token from QR (master token)
          guest_name: guestName.trim(), // User's individual name
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid && data.session_token) {
        // Save the INDIVIDUAL session token (not the master QR token)
        localStorage.setItem('guest_token', data.session_token);
        localStorage.setItem('guest_name', data.guest_name);
        onSuccess();
      } else {
        setError(data.message || 'Error al registrar. Intenta de nuevo.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-aqua-500 to-sky-500 px-8 py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              >
                <Camera className="h-10 w-10 text-white" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-white">
                ¡Bienvenido a PartySnap! 🎉
              </h1>
              <p className="mt-2 text-white/90">
                Comparte tus mejores momentos
              </p>
            </div>

            <div className="px-8 py-8">
              <form onSubmit={handleSubmit}>
                <label className="block text-lg font-semibold text-gray-700">
                  ¿Cómo te llamas?
                </label>
                <p className="mt-1 mb-4 text-sm text-gray-500">
                  Tu nombre ayudará a identificar tus fotos
                </p>

                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ej: María García"
                  maxLength={100}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-lg focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-500 disabled:opacity-50"
                  autoFocus
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || guestName.trim().length < 2}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-aqua-500 to-sky-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-aqua-600 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Registrando...' : 'Continuar'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

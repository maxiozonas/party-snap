import { useState, useEffect } from 'react';
import { Calendar, Save, Eye } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { SettingsPreview } from './SettingsPreview';
import { toastSuccess, toastError } from '@/lib/toast';

export function SettingsEditor() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [title, setTitle] = useState(settings?.title || '');
  const [subtitle, setSubtitle] = useState(settings?.subtitle || '');
  const [eventDate, setEventDate] = useState(settings?.event_date || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (settings && !isSaving) {
      setTitle(settings.title);
      setSubtitle(settings.subtitle);
      setEventDate(settings.event_date || '');
    }
  }, [settings, isSaving]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        title,
        subtitle,
        event_date: eventDate || null,
      });
      toastSuccess('Configuración guardada exitosamente');
    } catch {
      toastError('Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="rounded-lg bg-sky-50 border-2 border-sky-200 p-6 text-center">
        <p className="text-sky-700">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white border-2 border-aqua-200 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-aqua-600">
          ⚙️ Configuración de la Fiesta
        </h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 rounded-lg bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-200 transition-colors"
        >
          <Eye size={16} />
          {showPreview ? 'Ocultar' : 'Vista Previa'}
        </button>
      </div>

      {showPreview && (
        <SettingsPreview
          title={title}
          subtitle={subtitle}
        />
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título de la Fiesta
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="🎉 Mi Cumpleaños"
            maxLength={100}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-colors text-base"
          />
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/100 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subtítulo
          </label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Comparte tus mejores momentos con nosotros"
            maxLength={500}
            rows={3}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-colors text-base resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            {subtitle.length}/500 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha del Evento (opcional)
          </label>
          <div className="relative">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 focus:border-aqua-500 focus:outline-none focus:ring-2 focus:ring-aqua-200 transition-colors text-base"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-aqua-500 px-6 py-4 text-base font-semibold text-white hover:bg-aqua-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={20} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Calendar, Save, Eye, Settings } from 'lucide-react';
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
      toastSuccess('Configuracion guardada exitosamente');
    } catch {
      toastError('Error al guardar configuracion');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">Cargando configuracion...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400/10">
            <Settings className="h-4 w-4 text-accent-400" />
          </div>
          <h2 className="font-display text-base font-bold text-foreground">
            Configuracion del Evento
          </h2>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-neutral-700 transition-colors"
        >
          <Eye size={14} />
          {showPreview ? 'Ocultar' : 'Vista Previa'}
        </button>
      </div>

      {showPreview && (
        <SettingsPreview
          title={title}
          subtitle={subtitle}
        />
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">
            Titulo del Evento
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mi Cumple"
            maxLength={100}
            className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {title.length}/100
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">
            Subtitulo
          </label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Comparte tus mejores momentos con nosotros"
            maxLength={500}
            rows={3}
            className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors resize-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {subtitle.length}/500
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">
            Fecha del Evento (opcional)
          </label>
          <div className="relative">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-foreground focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400 transition-colors"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-accent-300 active:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save size={16} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

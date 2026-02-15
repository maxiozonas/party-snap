import { cn } from '@/lib/utils';

interface HeroPhotoRollProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function HeroPhotoRoll({ title, subtitle, className }: HeroPhotoRollProps) {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <style>{`
        @font-face {
          font-family: 'Strongmark';
          src: url('fonts/Strongmark.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      {/* Imagen del rollo con fotos */}
      <div className="relative mx-auto w-full max-w-3xl px-2 pt-4 sm:px-4 sm:pt-6">
        <img
          src="mama.png"
          alt="Rollo fotográfico del evento"
          className="w-full h-auto"
        />
      </div>

      {/* Título, Snoopy y subtítulo */}
      <div className="container mx-auto px-4 pb-6 sm:pb-8 pt-6 sm:pt-8 md:pt-10">
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
          {/* Título y subtítulo */}
          <div className="text-center">
            <h1
              className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-aqua-700 leading-tight"
              style={{ fontFamily: 'Strongmark, serif' }}
            >
              {title || '🎉 PartySnap'}
            </h1>
            {subtitle && (
              <p
                className="mt-2 sm:mt-3 text-3xl sm:text-2xl md:text-3xl text-sky-700"
                style={{ fontFamily: 'Strongmark, serif' }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Snoopy */}
          <div className="flex-shrink-0">
            <img
              src="snoopy.jpeg"
              alt="Snoopy"
              className="h-32 w-auto sm:h-32 md:h-40 lg:h-48 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

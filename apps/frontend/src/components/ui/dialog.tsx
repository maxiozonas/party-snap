import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DialogProps {
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly children: React.ReactNode;
}

function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const handleContentClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <DialogOverlay onClose={() => onOpenChange?.(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => onOpenChange?.(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={handleContentClick}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <button
                onClick={() => onOpenChange?.(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </button>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

interface DialogOverlayProps {
  readonly onClose: () => void;
}

function DialogOverlay({ onClose }: DialogOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    />
  );
}

interface DialogContentProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

function DialogContent({ children, className }: DialogContentProps) {
  return <div className={className}>{children}</div>;
}

interface DialogHeaderProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>
      {children}
    </div>
  );
}

interface DialogTitleProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('font-display text-lg font-semibold leading-none tracking-tight text-gray-900', className)}>
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-600', className)}>
      {children}
    </p>
  );
}

interface DialogFooterProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6', className)}>
      {children}
    </div>
  );
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };

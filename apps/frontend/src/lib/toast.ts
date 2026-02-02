import { toast } from 'sonner';

export const toastSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    className: 'font-sans',
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    className: 'font-sans',
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    duration: 3000,
    className: 'font-sans',
  });
};

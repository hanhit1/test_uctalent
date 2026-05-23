import { toast } from 'sonner';

export const useToast = () => {
  const success = (message: string, description?: string) =>
    toast.success(message, {
      description,
      style: {
        background: 'var(--success)',
        color: 'white',
      },
    });

  const error = (message: string, description?: string) =>
    toast.error(message, {
      description,
      style: {
        background: 'var(--destructive)',
        color: 'white',
      },
    });

  const danger = (message: string, description?: string) =>
    toast(message, {
      description,
      style: {
        background: 'var(--destructive)',
        color: 'white',
      },
    });

  return { success, error, danger };
};

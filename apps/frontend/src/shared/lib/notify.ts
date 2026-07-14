import { toast } from "sonner";

const DURATION = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
} as const;

type NotifyOptions = {
  description?: string;
  duration?: number;
};

export const notify = {
  success(message: string, options?: NotifyOptions) {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration ?? DURATION.success,
    });
  },

  error(message: string, options?: NotifyOptions) {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration ?? DURATION.error,
    });
  },

  warning(message: string, options?: NotifyOptions) {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? DURATION.warning,
    });
  },

  info(message: string, options?: NotifyOptions) {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration ?? DURATION.info,
    });
  },
};

'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerProps {
  error: Error;
  onReset?: () => void;
}

export function ErrorHandler({ error, onReset }: ErrorHandlerProps) {
  useEffect(() => {
    // Log the error
    console.error(error);

    // Show error toast
    toast.error(error.message || 'An unexpected error occurred');

    // Optional: Send error to error tracking service
    // sendToErrorTracking(error);
  }, [error]);

  return null;
}

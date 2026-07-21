'use client';

import { useToast } from '@/components/ui/use-toast';
import { ToastViewport, ToastRoot, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastViewport>
      {toasts.map((t) => (
        <ToastRoot key={t.id} variant={t.variant}>
          <div className="grid gap-1">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose onClick={() => dismiss(t.id)} />
        </ToastRoot>
      ))}
    </ToastViewport>
  );
}

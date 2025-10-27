'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function RegisterSW() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Check for updates every 30 seconds
          setInterval(() => {
            registration.update();
          }, 30000);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('New service worker available. Refresh to update.');

                  // Show toast to user
                  toast.success('Nova versão disponível! Recarregando...', {
                    duration: 5000,
                    icon: '🔄',
                  });

                  // Activate new service worker
                  newWorker.postMessage({ type: 'SKIP_WAITING' });

                  // Reload page after a short delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed');
      });
    }
  }, []);

  return null;
}

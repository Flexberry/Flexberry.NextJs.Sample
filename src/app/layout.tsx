'use client';

import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(true);
  }, []);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  const handleHeaderNavigationOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleHeaderExit = () => {};

  return (
    <html lang="ru">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

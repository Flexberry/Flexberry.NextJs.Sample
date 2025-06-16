'use client';

import React from 'react';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';

import AppTheme from '@/theme/AppTheme';
import '@/assets/icons.css';
import '@/assets/fonts.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import { MainContent } from './styles';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <html lang="ru">
      <body>
        <QueryClientProvider client={queryClient}>
          <AppTheme>
            <CssBaseline />
            <Header />
            <MainContent>
              <Sidebar />
              {children}
            </MainContent>
          </AppTheme>
        </QueryClientProvider>
      </body>
    </html>
  );
}

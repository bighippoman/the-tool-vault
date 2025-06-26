"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  // useState ensures QueryClient is only created once per component lifecycle,
  // preventing re-creation on re-renders, which is important for QueryClient.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="flex flex-col flex-1">
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange // Recommended to prevent theme flicker on initial load
    >
      {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </div>
  );
}

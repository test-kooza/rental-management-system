'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [queryClient] = useState(() => new QueryClient());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 7 * 60 * 60 * 1000,
            gcTime: 13 * 60 * 60 * 1000, 
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      }),
  );

  // Note, typically gcTime should be longer than staleTime. Here's why:
  // staleTime determines how long data is considered "fresh" before React Query will trigger a background refetch
  // gcTime determines how long inactive data is kept in the cache before being removed entirely

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

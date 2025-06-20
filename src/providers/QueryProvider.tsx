import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduced retries for faster failure
      retryDelay: 2000, // Fixed 2 second delay instead of exponential backoff
      staleTime: 15 * 60 * 1000, // 15 minutes - data considered fresh for longer
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
      refetchOnWindowFocus: false, // Never refetch on window focus to reduce API calls
      refetchOnMount: false, // Don't refetch if data exists to reduce API calls
      refetchOnReconnect: false, // Don't refetch when network reconnects (except health checks)
      refetchInterval: false, // Disable all automatic intervals
      networkMode: 'online', // Only run queries when online
      // Disable background refetching for better performance
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 2000,
      networkMode: 'online',
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider; 
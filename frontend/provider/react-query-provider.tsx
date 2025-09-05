import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";

// ✅ Global defaults set here
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,   // 👈 stop refetch when switching tabs
      refetchOnReconnect: false,     // 👈 optional: stop refetch on network reconnect
      retry: 1,                      // 👈 how many times to retry failed queries
      staleTime: 1000 * 60,          // 👈 data is "fresh" for 1 minute
    },
  },
});

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;

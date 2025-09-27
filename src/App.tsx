import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import React, { lazy, Suspense, StrictMode } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import ErrorBoundary from "@/components/ErrorBoundary";
import { safeCleanupByClass } from "@/lib/domUtils";

// Lazy load page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExcelPage = lazy(() => import("./pages/ExcelPage"));
const Auth = lazy(() => import("./pages/Auth"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter(
  [
    {
      path: "/auth",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Auth />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "excel",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ExcelPage />
            </Suspense>
          ),
        },
        {
          path: "settings",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);

const App = () => {
  // Cleanup any orphaned DOM elements on app start
  React.useEffect(() => {
    // Cleanup common problematic elements
    safeCleanupByClass('swal2-container');
    safeCleanupByClass('swal2-backdrop');
    safeCleanupByClass('swal2-popup');
  }, []);

  return (
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <RouterProvider router={router} future={{ v7_startTransition: true }} />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;

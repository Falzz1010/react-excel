import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading";

// Lazy load page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExcelPage = lazy(() => import("./pages/ExcelPage"));
const Auth = lazy(() => import("./pages/Auth"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

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

const App = () => (
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
        <RouterProvider 
          router={router} 
          future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
          }} 
        />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

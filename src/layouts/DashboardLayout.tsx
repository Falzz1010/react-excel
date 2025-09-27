import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";

export function DashboardLayout() {
  const { user, loading } = useAuth();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const formattedDateShort = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
  });
  const formattedTimeShort = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 sm:h-14 flex items-center justify-between border-b border-border/50 px-2 sm:px-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center min-w-0">
              <SidebarTrigger className="mr-2 sm:mr-4 h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            {/* Desktop/Tablet pill */}
            <div className="hidden sm:flex items-center">
              <div className="flex items-center gap-2 lg:gap-3 rounded-md border border-border/60 bg-background/60 px-2 lg:px-3 py-1 lg:py-1.5 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-1.5 text-muted-foreground">
                  <CalendarDays className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs lg:text-sm">{formattedDate}</span>
                </div>
                <div className="h-3 lg:h-4 w-px bg-border/80" />
                <div className="flex items-center gap-1 lg:gap-1.5">
                  <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
                  <span className="font-mono text-xs lg:text-sm xl:text-base tabular-nums">{formattedTime}</span>
                </div>
              </div>
            </div>
            {/* Mobile compact pill */}
            <div className="sm:hidden flex items-center">
              <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2 py-1 shadow-sm">
                <Clock className="h-3 w-3 text-primary" />
                <span className="font-mono text-xs tabular-nums">{formattedTimeShort}</span>
                <div className="h-2.5 w-px bg-border/80" />
                <span className="text-[10px] text-muted-foreground">{formattedDateShort}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
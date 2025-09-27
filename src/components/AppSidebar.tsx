import { FileSpreadsheet, Home, Package, LogOut, Settings } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { showConfirm, showSuccess, showError } from '@/lib/sweetAlert';

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Excel Manager", url: "/excel", icon: FileSpreadsheet },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Function to handle menu item click and close mobile sidebar
  const handleMenuItemClick = () => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async () => {
    // On mobile, close the sidebar sheet first to avoid focus trap with SweetAlert
    let reopenOnCancel = false;
    if (isMobile && openMobile) {
      setOpenMobile(false);
      reopenOnCancel = true;
      await new Promise((r) => setTimeout(r, 50));
    }
    
    const confirmResult = await showConfirm({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun?',
      icon: 'warning',
      confirmButtonText: 'Ya, logout',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) {
      if (reopenOnCancel) setOpenMobile(true);
      return;
    }

    const { error } = await signOut();
    if (error) {
      await showError('Gagal', error.message || 'Gagal logout');
      if (reopenOnCancel) setOpenMobile(true);
    } else {
      await showSuccess('Berhasil', 'Anda telah logout');
      navigate('/auth', { replace: true });
    }
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"}>
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          {state === "expanded" && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                Dashboard
              </h2>
            </div>
          )}
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      onClick={handleMenuItemClick}
                    >
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="space-y-3">
          {state === "expanded" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
          {state === "collapsed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="w-full p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
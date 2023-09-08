import { dashboardConfig } from "@/config/dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarNav } from "@/components/sidebar-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="relative py-6 pr-6 md:py-8">
            <SidebarNav items={dashboardConfig.sidebarNav} className="p-1" />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col pt-6 ">{children}</main>
      </div>
      <div className="fixed left-1/2 bottom-10 flex w-[90%] -translate-x-1/2 transform items-center justify-between rounded-lg border bg-background/50 shadow-md backdrop-blur-xl md:hidden">
        <MobileNav items={dashboardConfig.sidebarNav} className="p-2" />
      </div>
      {/* <SiteFooter /> */}
    </div>
  );
}

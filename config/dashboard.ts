import { type SidebarNavItem } from "@/types";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Perfil",
      href: "/perfil",
      icon: "user",
    },
    {
      title: "Facturas",
      href: "/facturas",
      icon: "fileText",
    },
    {
      title: "Agregar factura",
      href: "/agregar-factura",
      icon: "plusSquare",
    },
    {
      title: "Reportar error",
      href: "/reportar-error",
      icon: "mailWarning",
    },
  ],
};

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { formatUserName, requireAdminSessionUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminSessionUser();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 17)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={{
          name: formatUserName(user.firstName, user.lastName, user.email),
          email: user.email,
        }}
      />
      <SidebarInset className="bg-background">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

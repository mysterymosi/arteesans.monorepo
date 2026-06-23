"use client";

import Link from "next/link";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    url: "/",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Requests",
    url: "/requests",
    icon: <ListIcon />,
  },
  {
    title: "Applications",
    url: "/artisans/applications",
    icon: <UsersIcon />,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: <TagsIcon />,
  },
];

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="**:data-[slot=sidebar-inner]:bg-card **:data-[slot=sidebar-inner]:text-foreground"
      {...props}
    >
      <SidebarHeader className="border-b border-border bg-card px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-auto gap-3 rounded-lg px-1 py-0 hover:bg-transparent data-[slot=sidebar-menu-button]:p-1!"
              render={<Link href="/" />}
            >
              <span className="grid size-9 place-items-center rounded-md bg-primary text-lg font-bold text-primary-foreground shadow-sm">
                A
              </span>
              <span className="text-lg font-semibold text-foreground">
                Arteesans Admin
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-card px-2 py-3">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="border-t border-border bg-card p-3">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

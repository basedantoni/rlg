import { LevelProgressCard } from "@/components/levels/level-progress-card";

import { Folder, Home, Settings, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CompleteUser } from "@/db/schema/users";
import { trpc } from "@/lib/trpc/api";

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
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

// Menu items.
const items: MenuItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Folder,
  },
  {
    title: "Quests",
    url: "/quests",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const u: { user: CompleteUser } = await trpc.users.getUser();

  const nextLevel = await trpc.levelDefinitions.getLevelDefinitionByLevel({
    level: u.user.level + 1,
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LevelProgressCard
          nextLevelXP={nextLevel.levelDefinition?.xpTreshold!}
          currentXP={u.user.xp}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

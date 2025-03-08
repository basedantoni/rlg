import { Folder, Home, Settings, Shield, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

// Menu items.
const items: MenuItem[] = [
  {
    title: 'Daily Quests',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Quests',
    url: '/quests',
    icon: Shield,
  },
  {
    title: 'Accountability',
    url: '/accountability',
    icon: Users,
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: Folder,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export async function AppSidebar() {
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
      {/* TODO: Add in level progress card when we have a way to track xp */}
      {/* <SidebarFooter>
        <LevelProgressCard
          nextLevelXP={nextLevel.levelDefinition?.xpThreshold!}
          currentXP={u.user.xp ? u.user.xp : 0}
        />
      </SidebarFooter> */}
    </Sidebar>
  );
}

"use client";

import { SidebarTrigger, useSidebar } from "../sidebar";
import { PanelLeft } from "lucide-react";

const Header = () => {
  const { open, openMobile, isMobile } = useSidebar();

  return (
    <header className="flex">
      {isMobile
        ? !openMobile && (
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
          )
        : !open && (
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
          )}
    </header>
  );
};

export default Header;

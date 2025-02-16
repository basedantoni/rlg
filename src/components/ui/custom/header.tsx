"use client";

import { SidebarTrigger, useSidebar } from "../sidebar";

const Header = () => {
  const { state } = useSidebar();

  return (
    <header className="flex">
      {state === "collapsed" && <SidebarTrigger />}
    </header>
  );
};

export default Header;

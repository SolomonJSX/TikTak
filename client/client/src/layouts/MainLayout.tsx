import React from "react";
import TopNav from "../components/TopNav.tsx";
import { useLocation } from "react-router-dom";
import SideNav from "../components/SideNav.tsx";

function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <header>
        <TopNav/>
      </header>
      <div className={[
        useLocation().pathname === "/" ? "max-w-[1440px]" : "",
        "flex justify-between mx-auto w-full lg:px-2.5 px-0"
      ].join(" ")}>
        <div>
          <SideNav/>
        </div>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
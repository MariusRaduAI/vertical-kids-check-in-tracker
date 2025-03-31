
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
            <p>Vertical Kids București © {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

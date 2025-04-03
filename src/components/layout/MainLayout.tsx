
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import EmergencyContacts from "./EmergencyContacts";

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
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
          <footer className="py-3 px-4 md:py-4 md:px-6 border-t flex justify-between items-center text-xs md:text-sm text-muted-foreground">
            <p>Vertical Kids București © {new Date().getFullYear()}</p>
            <EmergencyContacts />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

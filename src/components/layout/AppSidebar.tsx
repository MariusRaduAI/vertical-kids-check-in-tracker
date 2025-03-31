
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  CalendarCheck,
  Clipboard,
  Home,
  Settings,
  Users,
  Tag,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      title: "Dashboard & Analize",
      url: "/",
      icon: Home,
      section: "Principal",
    },
    {
      title: "Check-in & Etichete",
      url: "/checkin",
      icon: Tag,
      section: "Principal",
    },
    {
      title: "Prezență Duminicală",
      url: "/attendance",
      icon: CalendarCheck,
      section: "Principal",
    },
    {
      title: "Centralizator Membri",
      url: "/members",
      icon: Users,
      section: "Principal",
    },
    {
      title: "Training & Onboarding",
      url: "/training",
      icon: BookOpen,
      section: "Suport",
    },
    {
      title: "Setări",
      url: "/settings",
      icon: Settings,
      section: "Avansate",
    },
  ];

  // Group menu items by section
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <Sidebar className="border-r pt-0">
      <SidebarHeader className="h-16 flex items-center px-6">
        <div className="flex items-center gap-2">
          <Clipboard className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Vertical Kids Check-In Tracker</span>
        </div>
        <SidebarTrigger className="ml-auto lg:hidden" />
      </SidebarHeader>
      
      <SidebarContent className="pt-4">
        {Object.entries(groupedMenuItems).map(([section, items]) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3",
                          isActive(item.url) && "text-sidebar-primary font-medium"
                        )}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;


import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, HelpCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import EmergencyContacts from "./EmergencyContacts";

const TopBar: React.FC = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM yyyy");
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
  const isToday = today.getDay() === 0;

  return (
    <header className="h-14 md:h-16 border-b px-3 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div>
          <h2 className="text-sm md:text-base font-medium truncate">{formattedDate}</h2>
          {isToday ? (
            <p className="text-xs text-primary font-medium">Astăzi este duminică!</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Următoarea duminică: {format(nextSunday, "d MMMM")}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <EmergencyContacts />
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
          <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:h-9 md:w-9">
              <Avatar className="h-7 w-7 md:h-8 md:w-8">
                <AvatarFallback className="bg-primary text-white text-xs md:text-sm">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Contul meu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Setări</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Deconectare</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;

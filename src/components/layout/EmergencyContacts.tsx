
import React from "react";
import { Phone, Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const EmergencyContacts: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 h-8 md:h-9">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Urgență</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Contacte pentru urgențe</SheetTitle>
          <SheetDescription>
            În caz de urgență, contactați una dintre persoanele de mai jos.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alice Ivan</h3>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href="tel:+40000000000" className="hover:underline">
                +40 000 000 000
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href="mailto:alice.ivan@example.com" className="hover:underline">
                alice.ivan@example.com
              </a>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Marius Radu</h3>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href="tel:+40761254140" className="hover:underline">
                0761 254 140
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href="mailto:marius.radu@example.com" className="hover:underline">
                marius.radu@example.com
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmergencyContacts;

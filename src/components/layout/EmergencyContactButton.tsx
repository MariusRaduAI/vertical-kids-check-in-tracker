
import React from "react";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EmergencyContact {
  name: string;
  phone: string;
  role?: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: "Alice Ivan",
    phone: "0700000000", // You can update with the correct number
    role: "Coordonator"
  },
  {
    name: "Marius Radu",
    phone: "0761254140",
    role: "Administrator"
  }
];

export const EmergencyContactButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant="destructive" 
        size="sm" 
        className="mr-2 flex items-center gap-1"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Urgență</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacte în caz de urgență</DialogTitle>
            <DialogDescription>
              Apelați unul din aceste numere în caz de urgență.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.name} className="mb-4 p-3 border rounded-md">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-muted-foreground">{contact.role}</div>
                <a 
                  href={`tel:${contact.phone}`} 
                  className="text-primary hover:underline flex items-center mt-1"
                >
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyContactButton;

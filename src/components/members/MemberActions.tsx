
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, PlusCircle } from "lucide-react";

interface MemberActionsProps {
  onAddNewClick: () => void;
}

const MemberActions: React.FC<MemberActionsProps> = ({ onAddNewClick }) => {
  return (
    <>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={onAddNewClick}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Adaugă Copil
      </Button>
    </>
  );
};

export default MemberActions;

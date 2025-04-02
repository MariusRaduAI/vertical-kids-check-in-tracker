
import React from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import TagPreview from "./TagPreview";

interface LiveTagPreviewProps {
  childId: string;
  program: "P1" | "P2" | "Both";
}

const LiveTagPreview: React.FC<LiveTagPreviewProps> = ({ childId, program }) => {
  const { children, currentSunday } = useApp();
  
  const child = children.find(c => c.id === childId);
  if (!child) return null;
  
  const previewTag = {
    childName: child.fullName,
    uniqueCode: `${child.firstName.charAt(0)}${child.lastName.charAt(0)}--${program === "Both" ? "P1+P2" : program}`,
    ageGroup: child.ageGroup,
    program,
    date: format(new Date(currentSunday), "dd.MM.yyyy"),
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Tag className="h-4 w-4" />
          Previzualizare etichetă
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4">
          <h4 className="font-semibold mb-2">Previzualizare etichetă</h4>
          <TagPreview tag={previewTag} />
          <p className="text-xs text-muted-foreground mt-2">
            Aceasta este o previzualizare. Codul unic final va fi generat la check-in.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LiveTagPreview;

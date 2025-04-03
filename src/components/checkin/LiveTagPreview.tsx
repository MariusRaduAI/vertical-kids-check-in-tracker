
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
        <Button variant="outline" size="sm" className="flex gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9 px-2 md:px-3">
          <Tag className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">Previzualizare</span>
          <span className="sm:hidden">Tag</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 sm:w-72 md:w-80 p-0">
        <div className="p-3 md:p-4">
          <h4 className="font-semibold mb-2 text-sm md:text-base">Previzualizare etichetă</h4>
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

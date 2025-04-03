
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Printer } from "lucide-react";
import TagPreview, { TagData } from "./TagPreview";
import { useApp } from "@/context/AppContext";
import { Child } from "@/types/models";

interface TagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date?: string;
  preselectedChildren?: Child[];
}

const TagsDialog: React.FC<TagsDialogProps> = ({
  open,
  onOpenChange,
  date,
  preselectedChildren
}) => {
  const { currentSunday, children, getSiblings } = useApp();
  const [tagCount, setTagCount] = useState(3);
  const [selectedChildren, setSelectedChildren] = useState<Child[]>(preselectedChildren || []);
  
  // Generate tags for preview
  const tags: TagData[] = selectedChildren.map((child) => ({
    childName: child.fullName,
    childId: child.id,
    ageGroup: child.ageGroup,
    program: "P1",
    uniqueCode: `P1-${child.id.substring(0, 4)}`,
    date: date || currentSunday,
    hasAllergies: child.hasAllergies || false,
    allergiesDetails: child.allergiesDetails || "",
    hasSpecialNeeds: child.hasSpecialNeeds || false,
    parents: child.parents.join(", ")
  }));
  
  const handlePrintTags = () => {
    // In a real application, this would trigger the print functionality
    console.log(`Printing ${tagCount * selectedChildren.length} tags`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${tags && tags.length > 1 ? 'sm:max-w-xl' : 'sm:max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>
            {tags && tags.length > 1 
              ? "Etichete Generate" 
              : "Etichetă Generată"}
          </DialogTitle>
          <DialogDescription>
            {tags && tags.length > 1 
              ? `${tags.length} etichete pentru copii selectați` 
              : selectedChildren.length > 0 ? `Etichete pentru ${selectedChildren[0]?.fullName}` : "Selectează copii pentru etichete"}
          </DialogDescription>
        </DialogHeader>
        
        {selectedChildren.length === 0 ? (
          <div className="my-4 text-center text-muted-foreground">
            Niciun copil selectat. Închide dialogul și selectează un copil pentru a genera etichete.
          </div>
        ) : (
          <div className={`${tags.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto' : ''}`}>
            {tags.map((tag, index) => (
              <TagPreview key={index} tag={tag} />
            ))}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="tagCount">Număr de etichete per copil:</Label>
            <Select
              value={tagCount.toString()}
              onValueChange={(value) => setTagCount(parseInt(value))}
            >
              <SelectTrigger id="tagCount" className="w-20">
                <SelectValue placeholder="3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button 
            onClick={handlePrintTags}
            disabled={selectedChildren.length === 0}
          >
            <Printer className="mr-2 h-4 w-4" />
            Printează {tagCount * (tags?.length || 0)} etichete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagsDialog;


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
import { Checkbox } from "@/components/ui/checkbox";
import { Printer, AlertTriangle, Tag } from "lucide-react";
import TagPreview, { TagData } from "./TagPreview";
import { useApp } from "@/context/AppContext";
import { Child } from "@/types/models";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [tagCount, setTagCount] = useState(3);
  const [selectedChildren, setSelectedChildren] = useState<Child[]>(preselectedChildren || []);
  const [selectedProgram, setSelectedProgram] = useState<"P1" | "P2" | "Both">("P1");
  
  // Generate tags for preview
  const tags: TagData[] = selectedChildren.map((child) => ({
    childName: child.fullName,
    ageGroup: child.ageGroup,
    program: selectedProgram,
    uniqueCode: `${child.firstName.charAt(0)}${child.lastName.charAt(0)}-${selectedProgram === "Both" ? "P1+P2" : selectedProgram}`,
    date: format(new Date(date || currentSunday), "dd.MM.yyyy"),
    hasAllergies: child.hasAllergies || false,
    allergiesDetails: child.allergiesDetails || "",
    hasSpecialNeeds: child.hasSpecialNeeds || false,
    parents: child.parents.join(", ")
  }));
  
  const handlePrintTags = () => {
    // In a real application, this would trigger the print functionality
    console.log(`Printing ${tagCount * selectedChildren.length} tags`);
    
    toast({
      title: "Etichete generate",
      description: `${tagCount * selectedChildren.length} etichete au fost trimise la imprimantă.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {tags && tags.length > 1 
              ? "Etichete Generate" 
              : "Etichetă Generată"}
          </DialogTitle>
          <DialogDescription>
            {selectedChildren.length > 0 
              ? `Generează etichete pentru ${selectedChildren.length} copii selectați` 
              : "Selectează copii pentru a genera etichete"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="program">Program:</Label>
            <Select
              value={selectedProgram}
              onValueChange={(value) => setSelectedProgram(value as "P1" | "P2" | "Both")}
            >
              <SelectTrigger id="program" className="w-32">
                <SelectValue placeholder="P1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">Program 1</SelectItem>
                <SelectItem value="P2">Program 2</SelectItem>
                <SelectItem value="Both">Ambele</SelectItem>
              </SelectContent>
            </Select>
            
            <Label htmlFor="tagCount" className="ml-4">Copii per etichetă:</Label>
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
          
          {selectedChildren.length === 0 ? (
            <div className="my-4 text-center text-muted-foreground">
              Niciun copil selectat. Închide dialogul și selectează un copil pentru a genera etichete.
            </div>
          ) : (
            <>
              {/* Tag preview section */}
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Preview etichetă</h3>
                <div className="max-w-[250px] mx-auto">
                  <TagPreview tag={tags[0]} />
                </div>
              </div>
              
              {/* Selected children section */}
              <div>
                <h3 className="font-medium mb-2">Copii selectați ({selectedChildren.length})</h3>
                <div className="border rounded-md max-h-48 overflow-y-auto divide-y">
                  {selectedChildren.map(child => (
                    <div key={child.id} className="p-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{child.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {child.ageGroup} ani
                          {child.hasAllergies && (
                            <span className="ml-2 text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Alergii
                            </span>
                          )}
                        </div>
                      </div>
                      <Checkbox 
                        checked={true}
                        onCheckedChange={(checked) => {
                          if (!checked) {
                            setSelectedChildren(prev => 
                              prev.filter(c => c.id !== child.id)
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                {selectedChildren.length > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Total etichete: {tagCount * selectedChildren.length}
                  </p>
                )}
              </div>
            </>
          )}
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
            Printează {tagCount * selectedChildren.length} etichete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagsDialog;

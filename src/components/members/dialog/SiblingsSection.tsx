
import React, { useState } from "react";
import { Child } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, X } from "lucide-react";

interface SiblingsSectionProps {
  childId?: string;
  siblingIds?: string[];
  children: Child[];
  getSiblings: (childId: string) => Child[];
  onAddSibling: (siblingId: string) => void;
  onRemoveSibling: (siblingId: string) => void;
}

const SiblingsSection: React.FC<SiblingsSectionProps> = ({
  childId,
  siblingIds = [],
  children,
  getSiblings,
  onAddSibling,
  onRemoveSibling,
}) => {
  const [siblingSearch, setSiblingSearch] = useState("");
  const [showSiblingSearch, setShowSiblingSearch] = useState(false);
  
  // Filter siblings that are not already added
  const filteredSiblings = siblingSearch.trim() ? 
    children.filter(c => 
      c.id !== childId && 
      !siblingIds.includes(c.id) &&
      c.fullName.toLowerCase().includes(siblingSearch.toLowerCase())
    ) : [];
  
  // Get current siblings
  const currentSiblings = childId ? getSiblings(childId) : [];
  
  return (
    <div className="space-y-2 border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Users className="h-4 w-4" /> Frați/Surori
        </Label>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setShowSiblingSearch(!showSiblingSearch)}
        >
          {showSiblingSearch ? "Anulează" : "+ Adaugă"}
        </Button>
      </div>
      
      {currentSiblings.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {currentSiblings.map(sibling => (
            <Badge key={sibling.id} variant="secondary" className="flex items-center gap-1">
              {sibling.fullName}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0" 
                onClick={() => onRemoveSibling(sibling.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {showSiblingSearch && (
        <div className="mt-2 space-y-2">
          <Input
            placeholder="Caută un copil pentru a-l adăuga ca frate/soră..."
            value={siblingSearch}
            onChange={(e) => setSiblingSearch(e.target.value)}
          />
          
          {filteredSiblings.length > 0 && (
            <div className="max-h-32 overflow-y-auto border rounded-md divide-y">
              {filteredSiblings.map(child => (
                <div
                  key={child.id}
                  className="p-2 cursor-pointer hover:bg-muted"
                  onClick={() => {
                    onAddSibling(child.id);
                    setSiblingSearch("");
                  }}
                >
                  {child.fullName}
                </div>
              ))}
            </div>
          )}
          
          {siblingSearch && filteredSiblings.length === 0 && (
            <p className="text-sm text-muted-foreground">Nu a fost găsit niciun copil</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SiblingsSection;

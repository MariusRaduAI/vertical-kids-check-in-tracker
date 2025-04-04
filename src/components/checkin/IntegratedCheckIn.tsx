
import React, { useState, useEffect } from "react";
import { Child } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Tag, CalendarPlus } from "lucide-react";
import SingleChildCheckIn from "./SingleChildCheckIn";
import MultiChildCheckIn, { ChildCheckInState } from "./MultiChildCheckIn";
import { useApp } from "@/context/AppContext";
import TagsDialog from "./TagsDialog";

interface IntegratedCheckInProps {
  onNewChildClick?: () => void;
}

const IntegratedCheckIn: React.FC<IntegratedCheckInProps> = ({
  onNewChildClick
}) => {
  const { children, searchChildren } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedSiblings, setSelectedSiblings] = useState<Child[]>([]);
  const [checkInMode, setCheckInMode] = useState<"single" | "multi">("single");
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  
  // State for multi-child check-in
  const [childrenToCheckIn, setChildrenToCheckIn] = useState<ChildCheckInState[]>([]);
  
  // Handle search changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchChildren(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchChildren]);
  
  // Reset the search when a child is selected
  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedSiblings([]);
    setCheckInMode("single");
    
    // Reset multi-child check-in state
    setChildrenToCheckIn([
      {
        childId: child.id,
        selected: true,
        program: "P1",
        medicalCheckComplete: false,
      }
    ]);
  };
  
  // Handle sibling selection
  const handleSiblingSelect = (siblingId: string, selected: boolean) => {
    const sibling = children.find(c => c.id === siblingId);
    if (!sibling) return;
    
    if (selected) {
      setSelectedSiblings(prev => [...prev, sibling]);
      
      // Add to childrenToCheckIn
      setChildrenToCheckIn(prev => [
        ...prev,
        {
          childId: siblingId,
          selected: true,
          program: "P1",
          medicalCheckComplete: false
        }
      ]);
      
      setCheckInMode("multi");
    } else {
      setSelectedSiblings(prev => prev.filter(s => s.id !== siblingId));
      setChildrenToCheckIn(prev => prev.filter(c => c.childId !== siblingId));
      
      // If no siblings left, go back to single mode
      if (selectedSiblings.length === 1) {
        setCheckInMode("single");
      }
    }
  };
  
  // Update check-in state for a child
  const updateChildCheckInState = (
    childId: string,
    field: keyof ChildCheckInState,
    value: any
  ) => {
    setChildrenToCheckIn(prev => 
      prev.map(child => 
        child.childId === childId ? { ...child, [field]: value } : child
      )
    );
  };
  
  // Handle check-in completion
  const handleCheckInComplete = () => {
    setSelectedChild(null);
    setSelectedSiblings([]);
    setChildrenToCheckIn([]);
    setShowTagsDialog(true);
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedChild(null);
    setSelectedSiblings([]);
    setChildrenToCheckIn([]);
    setCheckInMode("single");
  };
  
  // Children to show in the tags dialog
  const tagsDialogChildren = selectedChild 
    ? [selectedChild, ...selectedSiblings] 
    : [];
  
  return (
    <div className="space-y-4">
      {/* Search section */}
      {!selectedChild && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută un copil după nume sau nume părinte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5" 
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                {searchResults.map(child => (
                  <div 
                    key={child.id}
                    className="p-2 border-b last:border-b-0 hover:bg-muted cursor-pointer"
                    onClick={() => handleChildSelect(child)}
                  >
                    <div className="font-medium">{child.fullName}</div>
                    {child.parents.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Părinți: {child.parents.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <div className="mt-2 text-center p-4 border rounded-md bg-muted">
                <p className="text-muted-foreground">Niciun rezultat găsit</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={onNewChildClick}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Înregistrează copil nou
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Check-in section */}
      {selectedChild && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Check-in</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowTagsDialog(true)}
              >
                <Tag className="mr-2 h-4 w-4" />
                Generează etichete
              </Button>
              <Button 
                variant="ghost" 
                onClick={clearSelection}
              >
                <X className="mr-2 h-4 w-4" />
                Anulează
              </Button>
            </div>
          </div>
          
          {checkInMode === "single" && (
            <SingleChildCheckIn
              child={selectedChild}
              onSiblingSelect={handleSiblingSelect}
              onCheckInComplete={handleCheckInComplete}
            />
          )}
          
          {checkInMode === "multi" && (
            <MultiChildCheckIn 
              children={[selectedChild, ...selectedSiblings]} 
              childrenToCheckIn={childrenToCheckIn}
              updateChildCheckInState={updateChildCheckInState}
              onCheckInComplete={handleCheckInComplete}
            />
          )}
        </div>
      )}
      
      {/* Tags dialog */}
      <TagsDialog 
        open={showTagsDialog} 
        onOpenChange={setShowTagsDialog}
        preselectedChildren={tagsDialogChildren}
      />
    </div>
  );
};

export default IntegratedCheckIn;

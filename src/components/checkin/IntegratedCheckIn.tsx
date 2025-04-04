import React, { useState } from "react";
import { Child } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import TagsDialog from "./TagsDialog";
import ChildSelectionSection from "./checkInSections/ChildSelectionSection";
import ChildInfoCard from "./checkInSections/ChildInfoCard";
import CheckInFormSection from "./checkInSections/CheckInFormSection";
import { ChildCheckInState } from "./checkInSections/types";

interface IntegratedCheckInProps {
  onNewChildClick?: () => void;
}

const IntegratedCheckIn: React.FC<IntegratedCheckInProps> = ({
  onNewChildClick
}) => {
  const { children, checkInChild, currentSunday } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedSiblings, setSelectedSiblings] = useState<Child[]>([]);
  const [checkInMode, setCheckInMode] = useState<"single" | "multi">("single");
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [program, setProgram] = useState<"P1" | "P2" | "Both">("P1");
  const [medicalCheckComplete, setMedicalCheckComplete] = useState(false);
  
  const [childrenToCheckIn, setChildrenToCheckIn] = useState<ChildCheckInState[]>([]);
  
  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setSearchResults([]);
    setSelectedSiblings([]);
    setCheckInMode("single");
    
    setChildrenToCheckIn([
      {
        childId: child.id,
        selected: true,
        program: "P1",
        medicalCheckComplete: false,
      }
    ]);
  };
  
  const handleSiblingSelect = (siblingId: string, selected: boolean) => {
    const sibling = children.find(c => c.id === siblingId);
    if (!sibling) return;
    
    if (selected) {
      setSelectedSiblings(prev => [...prev, sibling]);
      
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
      
      if (selectedSiblings.length === 1) {
        setCheckInMode("single");
      }
    }
  };

  const selectAllSiblings = (child: Child) => {
    const siblings = getSiblings(child.id);
    setSelectedSiblings(siblings);
    setCheckInMode(siblings.length > 0 ? "multi" : "single");
    
    const checkInStates: ChildCheckInState[] = [
      {
        childId: child.id,
        selected: true,
        program: "P1",
        medicalCheckComplete: false,
      },
      ...siblings.map(sibling => ({
        childId: sibling.id,
        selected: true,
        program: "P1",
        medicalCheckComplete: false,
      }))
    ];
    
    setChildrenToCheckIn(checkInStates);
  };
  
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
  
  const handleCheckInComplete = () => {
    if (selectedChild) {
      const programsToCheckIn = program === "Both" ? ["P1", "P2"] : [program];
      
      programsToCheckIn.forEach(p => {
        checkInChild(
          selectedChild.id,
          p as "P1" | "P2",
          { temperature: true, noSymptoms: true, goodCondition: true }
        );
        
        if (checkInMode === "multi") {
          selectedSiblings.forEach(sibling => {
            checkInChild(
              sibling.id,
              p as "P1" | "P2",
              { temperature: true, noSymptoms: true, goodCondition: true }
            );
          });
        }
      });
    }
    
    setShowTagsDialog(true);
  };
  
  const clearSelection = () => {
    setSelectedChild(null);
    setSelectedSiblings([]);
    setChildrenToCheckIn([]);
    setCheckInMode("single");
    setSearchQuery("");
  };
  
  const tagsDialogChildren = selectedChild 
    ? [selectedChild, ...selectedSiblings] 
    : [];

  const { getSiblings } = useApp();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ChildSelectionSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            selectedChild={selectedChild}
            handleChildSelect={handleChildSelect}
            selectAllSiblings={selectAllSiblings}
            getSiblings={getSiblings}
            onNewChildClick={onNewChildClick}
          />
          
          {selectedChild && (
            <ChildInfoCard
              selectedChild={selectedChild}
              selectedSiblings={selectedSiblings}
              handleSiblingSelect={handleSiblingSelect}
              getSiblings={getSiblings}
              clearSelection={clearSelection}
            />
          )}
        </div>
        
        {selectedChild && (
          <CheckInFormSection 
            selectedChild={selectedChild}
            selectedSiblings={selectedSiblings}
            program={program}
            setProgram={setProgram}
            medicalCheckComplete={medicalCheckComplete}
            setMedicalCheckComplete={setMedicalCheckComplete}
            handleCheckInComplete={handleCheckInComplete}
            setShowTagsDialog={setShowTagsDialog}
            currentSunday={currentSunday}
          />
        )}
      </div>
      
      <TagsDialog 
        open={showTagsDialog} 
        onOpenChange={setShowTagsDialog}
        preselectedChildren={tagsDialogChildren}
      />
    </div>
  );
};

export default IntegratedCheckIn;

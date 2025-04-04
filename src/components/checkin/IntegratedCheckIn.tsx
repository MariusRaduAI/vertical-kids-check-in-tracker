
import React, { useState, useEffect } from "react";
import { Child } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Tag, CalendarPlus, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import TagsDialog from "./TagsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import SingleChildCheckIn from "./SingleChildCheckIn";
import MultiChildCheckIn, { ChildCheckInState } from "./MultiChildCheckIn";
import TagPreview, { TagData } from "./TagPreview";
import { format } from "date-fns";

interface IntegratedCheckInProps {
  onNewChildClick?: () => void;
}

const IntegratedCheckIn: React.FC<IntegratedCheckInProps> = ({
  onNewChildClick
}) => {
  const { children, searchChildren, getSiblings, checkInChild, currentSunday } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedSiblings, setSelectedSiblings] = useState<Child[]>([]);
  const [checkInMode, setCheckInMode] = useState<"single" | "multi">("single");
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [program, setProgram] = useState<"P1" | "P2" | "Both">("P1");
  const [medicalCheckComplete, setMedicalCheckComplete] = useState(false);
  
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

  // Select all siblings at once
  const selectAllSiblings = (child: Child) => {
    const siblings = getSiblings(child.id);
    setSelectedSiblings(siblings);
    setCheckInMode(siblings.length > 0 ? "multi" : "single");
    
    // Update childrenToCheckIn with main child and all siblings
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
    // Process the check-in
    if (selectedChild) {
      const programsToCheckIn = program === "Both" ? ["P1", "P2"] : [program];
      
      programsToCheckIn.forEach(p => {
        checkInChild(
          selectedChild.id,
          p as "P1" | "P2",
          { temperature: true, noSymptoms: true, goodCondition: true }
        );
        
        // Also check in siblings if in multi mode
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
    
    // Show tags dialog
    setShowTagsDialog(true);
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedChild(null);
    setSelectedSiblings([]);
    setChildrenToCheckIn([]);
    setCheckInMode("single");
    setSearchQuery("");
  };
  
  // Generate tag data for preview
  const generateTagData = (child: Child): TagData => {
    return {
      childName: child.fullName,
      ageGroup: child.ageGroup,
      program,
      uniqueCode: `${child.firstName.charAt(0)}${child.lastName.charAt(0)}-${program === "Both" ? "P1+P2" : program}`,
      date: format(new Date(currentSunday), "dd.MM.yyyy"),
      hasAllergies: child.hasAllergies || false,
      allergiesDetails: child.allergiesDetails || "",
      hasSpecialNeeds: child.hasSpecialNeeds || false,
      parents: child.parents.join(", ")
    };
  };
  
  // Children to show in the tags dialog
  const tagsDialogChildren = selectedChild 
    ? [selectedChild, ...selectedSiblings] 
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search and child selection section */}
        <div className="space-y-4">
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
          
          {searchResults.length > 0 && !selectedChild && (
            <Card>
              <CardContent className="p-2">
                <div className="max-h-60 overflow-y-auto divide-y">
                  {searchResults.map(child => {
                    const siblings = getSiblings(child.id);
                    const hasSiblings = siblings.length > 0;
                    
                    return (
                      <div 
                        key={child.id}
                        className="p-2 hover:bg-muted cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div onClick={() => handleChildSelect(child)} className="flex-1">
                            <span className="font-medium">{child.fullName}</span>
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              <AgeGroupBadge ageGroup={child.ageGroup} className="text-xs" />
                              <CategoryBadge category={child.category} className="text-xs" />
                              {child.isNew && <NewChildBadge />}
                              {child.consecutiveAbsences && child.consecutiveAbsences >= 3 && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                                  <AlertTitle className="h-3 w-3 mr-1" />
                                  {child.consecutiveAbsences} absențe
                                </span>
                              )}
                            </div>
                            {child.parents.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Părinți: {child.parents.join(", ")}
                              </div>
                            )}
                          </div>
                          
                          {hasSiblings && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs text-cyan-600 whitespace-nowrap"
                              onClick={() => selectAllSiblings(child)}
                            >
                              <Users className="h-3.5 w-3.5 mr-1" />
                              Check-in cu frați ({siblings.length})
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          
          {searchQuery && searchResults.length === 0 && !selectedChild && (
            <div className="text-center p-4 border rounded-md bg-muted">
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
          
          {selectedChild && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Informații copil</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4 mr-1" />
                  Anulează
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">{selectedChild.fullName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <AgeGroupBadge ageGroup={selectedChild.ageGroup} />
                          <CategoryBadge category={selectedChild.category} />
                          {selectedChild.isNew && <NewChildBadge />}
                        </div>
                      </div>
                    </div>
                    
                    {selectedChild.parents.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium">Părinți:</h5>
                        <p className="text-sm">{selectedChild.parents.join(", ")}</p>
                      </div>
                    )}
                    
                    {selectedChild.hasAllergies && (
                      <Alert variant="destructive" className="py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Alergii</AlertTitle>
                        <AlertDescription>
                          {selectedChild.allergiesDetails || "Informații indisponibile"}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {selectedChild.hasSpecialNeeds && (
                      <Alert className="py-2 bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-amber-800">Nevoi speciale</AlertTitle>
                        <AlertDescription className="text-amber-700">
                          {selectedChild.specialNeedsDetails || "Informații indisponibile"}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Siblings section */}
                    {getSiblings(selectedChild.id).length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium">Frați/Surori:</h5>
                        </div>
                        <div className="space-y-2">
                          {getSiblings(selectedChild.id).map(sibling => (
                            <div key={sibling.id} className="flex items-center gap-2">
                              <Checkbox 
                                id={`sibling-${sibling.id}`}
                                checked={selectedSiblings.some(s => s.id === sibling.id)}
                                onCheckedChange={(checked) => 
                                  handleSiblingSelect(sibling.id, checked === true)
                                }
                              />
                              <Label htmlFor={`sibling-${sibling.id}`} className="cursor-pointer">
                                {sibling.fullName} 
                                <span className="ml-1 text-xs text-muted-foreground">
                                  ({sibling.ageGroup})
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Check-in and tag preview section */}
        {selectedChild && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">Check-in</h3>
                
                <div className="space-y-4">
                  {/* Program selection */}
                  <div className="space-y-2">
                    <Label htmlFor="program">Participare la Program</Label>
                    <RadioGroup
                      value={program}
                      onValueChange={(value) => setProgram(value as "P1" | "P2" | "Both")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="P1" id="p1" />
                        <Label htmlFor="p1">Doar Program 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="P2" id="p2" />
                        <Label htmlFor="p2">Doar Program 2</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Both" id="both" />
                        <Label htmlFor="both">Ambele Programe</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Medical check section */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Verificare medicală</h4>
                    <div className="flex items-start space-x-2 p-4 rounded-md border border-gray-200 bg-gray-50">
                      <Checkbox
                        id="medical-check"
                        checked={medicalCheckComplete}
                        onCheckedChange={(checked) => setMedicalCheckComplete(checked === true)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="medical-check" className="font-medium">
                          Confirmă verificarea medicală completă
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Confirm că am verificat temperatura, copilul nu prezintă simptome (tuse/febră) 
                          și este într-o stare generală bună.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tag preview */}
                  {selectedChild && (
                    <div className="border rounded-md p-3 bg-gray-50">
                      <h4 className="font-medium text-sm mb-2 text-center">Previzualizare etichetă</h4>
                      <div className="max-w-[250px] mx-auto">
                        <TagPreview tag={generateTagData(selectedChild)} />
                      </div>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        {selectedSiblings.length > 0 && 
                          `+ ${selectedSiblings.length} etichete pentru frați/surori`}
                      </p>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      onClick={handleCheckInComplete}
                      disabled={!medicalCheckComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Înregistrează prezența
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setShowTagsDialog(true)}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Generează etichete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
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


import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Child, AgeGroup } from "@/types/models";

// Import all the new components
import ChildSearch from "@/components/checkin/ChildSearch";
import NewChildForm from "@/components/checkin/NewChildForm";
import SingleChildCheckIn from "@/components/checkin/SingleChildCheckIn";
import MultiChildCheckIn from "@/components/checkin/MultiChildCheckIn";
import TagsDialog from "@/components/checkin/TagsDialog";
import Stats from "@/components/checkin/Stats";
import { TagData } from "@/components/checkin/TagPreview";
import UpcomingSundayBirthdays from "@/components/checkin/UpcomingSundayBirthdays";

interface ChildCheckInState {
  childId: string;
  selected: boolean;
  program: "P1" | "P2" | "Both";
  medicalCheckComplete: boolean;
}

const CheckIn: React.FC = () => {
  const {
    searchChildren,
    addChild,
    checkInChild,
    currentSunday,
    getTotalPresentToday,
    getAttendanceSummaryForDate,
    children,
    getSiblings,
  } = useApp();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isNewChild, setIsNewChild] = useState(false);
  
  const [multiCheckInMode, setMultiCheckInMode] = useState(false);
  const [childrenToCheckIn, setChildrenToCheckIn] = useState<ChildCheckInState[]>([]);
  
  const [newChildData, setNewChildData] = useState({
    firstName: "",
    lastName: "",
    ageGroup: "4-6" as AgeGroup,
  });
  
  const [tagOpen, setTagOpen] = useState(false);
  const [tagCount, setTagCount] = useState(3);
  
  const [generatedTags, setGeneratedTags] = useState<TagData[] | null>(null);

  const todayStats = getTotalPresentToday();
  const todaySummary = getAttendanceSummaryForDate(currentSunday);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchChildren(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchChildren]);

  const showAbsenceWarning = (child: Child) => {
    if (child.consecutiveAbsences && child.consecutiveAbsences >= 3) {
      toast({
        title: "Atenție! Absențe consecutive",
        description: `${child.fullName} are ${child.consecutiveAbsences} absențe consecutive. Contactați familia.`,
        variant: "destructive",
      });
    }
  };

  const handleSelectChild = (child: Child) => {
    const siblings = getSiblings(child.id);
    
    showAbsenceWarning(child);
    
    if (siblings.length > 0) {
      setMultiCheckInMode(true);
      
      const initialChildrenState: ChildCheckInState[] = [
        {
          childId: child.id,
          selected: true,
          program: "P1" as "P1" | "P2" | "Both",
          medicalCheckComplete: false,
        },
        ...siblings.map(sibling => {
          if (sibling.consecutiveAbsences && sibling.consecutiveAbsences >= 3) {
            showAbsenceWarning(sibling);
          }
          
          return {
            childId: sibling.id,
            selected: true,
            program: "P1" as "P1" | "P2" | "Both",
            medicalCheckComplete: false,
          };
        })
      ];
      
      setChildrenToCheckIn(initialChildrenState);
    } else {
      setMultiCheckInMode(false);
      setSelectedChild(child);
      
      setChildrenToCheckIn([{
        childId: child.id,
        selected: true,
        program: "P1" as "P1" | "P2" | "Both",
        medicalCheckComplete: false,
      }]);
    }
    
    setSearchQuery(child.fullName);
    setSearchResults([]);
    setIsNewChild(false);
  };

  const handleNewChildClick = () => {
    setIsNewChild(true);
    setSelectedChild(null);
    setMultiCheckInMode(false);
    
    const nameParts = searchQuery.split(" ");
    if (nameParts.length >= 2) {
      setNewChildData({
        ...newChildData,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
      });
    } else {
      setNewChildData({
        ...newChildData,
        firstName: searchQuery,
        lastName: "",
      });
    }
  };

  const handleCreateNewChild = () => {
    if (!newChildData.firstName || !newChildData.lastName) {
      toast({
        title: "Eroare",
        description: "Numele și prenumele sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    const fullName = `${newChildData.firstName} ${newChildData.lastName}`;
    
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 5);
    
    const newChild = addChild({
      firstName: newChildData.firstName,
      lastName: newChildData.lastName,
      fullName,
      birthDate: birthDate.toISOString().split("T")[0],
      age: 5,
      daysUntilBirthday: 0,
      ageGroup: newChildData.ageGroup,
      category: "Guest",
      parents: [],
      siblingIds: [],
    });

    setSelectedChild(newChild);
    setSearchQuery(fullName);
    setIsNewChild(false);
  };

  const handleSingleChildCheckIn = () => {
    if (!selectedChild) return;

    if (!childrenToCheckIn.find(c => c.childId === selectedChild.id)?.medicalCheckComplete) {
      toast({
        title: "Verificare medicală necesară",
        description: "Verificarea medicală completă este obligatorie înainte de a genera eticheta.",
        variant: "destructive",
      });
      return;
    }

    const medicalCheckData = {
      temperature: true,
      noSymptoms: true,
      goodCondition: true
    };

    const childState = childrenToCheckIn.find(c => c.childId === selectedChild.id);
    if (!childState) return;
    
    const program = childState.program;
    
    if (program === "Both") {
      const attendanceP1 = checkInChild(
        selectedChild.id,
        "P1",
        medicalCheckData
      );
      
      const attendanceP2 = checkInChild(
        selectedChild.id,
        "P2",
        medicalCheckData
      );

      if (attendanceP1 && attendanceP2) {
        const combinedTag = {
          childName: selectedChild.fullName,
          uniqueCode: `${attendanceP1.uniqueCode?.split('--')[0]}--P1+P2`,
          ageGroup: selectedChild.ageGroup,
          program: "Both" as "P1" | "P2" | "Both",
          date: format(new Date(currentSunday), "dd.MM.yyyy"),
        };
        
        setGeneratedTags([combinedTag]);
        setTagOpen(true);
      }
    } else {
      const checkinProgram = program as "P1" | "P2";
      const attendance = checkInChild(
        selectedChild.id,
        checkinProgram,
        medicalCheckData
      );

      if (attendance) {
        const tag = {
          childName: selectedChild.fullName,
          uniqueCode: attendance.uniqueCode || "",
          ageGroup: selectedChild.ageGroup,
          program: checkinProgram,
          date: format(new Date(currentSunday), "dd.MM.yyyy"),
        };
        
        setGeneratedTags([tag]);
        setTagOpen(true);
      }
    }
  };
  
  const handleMultiChildrenCheckIn = () => {
    const selectedChildren = childrenToCheckIn.filter(c => c.selected);
    
    if (selectedChildren.length === 0) {
      toast({
        title: "Niciun copil selectat",
        description: "Selectați cel puțin un copil pentru check-in.",
        variant: "destructive",
      });
      return;
    }
    
    const allMedicalChecksComplete = selectedChildren.every(c => c.medicalCheckComplete);
    
    if (!allMedicalChecksComplete) {
      toast({
        title: "Verificare medicală necesară",
        description: "Verificarea medicală completă este obligatorie pentru toți copiii selectați.",
        variant: "destructive",
      });
      return;
    }
    
    const medicalCheckData = {
      temperature: true,
      noSymptoms: true,
      goodCondition: true
    };
    
    const generatedTagsArray: TagData[] = [];
    
    selectedChildren.forEach(childState => {
      const child = children.find(c => c.id === childState.childId);
      if (!child) return;
      
      if (childState.program === "Both") {
        const attendanceP1 = checkInChild(
          childState.childId,
          "P1",
          medicalCheckData
        );
        
        const attendanceP2 = checkInChild(
          childState.childId,
          "P2",
          medicalCheckData
        );
        
        if (attendanceP1 && attendanceP2) {
          generatedTagsArray.push({
            childName: child.fullName,
            uniqueCode: `${attendanceP1.uniqueCode?.split('--')[0]}--P1+P2`,
            ageGroup: child.ageGroup,
            program: "Both",
            date: format(new Date(currentSunday), "dd.MM.yyyy"),
          });
        }
      } else {
        const program = childState.program as "P1" | "P2";
        const attendance = checkInChild(
          childState.childId,
          program,
          medicalCheckData
        );
        
        if (attendance) {
          generatedTagsArray.push({
            childName: child.fullName,
            uniqueCode: attendance.uniqueCode || "",
            ageGroup: child.ageGroup,
            program,
            date: format(new Date(currentSunday), "dd.MM.yyyy"),
          });
        }
      }
    });
    
    if (generatedTagsArray.length > 0) {
      setGeneratedTags(generatedTagsArray);
      setTagOpen(true);
    }
  };

  const handlePrintTags = () => {
    const tagDescriptions = generatedTags?.map(tag => {
      const programInfo = tag.program === "Both" ? "ambele programe" : 
                          tag.program === "P1" ? "programul 1" : "programul 2";
      return `${tag.childName} (${programInfo})`;
    }).join(", ");
    
    toast({
      title: "Etichete trimise la imprimantă",
      description: `${tagCount * (generatedTags?.length || 0)} etichete pentru ${tagDescriptions} au fost trimise la imprimantă.`,
    });
    setTagOpen(false);
    
    setSelectedChild(null);
    setMultiCheckInMode(false);
    setChildrenToCheckIn([]);
    setSearchQuery("");
  };

  const handleReset = () => {
    setSelectedChild(null);
    setSearchQuery("");
    setIsNewChild(false);
    setMultiCheckInMode(false);
    setChildrenToCheckIn([]);
  };
  
  const updateChildCheckInState = (
    childId: string,
    field: keyof ChildCheckInState,
    value: any
  ) => {
    setChildrenToCheckIn(prev => 
      prev.map(child => 
        child.childId === childId 
          ? { ...child, [field]: value } 
          : child
      )
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Check-in & Generare Etichete"
        description="Înregistrează prezența copiilor și generează etichete pentru ei"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Copii</CardTitle>
              <CardDescription>
                Caută un copil după nume sau creează un nou profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChildSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                onSelectChild={handleSelectChild}
                onNewChildClick={handleNewChildClick}
                selectedChild={selectedChild}
                isNewChild={isNewChild}
                multiCheckInMode={multiCheckInMode}
              />

              {isNewChild && (
                <NewChildForm 
                  newChildData={newChildData}
                  setNewChildData={setNewChildData}
                  onCreateNewChild={handleCreateNewChild}
                  onCancel={() => setIsNewChild(false)}
                />
              )}

              {selectedChild && !multiCheckInMode && (
                <SingleChildCheckIn 
                  child={selectedChild}
                  program={childrenToCheckIn[0]?.program || "P1"}
                  medicalCheckComplete={childrenToCheckIn[0]?.medicalCheckComplete || false}
                  onProgramChange={(value) => 
                    updateChildCheckInState(selectedChild.id, 'program', value)
                  }
                  onMedicalCheckChange={(checked) => 
                    updateChildCheckInState(selectedChild.id, 'medicalCheckComplete', checked)
                  }
                />
              )}
              
              {multiCheckInMode && childrenToCheckIn.length > 0 && (
                <MultiChildCheckIn 
                  children={children}
                  childrenToCheckIn={childrenToCheckIn}
                  updateChildCheckInState={updateChildCheckInState}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Resetează
              </Button>
              {multiCheckInMode ? (
                <Button
                  onClick={handleMultiChildrenCheckIn}
                  disabled={!childrenToCheckIn.some(c => c.selected && c.medicalCheckComplete)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Generează Etichete ({childrenToCheckIn.filter(c => c.selected).length})
                </Button>
              ) : (
                <Button
                  onClick={handleSingleChildCheckIn}
                  disabled={!selectedChild || !childrenToCheckIn.some(c => c.medicalCheckComplete)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Generează Etichetă
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Stats 
            currentSunday={currentSunday}
            stats={todayStats}
            summary={todaySummary}
          />
          
          <UpcomingSundayBirthdays children={children} weekCount={4} />
        </div>
      </div>

      <TagsDialog 
        open={tagOpen}
        onOpenChange={setTagOpen}
        tags={generatedTags}
        tagCount={tagCount}
        setTagCount={setTagCount}
        onPrintTags={handlePrintTags}
      />
    </div>
  );
};

export default CheckIn;

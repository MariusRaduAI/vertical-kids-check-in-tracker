
import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import SiblingBadge from "@/components/common/SiblingBadge";
import { Child, AgeGroup } from "@/types/models";
import { Search, AlertTriangle, Tag, Printer, BadgePlus, Users } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UpcomingSundayBirthdays from "@/components/checkin/UpcomingSundayBirthdays";

interface ChildCheckInState {
  childId: string;
  selected: boolean;
  program: "P1" | "P2" | "Both";
  medicalCheckComplete: boolean;
}

interface TagData {
  childName: string;
  uniqueCode: string;
  ageGroup: AgeGroup;
  program: "P1" | "P2" | "Both";
  date: string;
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
  
  // Multiple children check-in states
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

  const handleSelectChild = (child: Child) => {
    const siblings = getSiblings(child.id);
    
    if (siblings.length > 0) {
      // Initialize multi-check-in mode with this child and siblings
      setMultiCheckInMode(true);
      
      const initialChildrenState: ChildCheckInState[] = [
        {
          childId: child.id,
          selected: true,
          program: "P1", // Default program
          medicalCheckComplete: false,
        },
        ...siblings.map(sibling => ({
          childId: sibling.id,
          selected: true, // By default select all siblings
          program: "P1", // Default program
          medicalCheckComplete: false,
        }))
      ];
      
      setChildrenToCheckIn(initialChildrenState);
    } else {
      // Regular single child mode
      setMultiCheckInMode(false);
      setSelectedChild(child);
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

    // Check if medical check is complete
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
    // Get all selected children
    const selectedChildren = childrenToCheckIn.filter(c => c.selected);
    
    if (selectedChildren.length === 0) {
      toast({
        title: "Niciun copil selectat",
        description: "Selectați cel puțin un copil pentru check-in.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all selected children have medical checks complete
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
    
    // Process each selected child
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

  const LiveTagPreview = ({ childId, program }: { childId: string, program: "P1" | "P2" | "Both" }) => {
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

  const TagPreview = ({ tag }: { tag: TagData }) => {
    if (!tag) return null;
    
    return (
      <div className="border-2 border-primary rounded-lg p-6 my-4 space-y-4 bg-white shadow-md">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{tag.childName}</h3>
          <div className="text-xl font-mono tracking-wider">
            {tag.uniqueCode}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <AgeGroupBadge ageGroup={tag.ageGroup} className="text-sm" />
          <div className="px-2 py-1 bg-primary text-white rounded-full text-sm">
            {tag.program === "Both" ? "P1+P2" : tag.program}
          </div>
        </div>
        
        <div className="text-center text-sm">
          {tag.date}
        </div>
      </div>
    );
  };
  
  // Render child item for multi-check-in
  const renderChildCheckInItem = (childId: string, index: number) => {
    const child = children.find(c => c.id === childId);
    if (!child) return null;
    
    const childState = childrenToCheckIn.find(c => c.childId === childId);
    if (!childState) return null;
    
    return (
      <div key={childId} className={`border rounded-md p-4 ${index > 0 ? 'mt-4' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={childState.selected}
              onCheckedChange={(checked) => 
                updateChildCheckInState(childId, 'selected', checked === true)
              }
              id={`select-${childId}`}
            />
            <Label htmlFor={`select-${childId}`} className="font-medium text-lg">
              {child.fullName}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <AgeGroupBadge ageGroup={child.ageGroup} />
            <CategoryBadge category={child.category} />
            {child.isNew && <NewChildBadge />}
          </div>
        </div>
        
        {childState.selected && (
          <>
            <div className="space-y-2 pl-7">
              <Label htmlFor={`program-${childId}`}>Participare la Program</Label>
              <RadioGroup
                value={childState.program}
                onValueChange={(value) => 
                  updateChildCheckInState(childId, 'program', value as "P1" | "P2" | "Both")
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P1" id={`p1-${childId}`} />
                  <Label htmlFor={`p1-${childId}`}>Doar Program 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P2" id={`p2-${childId}`} />
                  <Label htmlFor={`p2-${childId}`}>Doar Program 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Both" id={`both-${childId}`} />
                  <Label htmlFor={`both-${childId}`}>Ambele Programe</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 pl-7 mt-4">
              <h4 className="font-medium">Verificare medicală</h4>
              <div className="flex items-start space-x-2 p-4 rounded-md border border-gray-200 bg-gray-50">
                <Checkbox
                  id={`medical-${childId}`}
                  checked={childState.medicalCheckComplete}
                  onCheckedChange={(checked) => 
                    updateChildCheckInState(childId, 'medicalCheckComplete', checked === true)
                  }
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor={`medical-${childId}`} className="font-medium">
                    Confirmă verificarea medicală completă
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Confirm că am verificat temperatura, copilul nu prezintă simptome (tuse/febră) 
                    și este într-o stare generală bună.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-3 pl-7">
              <LiveTagPreview childId={childId} program={childState.program} />
            </div>
          </>
        )}
      </div>
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
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Caută după nume..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {searchResults.length > 0 && !selectedChild && !isNewChild && !multiCheckInMode && (
                  <div className="absolute z-10 w-full bg-white rounded-md shadow-lg mt-1 border">
                    <ul className="py-1">
                      {searchResults.map((child) => (
                        <li
                          key={child.id}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                          onClick={() => handleSelectChild(child)}
                        >
                          <div>
                            <span className="font-medium">{child.fullName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <AgeGroupBadge ageGroup={child.ageGroup} />
                              <CategoryBadge category={child.category} />
                              {child.isNew && <NewChildBadge />}
                              <SiblingBadge 
                                count={child.siblingIds?.length || 0} 
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchQuery && !selectedChild && searchResults.length === 0 && !isNewChild && !multiCheckInMode && (
                  <div className="mt-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Niciun copil găsit. </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={handleNewChildClick}
                    >
                      Este copil nou?
                    </Button>
                  </div>
                )}
              </div>

              {isNewChild && (
                <div className="space-y-4 border rounded-md p-4 mt-4">
                  <h3 className="font-medium">Adaugă copil nou</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prenume</Label>
                      <Input
                        id="firstName"
                        value={newChildData.firstName}
                        onChange={(e) =>
                          setNewChildData({
                            ...newChildData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nume</Label>
                      <Input
                        id="lastName"
                        value={newChildData.lastName}
                        onChange={(e) =>
                          setNewChildData({
                            ...newChildData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">Grupa de vârstă</Label>
                    <Select
                      value={newChildData.ageGroup}
                      onValueChange={(value) =>
                        setNewChildData({
                          ...newChildData,
                          ageGroup: value as AgeGroup,
                        })
                      }
                    >
                      <SelectTrigger id="ageGroup">
                        <SelectValue placeholder="Selectează grupa de vârstă" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 ani</SelectItem>
                        <SelectItem value="1-2">1-2 ani</SelectItem>
                        <SelectItem value="2-3">2-3 ani</SelectItem>
                        <SelectItem value="4-6">4-6 ani</SelectItem>
                        <SelectItem value="7-12">7-12 ani</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewChild(false)}
                    >
                      Anulează
                    </Button>
                    <Button onClick={handleCreateNewChild}>
                      Adaugă Copil
                    </Button>
                  </div>
                </div>
              )}

              {selectedChild && !multiCheckInMode && (
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">{selectedChild.fullName}</h3>
                    <div className="flex items-center gap-2">
                      <AgeGroupBadge ageGroup={selectedChild.ageGroup} />
                      <CategoryBadge category={selectedChild.category} />
                      {selectedChild.isNew && <NewChildBadge />}
                      <SiblingBadge 
                        count={selectedChild.siblingIds?.length || 0} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Participare la Program</Label>
                    <RadioGroup
                      value={childrenToCheckIn[0]?.program || "P1"}
                      onValueChange={(value) => 
                        updateChildCheckInState(selectedChild.id, 'program', value as "P1" | "P2" | "Both")
                      }
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

                  <div className="space-y-2">
                    <h4 className="font-medium">Verificare medicală</h4>
                    <div className="flex items-start space-x-2 p-4 rounded-md border border-gray-200 bg-gray-50">
                      <Checkbox
                        id="medicalCheckComplete"
                        checked={childrenToCheckIn[0]?.medicalCheckComplete || false}
                        onCheckedChange={(checked) => 
                          updateChildCheckInState(selectedChild.id, 'medicalCheckComplete', checked === true)
                        }
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="medicalCheckComplete" className="font-medium">
                          Confirmă verificarea medicală completă
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Confirm că am verificat temperatura, copilul nu prezintă simptome (tuse/febră) 
                          și este într-o stare generală bună.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <LiveTagPreview 
                      childId={selectedChild.id} 
                      program={childrenToCheckIn[0]?.program || "P1"} 
                    />
                  </div>
                </div>
              )}
              
              {multiCheckInMode && childrenToCheckIn.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" /> Check-in frați/surori
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Select/deselect all siblings
                        const allSelected = childrenToCheckIn.every(c => c.selected);
                        setChildrenToCheckIn(prev => 
                          prev.map(child => ({ ...child, selected: !allSelected }))
                        );
                      }}
                    >
                      {childrenToCheckIn.every(c => c.selected) 
                        ? "Deselectează toți" 
                        : "Selectează toți"}
                    </Button>
                  </div>
                  
                  {childrenToCheckIn.map((child, index) => 
                    renderChildCheckInItem(child.childId, index)
                  )}
                </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Statistici Prezență</CardTitle>
              <CardDescription>
                {format(new Date(currentSunday), "dd MMMM yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total copii</p>
                  <p className="text-3xl font-bold">{todayStats.total}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm">
                    <span className="font-medium">P1:</span> {todayStats.totalP1}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">P2:</span> {todayStats.totalP2}
                  </div>
                </div>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <BadgePlus className="h-4 w-4" /> Copii Noi
                    </p>
                    <p className="text-2xl font-bold">{todayStats.newChildren}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Prima prezență
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Pe grupe de vârstă</h4>
                <div className="space-y-2">
                  {todaySummary && Object.entries(todaySummary.byAgeGroup).map(([group, data]) => (
                    <div key={group} className="flex items-center justify-between">
                      <AgeGroupBadge ageGroup={group as AgeGroup} />
                      <div className="text-sm font-medium">{data.total}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Membri vs Guests
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">Membri</p>
                    <p className="text-xl font-bold text-blue-800">
                      {todaySummary?.byCategory.Membru || 0}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-md">
                    <p className="text-sm text-orange-800">Guests</p>
                    <p className="text-xl font-bold text-orange-800">
                      {todaySummary?.byCategory.Guest || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <UpcomingSundayBirthdays children={children} weekCount={4} />
        </div>
      </div>

      <Dialog open={tagOpen} onOpenChange={setTagOpen}>
        <DialogContent className={`${generatedTags && generatedTags.length > 1 ? 'sm:max-w-xl' : 'sm:max-w-md'}`}>
          <DialogHeader>
            <DialogTitle>
              {generatedTags && generatedTags.length > 1 
                ? "Etichete Generate" 
                : "Etichetă Generată"}
            </DialogTitle>
            <DialogDescription>
              {generatedTags && generatedTags.length > 1 
                ? `${generatedTags.length} etichete pentru copii selectați` 
                : `Etichete pentru ${generatedTags?.[0]?.childName}`}
            </DialogDescription>
          </DialogHeader>
          
          {generatedTags && (
            <div className={`${generatedTags.length > 1 ? 'grid grid-cols-2 gap-4 max-h-96 overflow-y-auto' : ''}`}>
              {generatedTags.map((tag, index) => (
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
            <Button variant="secondary" onClick={() => setTagOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handlePrintTags}>
              <Printer className="mr-2 h-4 w-4" />
              Printează {tagCount * (generatedTags?.length || 1)} etichete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckIn;

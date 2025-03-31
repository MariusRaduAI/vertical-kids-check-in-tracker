
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
import { Child, AgeGroup } from "@/types/models";
import { Search, AlertTriangle, Tag, Printer } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CheckIn: React.FC = () => {
  const {
    searchChildren,
    addChild,
    checkInChild,
    currentSunday,
    getTotalPresentToday,
    getAttendanceSummaryForDate,
  } = useApp();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isNewChild, setIsNewChild] = useState(false);
  const [program, setProgram] = useState<"P1" | "P2">("P1");
  
  const [newChildData, setNewChildData] = useState({
    firstName: "",
    lastName: "",
    ageGroup: "4-6" as AgeGroup,
  });
  
  const [medicalCheck, setMedicalCheck] = useState({
    temperature: false,
    noSymptoms: false,
    goodCondition: false,
  });

  const [tagOpen, setTagOpen] = useState(false);
  const [tagCount, setTagCount] = useState(3);
  const [generatedTag, setGeneratedTag] = useState<{
    childName: string;
    uniqueCode: string;
    ageGroup: AgeGroup;
    program: "P1" | "P2";
    date: string;
  } | null>(null);

  // Get today's attendance stats
  const todayStats = getTotalPresentToday();
  const todaySummary = getAttendanceSummaryForDate(currentSunday);

  // Handle search input change
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchChildren(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchChildren]);

  // Handle selecting a child from search results
  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    setSearchQuery(child.fullName);
    setSearchResults([]);
    setIsNewChild(false);
  };

  // Handle marking as new child
  const handleNewChildClick = () => {
    setIsNewChild(true);
    setSelectedChild(null);
    
    // Pre-fill first/last name from search if possible
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

  // Handle creating a new child
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
    birthDate.setFullYear(birthDate.getFullYear() - 5); // Default age of 5 years
    
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
    });

    setSelectedChild(newChild);
    setSearchQuery(fullName);
    setIsNewChild(false);
  };

  // Handle check-in
  const handleCheckIn = () => {
    if (!selectedChild) return;

    // Check if all medical checks are checked
    if (!medicalCheck.temperature || !medicalCheck.noSymptoms || !medicalCheck.goodCondition) {
      toast({
        title: "Verificare medicală necesară",
        description: "Toate verificările medicale trebuie să fie confirmate înainte de a genera eticheta.",
        variant: "destructive",
      });
      return;
    }

    const attendanceRecord = checkInChild(
      selectedChild.id,
      program,
      medicalCheck
    );

    if (attendanceRecord) {
      setGeneratedTag({
        childName: selectedChild.fullName,
        uniqueCode: attendanceRecord.uniqueCode || "",
        ageGroup: selectedChild.ageGroup,
        program,
        date: format(new Date(currentSunday), "dd.MM.yyyy"),
      });
      setTagOpen(true);
    }
  };

  // Handle printing tags
  const handlePrintTags = () => {
    toast({
      title: "Etichete trimise la imprimantă",
      description: `${tagCount} etichete pentru ${selectedChild?.fullName} au fost trimise la imprimantă.`,
    });
    setTagOpen(false);
    
    // Reset form for next check-in
    setSelectedChild(null);
    setSearchQuery("");
    setMedicalCheck({
      temperature: false,
      noSymptoms: false,
      goodCondition: false,
    });
  };

  // Reset everything
  const handleReset = () => {
    setSelectedChild(null);
    setSearchQuery("");
    setIsNewChild(false);
    setMedicalCheck({
      temperature: false,
      noSymptoms: false,
      goodCondition: false,
    });
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

                {searchResults.length > 0 && !selectedChild && !isNewChild && (
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
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchQuery && !selectedChild && searchResults.length === 0 && !isNewChild && (
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

              {selectedChild && (
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">{selectedChild.fullName}</h3>
                    <div className="flex items-center gap-2">
                      <AgeGroupBadge ageGroup={selectedChild.ageGroup} />
                      <CategoryBadge category={selectedChild.category} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={program}
                      onValueChange={(value) => setProgram(value as "P1" | "P2")}
                    >
                      <SelectTrigger id="program">
                        <SelectValue placeholder="Selectează programul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P1">Program 1</SelectItem>
                        <SelectItem value="P2">Program 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Verificare medicală</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="temperature"
                          checked={medicalCheck.temperature}
                          onCheckedChange={(checked) =>
                            setMedicalCheck({
                              ...medicalCheck,
                              temperature: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="temperature">Verificat temperatură</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="noSymptoms"
                          checked={medicalCheck.noSymptoms}
                          onCheckedChange={(checked) =>
                            setMedicalCheck({
                              ...medicalCheck,
                              noSymptoms: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="noSymptoms">
                          Nu are tuse/febră sau alte simptome care se transmit
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="goodCondition"
                          checked={medicalCheck.goodCondition}
                          onCheckedChange={(checked) =>
                            setMedicalCheck({
                              ...medicalCheck,
                              goodCondition: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="goodCondition">Stare generală bună</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Resetează
              </Button>
              <Button
                onClick={handleCheckIn}
                disabled={
                  !selectedChild ||
                  !medicalCheck.temperature ||
                  !medicalCheck.noSymptoms ||
                  !medicalCheck.goodCondition
                }
              >
                <Tag className="mr-2 h-4 w-4" />
                Generează Etichetă
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
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
        </div>
      </div>

      {/* Tag Generation Dialog */}
      <Dialog open={tagOpen} onOpenChange={setTagOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Etichetă Generată</DialogTitle>
            <DialogDescription>
              Etichetă pentru {generatedTag?.childName}
            </DialogDescription>
          </DialogHeader>
          
          {generatedTag && (
            <div className="border rounded-lg p-6 my-4 space-y-4 bg-white">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{generatedTag.childName}</h3>
                <div className="text-xl font-mono tracking-wider">
                  {generatedTag.uniqueCode}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <AgeGroupBadge ageGroup={generatedTag.ageGroup} className="text-sm" />
                <div className="px-2 py-1 bg-primary text-white rounded-full text-sm">
                  {generatedTag.program}
                </div>
              </div>
              
              <div className="text-center text-sm">
                {generatedTag.date}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="tagCount">Număr de etichete:</Label>
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
              Printează {tagCount} etichete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckIn;

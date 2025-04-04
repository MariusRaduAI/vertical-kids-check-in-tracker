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
import { Child, AgeGroup } from "@/types/models";
import { Search, AlertTriangle, Tag, Printer, BadgePlus } from "lucide-react";
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

const CheckIn: React.FC = () => {
  const {
    searchChildren,
    addChild,
    checkInChild,
    currentSunday,
    getTotalPresentToday,
    getAttendanceSummaryForDate,
    children,
  } = useApp();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isNewChild, setIsNewChild] = useState(false);
  
  const [programSelection, setProgramSelection] = useState<"P1" | "P2" | "Both">("P1");
  
  const [newChildData, setNewChildData] = useState({
    firstName: "",
    lastName: "",
    ageGroup: "4-6" as AgeGroup,
  });
  
  const [medicalCheckComplete, setMedicalCheckComplete] = useState(false);

  const [tagOpen, setTagOpen] = useState(false);
  const [tagCount, setTagCount] = useState(3);
  
  const [generatedTags, setGeneratedTags] = useState<Array<{
    childName: string;
    uniqueCode: string;
    ageGroup: AgeGroup;
    program: "P1" | "P2";
    date: string;
  }> | null>(null);

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
    setSelectedChild(child);
    setSearchQuery(child.fullName);
    setSearchResults([]);
    setIsNewChild(false);
  };

  const handleNewChildClick = () => {
    setIsNewChild(true);
    setSelectedChild(null);
    
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
    });

    setSelectedChild(newChild);
    setSearchQuery(fullName);
    setIsNewChild(false);
  };

  const handleCheckIn = () => {
    if (!selectedChild) return;

    if (!medicalCheckComplete) {
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

    if (programSelection === "Both") {
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
      const program = programSelection as "P1" | "P2";
      const attendance = checkInChild(
        selectedChild.id,
        program,
        medicalCheckData
      );

      if (attendance) {
        const tag = {
          childName: selectedChild.fullName,
          uniqueCode: attendance.uniqueCode || "",
          ageGroup: selectedChild.ageGroup,
          program,
          date: format(new Date(currentSunday), "dd.MM.yyyy"),
        };
        
        setGeneratedTags([tag]);
        setTagOpen(true);
      }
    }
  };

  const handlePrintTags = () => {
    const programInfo = programSelection === "Both" ? "ambele programe" : 
                        programSelection === "P1" ? "programul 1" : "programul 2";
    
    toast({
      title: "Etichete trimise la imprimantă",
      description: `${tagCount * generatedTags!.length} etichete pentru ${selectedChild?.fullName} (${programInfo}) au fost trimise la imprimantă.`,
    });
    setTagOpen(false);
    
    setSelectedChild(null);
    setSearchQuery("");
    setMedicalCheckComplete(false);
  };

  const handleReset = () => {
    setSelectedChild(null);
    setSearchQuery("");
    setIsNewChild(false);
    setMedicalCheckComplete(false);
    setProgramSelection("P1");
  };

  const LiveTagPreview = () => {
    if (!selectedChild) return null;
    
    const previewTag = {
      childName: selectedChild.fullName,
      uniqueCode: `${selectedChild.firstName.charAt(0)}${selectedChild.lastName.charAt(0)}--${programSelection === "Both" ? "P1+P2" : programSelection}`,
      ageGroup: selectedChild.ageGroup,
      program: programSelection as "P1" | "P2" | "Both",
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

  const TagPreview = ({ tag }: { tag: any }) => {
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
                              {child.isNew && <NewChildBadge />}
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
                      {selectedChild.isNew && <NewChildBadge />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Participare la Program</Label>
                    <RadioGroup
                      value={programSelection}
                      onValueChange={(value) => setProgramSelection(value as "P1" | "P2" | "Both")}
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
                        checked={medicalCheckComplete}
                        onCheckedChange={(checked) => setMedicalCheckComplete(checked === true)}
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
                    <LiveTagPreview />
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
                disabled={!selectedChild || !medicalCheckComplete}
              >
                <Tag className="mr-2 h-4 w-4" />
                Generează Etichetă
              </Button>
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
            <DialogTitle>Etichetă Generată</DialogTitle>
            <DialogDescription>
              Etichete pentru {selectedChild?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          {generatedTags && (
            <div className={`${generatedTags.length > 1 ? 'grid grid-cols-2 gap-4' : ''}`}>
              {generatedTags.map((tag, index) => (
                <TagPreview key={index} tag={tag} />
              ))}
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
              Printează {tagCount * (generatedTags?.length || 1)} etichete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckIn;

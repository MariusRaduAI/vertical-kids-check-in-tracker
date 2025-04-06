
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Child, ProgramType } from "@/types/models";
import { TagPreviewType, NewChildFormData, MedicalCheckData } from "@/types/checkin";

export const useCheckIn = () => {
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
  
  const [programSelection, setProgramSelection] = useState<ProgramType>("P1");
  
  const [newChildData, setNewChildData] = useState<NewChildFormData>({
    firstName: "",
    lastName: "",
    ageGroup: "4-6",
  });
  
  const [medicalCheckComplete, setMedicalCheckComplete] = useState(false);

  const [tagOpen, setTagOpen] = useState(false);
  const [tagCount, setTagCount] = useState(3);
  
  const [generatedTags, setGeneratedTags] = useState<TagPreviewType[] | null>(null);

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

    const medicalCheckData: MedicalCheckData = {
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
        const combinedTag: TagPreviewType = {
          childName: selectedChild.fullName,
          uniqueCode: `${attendanceP1.uniqueCode?.split('--')[0]}--P1+P2`,
          ageGroup: selectedChild.ageGroup,
          program: "Both",
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
        const tag: TagPreviewType = {
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

  const handleUpdateNewChildData = (data: Partial<NewChildFormData>) => {
    setNewChildData(prev => ({ ...prev, ...data }));
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedChild,
    isNewChild,
    programSelection,
    setProgramSelection,
    newChildData,
    medicalCheckComplete,
    setMedicalCheckComplete,
    tagOpen,
    setTagOpen,
    tagCount,
    setTagCount,
    generatedTags,
    todayStats,
    todaySummary,
    currentSunday,
    children,
    handleSelectChild,
    handleNewChildClick,
    handleCreateNewChild,
    handleCheckIn,
    handlePrintTags,
    handleReset,
    handleUpdateNewChildData
  };
};

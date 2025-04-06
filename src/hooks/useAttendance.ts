
import { useState, useEffect } from "react";
import { Attendance, AttendanceSummary, Child } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { MedicalCheckData } from "@/types/checkin";
import { generateUniqueCode } from "@/data/mockData";

export const useAttendance = (
  initialAttendance: Attendance[],
  initialSummaries: Record<string, AttendanceSummary>,
  currentSunday: string,
  getChildById: (id: string) => Child | undefined,
  updateChild: (id: string, data: Partial<Child>) => Child
) => {
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [summaries, setSummaries] = useState<Record<string, AttendanceSummary>>(initialSummaries);
  
  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('scoala-duminicala-attendance', JSON.stringify(attendance));
  }, [attendance]);
  
  useEffect(() => {
    localStorage.setItem('scoala-duminicala-summaries', JSON.stringify(summaries));
  }, [summaries]);

  const checkInChild = (
    childId: string,
    program: "P1" | "P2",
    medicalCheck: MedicalCheckData
  ) => {
    const child = getChildById(childId);
    if (!child) {
      toast({
        title: "Eroare",
        description: "Copilul nu a fost găsit.",
        variant: "destructive",
      });
      return null;
    }
    
    if (!medicalCheck.temperature || !medicalCheck.noSymptoms || !medicalCheck.goodCondition) {
      toast({
        title: "Verificare medicală eșuată",
        description: "Toate verificările medicale trebuie să fie confirmate.",
        variant: "destructive",
      });
      return null;
    }
    
    // Get today's attendance records for this program to determine the order
    const todaysAttendance = attendance.filter(
      (a) => a.date === currentSunday && a.program === program && a.status === 'P'
    );
    
    // Check if this is the child's first attendance ever
    const childPastAttendance = attendance.filter(
      (a) => a.childId === childId && a.status === 'P'
    );
    
    const isFirstAttendance = childPastAttendance.length === 0;
    
    // If it's the first attendance, update the child's record
    if (isFirstAttendance) {
      updateChild(childId, { 
        isNew: true, 
        firstAttendanceDate: currentSunday 
      });
    }
    
    const order = todaysAttendance.length + 1;
    const uniqueCode = generateUniqueCode(child, program, order);
    
    const now = new Date().toISOString();
    const newAttendance: Attendance = {
      id: `att-${currentSunday}-${childId}-${program}-${Date.now()}`, // Added timestamp for uniqueness
      childId,
      childName: child.fullName,
      ageGroup: child.ageGroup,
      category: child.category,
      date: currentSunday,
      program,
      status: "P",
      uniqueCode,
      checkedBy: "Current User", // Would be replaced with actual user in a real app
      medicalCheck,
      checkedInAt: now,
      isFirstAttendance
    };
    
    setAttendance((prev) => {
      // Remove any existing attendance record for this child, date and program
      const filtered = prev.filter(
        (a) => !(a.childId === childId && a.date === currentSunday && a.program === program)
      );
      return [...filtered, newAttendance];
    });
    
    // Update summaries
    updateSummaryAfterCheckIn(child, program, isFirstAttendance);
    
    toast({
      title: "Check-in reușit",
      description: `${child.fullName} a fost înregistrat pentru programul ${program} cu codul ${uniqueCode}.`,
    });
    
    return newAttendance;
  };
  
  const updateSummaryAfterCheckIn = (child: Child, program: "P1" | "P2", isFirstAttendance: boolean) => {
    setSummaries((prev) => {
      const currentSummary = prev[currentSunday] || {
        date: currentSunday,
        totalP1: 0,
        totalP2: 0,
        total: 0,
        newChildrenCount: 0,
        byAgeGroup: {
          "0-1": { P1: 0, P2: 0, total: 0 },
          "1-2": { P1: 0, P2: 0, total: 0 },
          "2-3": { P1: 0, P2: 0, total: 0 },
          "4-6": { P1: 0, P2: 0, total: 0 },
          "7-12": { P1: 0, P2: 0, total: 0 },
        },
        byCategory: {
          Membru: 0,
          Guest: 0,
        },
      };
      
      // Create updated summary
      const newSummary = { ...currentSummary };
      
      if (program === "P1") {
        newSummary.totalP1 += 1;
        newSummary.byAgeGroup[child.ageGroup].P1 += 1;
      } else {
        newSummary.totalP2 += 1;
        newSummary.byAgeGroup[child.ageGroup].P2 += 1;
      }
      
      newSummary.total = newSummary.totalP1 + newSummary.totalP2;
      newSummary.byAgeGroup[child.ageGroup].total = 
        newSummary.byAgeGroup[child.ageGroup].P1 + 
        newSummary.byAgeGroup[child.ageGroup].P2;
        
      if (child.category === "Membru") {
        newSummary.byCategory.Membru += 1;
      } else {
        newSummary.byCategory.Guest += 1;
      }
      
      // Increment new children count if it's the first attendance
      if (isFirstAttendance) {
        newSummary.newChildrenCount = (newSummary.newChildrenCount || 0) + 1;
      }
      
      return {
        ...prev,
        [currentSunday]: newSummary,
      };
    });
  };

  const getAttendanceForDate = (date: string) => {
    return attendance.filter((a) => a.date === date);
  };
  
  const getAttendanceForChild = (childId: string) => {
    return attendance.filter((a) => a.childId === childId);
  };
  
  const getAttendanceSummaryForDate = (date: string) => {
    return summaries[date];
  };
  
  const getTotalPresentToday = () => {
    const todaySummary = summaries[currentSunday];
    if (!todaySummary) {
      return { totalP1: 0, totalP2: 0, total: 0, newChildren: 0 };
    }
    return {
      totalP1: todaySummary.totalP1,
      totalP2: todaySummary.totalP2,
      total: todaySummary.total,
      newChildren: todaySummary.newChildrenCount || 0
    };
  };
  
  const getNewChildren = (date?: string) => {
    const targetDate = date || currentSunday;
    return [] as Child[]; // This will be implemented by the AppContext
  };

  // Get the list of Sundays for which we have attendance data
  const sundays = Object.keys(summaries).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return {
    attendance,
    summaries,
    sundays,
    checkInChild,
    getAttendanceForDate,
    getAttendanceForChild,
    getAttendanceSummaryForDate,
    getTotalPresentToday,
    getNewChildren
  };
};

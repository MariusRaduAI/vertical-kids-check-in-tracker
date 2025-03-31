
import React, { createContext, useContext, useState, useEffect } from "react";
import { Child, Attendance, AttendanceSummary } from "../types/models";
import { 
  children as mockChildren, 
  attendanceRecords as mockAttendance,
  attendanceSummaries as mockSummaries,
  getCurrentSunday,
  generateUniqueCode
} from "../data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  children: Child[];
  attendance: Attendance[];
  summaries: Record<string, AttendanceSummary>;
  currentSunday: string;
  
  // Child operations
  addChild: (child: Omit<Child, "id" | "createdAt" | "updatedAt">) => Child;
  updateChild: (id: string, data: Partial<Child>) => Child;
  getChildById: (id: string) => Child | undefined;
  searchChildren: (query: string) => Child[];
  
  // Attendance operations
  checkInChild: (
    childId: string,
    program: "P1" | "P2",
    medicalCheck: { temperature: boolean; noSymptoms: boolean; goodCondition: boolean }
  ) => Attendance | null;
  getAttendanceForDate: (date: string) => Attendance[];
  getAttendanceForChild: (childId: string) => Attendance[];
  getAttendanceSummaryForDate: (date: string) => AttendanceSummary | undefined;
  
  // Statistics
  getTotalPresentToday: () => { totalP1: number; totalP2: number; total: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [summaries, setSummaries] = useState<Record<string, AttendanceSummary>>(mockSummaries);
  const [currentSunday, setCurrentSunday] = useState<string>(getCurrentSunday());
  const { toast } = useToast();

  // Child operations
  const addChild = (childData: Omit<Child, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newChild: Child = {
      ...childData,
      id: `child-${children.length + 1}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setChildren((prev) => [...prev, newChild]);
    toast({
      title: "Copil adăugat",
      description: `${newChild.fullName} a fost adăugat cu succes.`,
    });
    
    return newChild;
  };
  
  const updateChild = (id: string, data: Partial<Child>) => {
    const childIndex = children.findIndex((c) => c.id === id);
    if (childIndex === -1) {
      throw new Error(`Copilul cu ID-ul ${id} nu a fost găsit.`);
    }
    
    const updatedChild = {
      ...children[childIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    const newChildren = [...children];
    newChildren[childIndex] = updatedChild;
    setChildren(newChildren);
    
    toast({
      title: "Copil actualizat",
      description: `${updatedChild.fullName} a fost actualizat cu succes.`,
    });
    
    return updatedChild;
  };
  
  const getChildById = (id: string) => {
    return children.find((c) => c.id === id);
  };
  
  const searchChildren = (query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return children.filter(
      (child) =>
        child.fullName.toLowerCase().includes(lowerQuery) ||
        child.firstName.toLowerCase().includes(lowerQuery) ||
        child.lastName.toLowerCase().includes(lowerQuery)
    );
  };
  
  // Attendance operations
  const checkInChild = (
    childId: string,
    program: "P1" | "P2",
    medicalCheck: { temperature: boolean; noSymptoms: boolean; goodCondition: boolean }
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
    
    const order = todaysAttendance.length + 1;
    const uniqueCode = generateUniqueCode(child, program, order);
    
    const now = new Date().toISOString();
    const newAttendance: Attendance = {
      id: `att-${currentSunday}-${childId}-${program}`,
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
    };
    
    setAttendance((prev) => {
      // Remove any existing attendance record for this child, date and program
      const filtered = prev.filter(
        (a) => !(a.childId === childId && a.date === currentSunday && a.program === program)
      );
      return [...filtered, newAttendance];
    });
    
    // Update summaries
    updateSummaryAfterCheckIn(child, program);
    
    toast({
      title: "Check-in reușit",
      description: `${child.fullName} a fost înregistrat pentru programul ${program} cu codul ${uniqueCode}.`,
    });
    
    return newAttendance;
  };
  
  const updateSummaryAfterCheckIn = (child: Child, program: "P1" | "P2") => {
    setSummaries((prev) => {
      const currentSummary = prev[currentSunday] || {
        date: currentSunday,
        totalP1: 0,
        totalP2: 0,
        total: 0,
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
      return { totalP1: 0, totalP2: 0, total: 0 };
    }
    return {
      totalP1: todaySummary.totalP1,
      totalP2: todaySummary.totalP2,
      total: todaySummary.total,
    };
  };
  
  const value = {
    children,
    attendance,
    summaries,
    currentSunday,
    
    // Child operations
    addChild,
    updateChild,
    getChildById,
    searchChildren,
    
    // Attendance operations
    checkInChild,
    getAttendanceForDate,
    getAttendanceForChild,
    getAttendanceSummaryForDate,
    
    // Statistics
    getTotalPresentToday,
  };
  
  return <AppContext.Provider value={value}>{reactChildren}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

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
  
  // Siblings operations
  getSiblings: (childId: string) => Child[];
  addSibling: (childId: string, siblingId: string) => void;
  removeSibling: (childId: string, siblingId: string) => void;
  
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
  getTotalPresentToday: () => { totalP1: number; totalP2: number; total: number; newChildren: number };
  getNewChildren: (date?: string) => Child[];
  
  // Added for the attendance page
  sundays: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys for localStorage
const STORAGE_KEYS = {
  CHILDREN: 'scoala-duminicala-children',
  ATTENDANCE: 'scoala-duminicala-attendance',
  SUMMARIES: 'scoala-duminicala-summaries',
  CURRENT_SUNDAY: 'scoala-duminicala-current-sunday'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  // Initialize state with data from localStorage or fallback to mock data
  const [children, setChildren] = useState<Child[]>(() => {
    const storedChildren = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    return storedChildren ? JSON.parse(storedChildren) : mockChildren;
  });
  
  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const storedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return storedAttendance ? JSON.parse(storedAttendance) : mockAttendance;
  });
  
  const [summaries, setSummaries] = useState<Record<string, AttendanceSummary>>(() => {
    const storedSummaries = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
    return storedSummaries ? JSON.parse(storedSummaries) : mockSummaries;
  });
  
  const [currentSunday, setCurrentSunday] = useState<string>(() => {
    const storedSunday = localStorage.getItem(STORAGE_KEYS.CURRENT_SUNDAY);
    return storedSunday || getCurrentSunday();
  });
  
  const { toast } = useToast();
  
  // Create a list of Sundays for the attendance page
  const sundays = Object.keys(summaries).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
  }, [children]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
  }, [summaries]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SUNDAY, currentSunday);
  }, [currentSunday]);

  // Child operations
  const addChild = (childData: Omit<Child, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newChild: Child = {
      ...childData,
      id: `child-${Date.now()}`, // Using timestamp for more unique IDs
      createdAt: now,
      updatedAt: now,
      siblingIds: childData.siblingIds || [],
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
  
  // Sibling operations
  const getSiblings = (childId: string) => {
    const child = getChildById(childId);
    if (!child || !child.siblingIds || child.siblingIds.length === 0) {
      return [];
    }
    
    return children.filter(c => child.siblingIds?.includes(c.id));
  };
  
  const addSibling = (childId: string, siblingId: string) => {
    if (childId === siblingId) return;
    
    const child = getChildById(childId);
    const sibling = getChildById(siblingId);
    
    if (!child || !sibling) return;
    
    // Update the child's siblings
    const childSiblingIds = [...(child.siblingIds || [])];
    if (!childSiblingIds.includes(siblingId)) {
      childSiblingIds.push(siblingId);
      updateChild(childId, { siblingIds: childSiblingIds });
    }
    
    // Update the sibling's siblings
    const siblingIds = [...(sibling.siblingIds || [])];
    if (!siblingIds.includes(childId)) {
      siblingIds.push(childId);
      updateChild(siblingId, { siblingIds });
    }
  };
  
  const removeSibling = (childId: string, siblingId: string) => {
    const child = getChildById(childId);
    const sibling = getChildById(siblingId);
    
    if (!child || !sibling) return;
    
    // Remove sibling from child
    if (child.siblingIds) {
      const updatedSiblingIds = child.siblingIds.filter(id => id !== siblingId);
      updateChild(childId, { siblingIds: updatedSiblingIds });
    }
    
    // Remove child from sibling
    if (sibling.siblingIds) {
      const updatedSiblingIds = sibling.siblingIds.filter(id => id !== childId);
      updateChild(siblingId, { siblingIds: updatedSiblingIds });
    }
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
    return children.filter(child => 
      child.isNew && child.firstAttendanceDate === targetDate
    );
  };
  
  const value = {
    children,
    attendance,
    summaries,
    currentSunday,
    sundays,
    
    // Child operations
    addChild,
    updateChild,
    getChildById,
    searchChildren,
    
    // Sibling operations
    getSiblings,
    addSibling,
    removeSibling,
    
    // Attendance operations
    checkInChild,
    getAttendanceForDate,
    getAttendanceForChild,
    getAttendanceSummaryForDate,
    
    // Statistics
    getTotalPresentToday,
    getNewChildren,
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

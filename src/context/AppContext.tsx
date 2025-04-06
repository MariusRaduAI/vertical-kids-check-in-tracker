
import React, { createContext, useContext, useState, useEffect } from "react";
import { Child } from "../types/models";
import { 
  children as mockChildren, 
  attendanceRecords as mockAttendance,
  attendanceSummaries as mockSummaries,
  getCurrentSunday,
} from "../data/mockData";
import { useChildren } from "@/hooks/useChildren";
import { useAttendance } from "@/hooks/useAttendance";

interface AppContextType {
  children: Child[];
  attendance: any[];
  summaries: Record<string, any>;
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
  ) => any | null;
  getAttendanceForDate: (date: string) => any[];
  getAttendanceForChild: (childId: string) => any[];
  getAttendanceSummaryForDate: (date: string) => any | undefined;
  
  // Statistics
  getTotalPresentToday: () => { totalP1: number; totalP2: number; total: number; newChildren: number };
  getNewChildren: (date?: string) => Child[];
  
  // Added for the attendance page
  sundays: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys for localStorage
const STORAGE_KEYS = {
  CURRENT_SUNDAY: 'scoala-duminicala-current-sunday'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  // Initialize currentSunday from localStorage or fallback to current Sunday
  const [currentSunday, setCurrentSunday] = useState<string>(() => {
    const storedSunday = localStorage.getItem(STORAGE_KEYS.CURRENT_SUNDAY);
    return storedSunday || getCurrentSunday();
  });
  
  // Initialize children state with data from localStorage or mock data
  const initialChildren = (() => {
    const storedChildren = localStorage.getItem('scoala-duminicala-children');
    return storedChildren ? JSON.parse(storedChildren) : mockChildren;
  })();
  
  // Initialize attendance state
  const initialAttendance = (() => {
    const storedAttendance = localStorage.getItem('scoala-duminicala-attendance');
    return storedAttendance ? JSON.parse(storedAttendance) : mockAttendance;
  })();
  
  // Initialize summaries state
  const initialSummaries = (() => {
    const storedSummaries = localStorage.getItem('scoala-duminicala-summaries');
    return storedSummaries ? JSON.parse(storedSummaries) : mockSummaries;
  })();
  
  // Save currentSunday to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SUNDAY, currentSunday);
  }, [currentSunday]);

  // Use our custom hooks
  const childrenHook = useChildren(initialChildren);
  const attendanceHook = useAttendance(
    initialAttendance,
    initialSummaries,
    currentSunday,
    childrenHook.getChildById,
    childrenHook.updateChild
  );

  // Implement getNewChildren which needs both children and attendance data
  const getNewChildren = (date?: string) => {
    const targetDate = date || currentSunday;
    return childrenHook.children.filter(child => 
      child.isNew && child.firstAttendanceDate === targetDate
    );
  };
  
  const value = {
    // Combine all the state and functions from our hooks
    ...childrenHook,
    ...attendanceHook,
    currentSunday,
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

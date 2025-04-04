
import React, { createContext, useContext, useEffect } from "react";
import { AppContextType, STORAGE_KEYS } from "./types";
import { useChildOperations } from "./hooks/useChildOperations";
import { useSiblingOperations } from "./hooks/useSiblingOperations";
import { useAttendanceOperations } from "./hooks/useAttendanceOperations";
import { useCurrentSunday } from "./hooks/useCurrentSunday";
import { children as mockChildren, attendanceRecords as mockAttendance, attendanceSummaries as mockSummaries } from "../data/mockData";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  // Initialize hooks
  const { 
    currentSunday, 
    setCurrentSunday 
  } = useCurrentSunday();
  
  const {
    children,
    setChildren,
    addChild,
    updateChild,
    getChildById,
    searchChildren,
    getNewChildren
  } = useChildOperations();
  
  // Load mock data if children array is empty
  useEffect(() => {
    if (children.length === 0) {
      setChildren(mockChildren);
    }
  }, []);

  const {
    getSiblings,
    addSibling,
    removeSibling
  } = useSiblingOperations(getChildById, updateChild, children);
  
  const {
    attendance,
    setAttendance,
    summaries,
    setSummaries,
    checkInChild,
    getAttendanceForDate,
    getAttendanceForChild,
    getAttendanceSummaryForDate,
    getTotalPresentToday,
    sundays
  } = useAttendanceOperations(getChildById, updateChild, currentSunday);
  
  // Load mock data if attendance array is empty
  useEffect(() => {
    if (attendance.length === 0) {
      setAttendance(mockAttendance);
    }
  }, []);
  
  // Load mock data if summaries object is empty
  useEffect(() => {
    if (Object.keys(summaries).length === 0) {
      setSummaries(mockSummaries);
    }
  }, []);
  
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
  
  const value: AppContextType = {
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

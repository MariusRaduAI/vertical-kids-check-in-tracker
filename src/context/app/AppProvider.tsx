
import React, { useState, useEffect } from "react";
import AppContext from "./AppContext";
import { STORAGE_KEYS } from "./AppContextTypes";
import { getCurrentSunday } from "../../data/mockData";
import { useSupabaseChildren } from "../../integrations/supabase/hooks/useSupabaseChildren";
import { useSupabaseAttendance } from "../../integrations/supabase/hooks/useSupabaseAttendance";
import { generateUniqueCode } from "../../data/mockData";
import { MedicalCheckData } from "../../types/checkin";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  const [currentSunday, setCurrentSunday] = useState<string>(() => {
    const storedSunday = localStorage.getItem(STORAGE_KEYS.CURRENT_SUNDAY);
    return storedSunday || getCurrentSunday();
  });
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SUNDAY, currentSunday);
  }, [currentSunday]);

  const childrenHook = useSupabaseChildren();
  const attendanceHook = useSupabaseAttendance(currentSunday);

  const checkInChild = (
    childId: string,
    program: "P1" | "P2",
    medicalCheck: MedicalCheckData
  ) => {
    const child = childrenHook.getChildById(childId);
    if (!child) {
      return null;
    }
    
    if (!medicalCheck.temperature || !medicalCheck.noSymptoms || !medicalCheck.goodCondition) {
      return null;
    }
    
    const childPastAttendance = attendanceHook.getAttendanceForChild(childId);
    const isFirstAttendance = childPastAttendance.length === 0;
    
    if (isFirstAttendance) {
      childrenHook.updateChild(childId, { 
        isNew: true, 
        firstAttendanceDate: currentSunday 
      });
    }
    
    const todaysAttendance = attendanceHook.getAttendanceForDate(currentSunday).filter(
      (a) => a.program === program && a.status === 'P'
    );
    
    const order = todaysAttendance.length + 1;
    const uniqueCode = generateUniqueCode(child, program, order);
    
    attendanceHook.checkInChild({
      child,
      program,
      medicalCheck,
      isFirstAttendance,
      uniqueCode
    });
    
    // Update summary
    const currentSummary = attendanceHook.getAttendanceSummaryForDate(currentSunday) || {
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
    
    if (isFirstAttendance) {
      newSummary.newChildrenCount = (newSummary.newChildrenCount || 0) + 1;
    }
    
    attendanceHook.updateSummary(newSummary);
    
    return {
      id: `temp-${Date.now()}`,
      childId,
      childName: child.fullName,
      ageGroup: child.ageGroup,
      category: child.category,
      date: currentSunday,
      program,
      status: "P" as const,
      uniqueCode,
      checkedBy: "Current User",
      medicalCheck,
      checkedInAt: new Date().toISOString(),
      isFirstAttendance
    };
  };

  const getNewChildren = (date?: string) => {
    const targetDate = date || currentSunday;
    return childrenHook.children.filter(child => 
      child.isNew && child.firstAttendanceDate === targetDate
    );
  };
  
  const value = {
    ...childrenHook,
    ...attendanceHook,
    currentSunday,
    checkInChild,
    getNewChildren,
  };
  
  return <AppContext.Provider value={value}>{reactChildren}</AppContext.Provider>;
};

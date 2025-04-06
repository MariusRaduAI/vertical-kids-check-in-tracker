
import { Child } from "../../types/models";

export interface AppContextType {
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

export const STORAGE_KEYS = {
  CURRENT_SUNDAY: 'scoala-duminicala-current-sunday'
};


import { Child, Attendance, AttendanceSummary } from "../types/models";

export interface AppContextType {
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

export const STORAGE_KEYS = {
  CHILDREN: 'scoala-duminicala-children',
  ATTENDANCE: 'scoala-duminicala-attendance',
  SUMMARIES: 'scoala-duminicala-summaries',
  CURRENT_SUNDAY: 'scoala-duminicala-current-sunday'
};

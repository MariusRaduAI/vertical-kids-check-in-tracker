
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  age: number;
  daysUntilBirthday: number;
  ageGroup: AgeGroup;
  category: 'Membru' | 'Guest';
  parents: string[];
  phone?: string;
  email?: string;
  loveLanguage?: string;
  profile?: string;
  hasAllergies?: boolean;
  allergiesDetails?: string;
  hasSpecialNeeds?: boolean;
  specialNeedsDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export type AgeGroup = '0-1' | '1-2' | '2-3' | '4-6' | '7-12';

export interface Attendance {
  id: string;
  childId: string;
  childName: string;
  ageGroup: AgeGroup;
  category: 'Membru' | 'Guest';
  date: string; // YYYY-MM-DD
  program: 'P1' | 'P2';
  status: 'P' | 'A';
  uniqueCode?: string;
  checkedBy?: string;
  medicalCheck: {
    temperature: boolean;
    noSymptoms: boolean;
    goodCondition: boolean;
  };
  checkedInAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Voluntar';
  createdAt: string;
}

export interface AttendanceSummary {
  date: string;
  totalP1: number;
  totalP2: number;
  total: number;
  byAgeGroup: Record<AgeGroup, {
    P1: number;
    P2: number;
    total: number;
  }>;
  byCategory: {
    Membru: number;
    Guest: number;
  };
}

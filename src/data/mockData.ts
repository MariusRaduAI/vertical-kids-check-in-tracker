
import { Child, Attendance, AttendanceSummary, AgeGroup, User } from "../types/models";
import { addDays, format, parseISO, differenceInDays, differenceInYears } from "date-fns";

// Helper function to calculate age and days until birthday
const calculateAge = (birthDate: string): { age: number; daysUntilBirthday: number } => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const age = differenceInYears(today, birth);
  
  // Calculate next birthday
  const nextBirthday = new Date(birth);
  nextBirthday.setFullYear(today.getFullYear());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntilBirthday = differenceInDays(nextBirthday, today);
  
  return { age, daysUntilBirthday };
};

// Helper function to determine age group
const getAgeGroup = (age: number): AgeGroup => {
  if (age < 1) return '0-1';
  if (age < 2) return '1-2';
  if (age < 3) return '2-3';
  if (age < 7) return '4-6';
  return '7-12';
};

// Generate mock children
export const generateMockChildren = (count: number): Child[] => {
  const children: Child[] = [];
  const firstNames = ["Ana", "Maria", "Ioan", "Mihai", "David", "Sofia", "Elena", "Tudor", "Andreea", "Gabriel"];
  const lastNames = ["Popescu", "Ionescu", "Popa", "Dumitru", "Stan", "Stoica", "Gheorghe", "Rusu", "Munteanu"];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Generate a random birthdate between 0 and 12 years ago
    const yearsAgo = Math.floor(Math.random() * 12);
    const monthsAgo = Math.floor(Math.random() * 12);
    const daysAgo = Math.floor(Math.random() * 28);
    
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - yearsAgo,
      today.getMonth() - monthsAgo,
      today.getDate() - daysAgo
    );
    
    const { age, daysUntilBirthday } = calculateAge(birthDate.toISOString());
    const ageGroup = getAgeGroup(age);
    
    children.push({
      id: `child-${i + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      birthDate: format(birthDate, 'yyyy-MM-dd'),
      age,
      daysUntilBirthday,
      ageGroup,
      category: Math.random() > 0.3 ? 'Membru' : 'Guest',
      parents: [`${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`],
      phone: `07${Math.floor(Math.random() * 100000000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      loveLanguage: ['Timp de calitate', 'Cuvinte de încurajare', 'Daruri', 'Servicii', 'Atingere fizică'][Math.floor(Math.random() * 5)],
      profile: ['Jucăuș', 'Timid', 'Creativ', 'Energic', 'Curios'][Math.floor(Math.random() * 5)],
      createdAt: format(addDays(new Date(), -Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
      updatedAt: format(new Date(), 'yyyy-MM-dd'),
    });
  }

  return children;
};

// Generate Sundays for a year
export const generateSundays = (year: number = new Date().getFullYear()): string[] => {
  const sundays: string[] = [];
  const startDate = new Date(year, 0, 1); // Jan 1st of the specified year
  
  // Find the first Sunday
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() + 1);
  }
  
  // Add all Sundays of the year
  while (startDate.getFullYear() === year) {
    sundays.push(format(startDate, 'yyyy-MM-dd'));
    startDate.setDate(startDate.getDate() + 7);
  }
  
  return sundays;
};

// Generate attendance records
export const generateMockAttendance = (children: Child[], sundays: string[]): Attendance[] => {
  const attendance: Attendance[] = [];
  
  sundays.forEach((sunday) => {
    children.forEach((child) => {
      // Random attendance for P1
      if (Math.random() > 0.4) {
        const uniqueCode = `${child.firstName.charAt(0)}${child.lastName.charAt(0)}${Math.floor(Math.random() * 10)}P1`;
        
        attendance.push({
          id: `att-${sunday}-${child.id}-P1`,
          childId: child.id,
          childName: child.fullName,
          ageGroup: child.ageGroup,
          category: child.category,
          date: sunday,
          program: 'P1',
          status: 'P',
          uniqueCode,
          checkedBy: 'Voluntar 1',
          medicalCheck: {
            temperature: true,
            noSymptoms: true,
            goodCondition: true,
          },
          checkedInAt: `${sunday}T08:${Math.floor(Math.random() * 60)}:00`,
        });
      } else {
        attendance.push({
          id: `att-${sunday}-${child.id}-P1`,
          childId: child.id,
          childName: child.fullName,
          ageGroup: child.ageGroup,
          category: child.category,
          date: sunday,
          program: 'P1',
          status: 'A',
          medicalCheck: {
            temperature: false,
            noSymptoms: false,
            goodCondition: false,
          },
          checkedInAt: "",
        });
      }
      
      // Random attendance for P2
      if (Math.random() > 0.5) {
        const uniqueCode = `${child.firstName.charAt(0)}${child.lastName.charAt(0)}${Math.floor(Math.random() * 10)}P2`;
        
        attendance.push({
          id: `att-${sunday}-${child.id}-P2`,
          childId: child.id,
          childName: child.fullName,
          ageGroup: child.ageGroup,
          category: child.category,
          date: sunday,
          program: 'P2',
          status: 'P',
          uniqueCode,
          checkedBy: 'Voluntar 2',
          medicalCheck: {
            temperature: true,
            noSymptoms: true,
            goodCondition: true,
          },
          checkedInAt: `${sunday}T11:${Math.floor(Math.random() * 60)}:00`,
        });
      } else {
        attendance.push({
          id: `att-${sunday}-${child.id}-P2`,
          childId: child.id,
          childName: child.fullName,
          ageGroup: child.ageGroup,
          category: child.category,
          date: sunday,
          program: 'P2',
          status: 'A',
          medicalCheck: {
            temperature: false,
            noSymptoms: false,
            goodCondition: false,
          },
          checkedInAt: "",
        });
      }
    });
  });
  
  return attendance;
};

// Generate attendance summary
export const generateAttendanceSummary = (attendance: Attendance[]): Record<string, AttendanceSummary> => {
  const summary: Record<string, AttendanceSummary> = {};
  
  // Group by date
  const groupedByDate = attendance.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, Attendance[]>);
  
  // Calculate summaries
  Object.entries(groupedByDate).forEach(([date, records]) => {
    const presentP1 = records.filter(r => r.program === 'P1' && r.status === 'P');
    const presentP2 = records.filter(r => r.program === 'P2' && r.status === 'P');
    
    const byAgeGroup = {
      '0-1': { P1: 0, P2: 0, total: 0 },
      '1-2': { P1: 0, P2: 0, total: 0 },
      '2-3': { P1: 0, P2: 0, total: 0 },
      '4-6': { P1: 0, P2: 0, total: 0 },
      '7-12': { P1: 0, P2: 0, total: 0 },
    };
    
    presentP1.forEach(record => {
      byAgeGroup[record.ageGroup].P1++;
      byAgeGroup[record.ageGroup].total++;
    });
    
    presentP2.forEach(record => {
      byAgeGroup[record.ageGroup].P2++;
      byAgeGroup[record.ageGroup].total++;
    });
    
    // Count new children (those with isFirstAttendance flag)
    const newChildrenCount = records.filter(r => r.isFirstAttendance === true && r.status === 'P').length;
    
    summary[date] = {
      date,
      totalP1: presentP1.length,
      totalP2: presentP2.length,
      total: presentP1.length + presentP2.length,
      newChildrenCount,
      byAgeGroup,
      byCategory: {
        Membru: [...presentP1, ...presentP2].filter(r => r.category === 'Membru').length,
        Guest: [...presentP1, ...presentP2].filter(r => r.category === 'Guest').length,
      },
    };
  });
  
  return summary;
};

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    createdAt: "2023-01-01"
  },
  {
    id: "user-2",
    name: "Voluntar Recepție",
    email: "voluntar@example.com",
    role: "Voluntar",
    createdAt: "2023-01-02"
  }
];

// Generate complete mock data
export const children = generateMockChildren(30);
export const sundays = generateSundays();
export const attendanceRecords = generateMockAttendance(children, sundays);
export const attendanceSummaries = generateAttendanceSummary(attendanceRecords);

// Current Sunday functions
export const getCurrentSunday = (): string => {
  const today = new Date();
  const currentSunday = new Date(today);
  
  // If today is Sunday, use today, otherwise find the next Sunday
  if (today.getDay() === 0) {
    return format(today, 'yyyy-MM-dd');
  }
  
  // Find the next Sunday
  currentSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
  return format(currentSunday, 'yyyy-MM-dd');
};

export const getMostRecentSunday = (): string => {
  const today = new Date();
  
  // If today is Sunday, use today
  if (today.getDay() === 0) {
    return format(today, 'yyyy-MM-dd');
  }
  
  // Find the previous Sunday
  const previousSunday = new Date(today);
  previousSunday.setDate(today.getDate() - today.getDay());
  return format(previousSunday, 'yyyy-MM-dd');
};

// Generate unique code for check-in
export const generateUniqueCode = (
  child: Child, 
  program: 'P1' | 'P2', 
  order: number
): string => {
  const initials = `${child.firstName.charAt(0)}${child.lastName.charAt(0)}`;
  return `${initials}${order.toString().padStart(2, '0')}${program}`;
};

import { format, parseISO, subMonths } from "date-fns";
import { Attendance, AttendanceSummary, Child, AgeGroup } from "@/types/models";

export const getVisibleSundays = (
  period: string, 
  currentSunday: string, 
  summaries: Record<string, AttendanceSummary>
) => {
  const today = new Date();
  let startDate;
  
  switch (period) {
    case "current":
      return [currentSunday];
    case "lastMonth":
      startDate = subMonths(today, 1);
      break;
    case "last3Months":
      startDate = subMonths(today, 3);
      break;
    case "last6Months":
      startDate = subMonths(today, 6);
      break;
    case "allTime":
      return Object.keys(summaries).sort((a, b) => 
        parseISO(a).getTime() - parseISO(b).getTime()
      );
    default:
      return [currentSunday];
  }
  
  return Object.keys(summaries)
    .filter(date => parseISO(date) >= startDate)
    .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime());
};

export const getMonthlyAttendance = (
  visibleSundays: string[], 
  summaries: Record<string, AttendanceSummary>
) => {
  const monthlyData: Record<string, { month: string, total: number, P1: number, P2: number }> = {};
  
  visibleSundays.forEach(sunday => {
    const date = parseISO(sunday);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMM yyyy');
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthLabel,
        total: 0,
        P1: 0,
        P2: 0
      };
    }
    
    const daySummary = summaries[sunday];
    monthlyData[monthKey].total += daySummary.total;
    monthlyData[monthKey].P1 += daySummary.totalP1;
    monthlyData[monthKey].P2 += daySummary.totalP2;
  });
  
  return Object.values(monthlyData);
};

export const getAverageAttendance = (
  visibleSundays: string[], 
  summaries: Record<string, AttendanceSummary>
) => {
  return visibleSundays.map(sunday => {
    const summary = summaries[sunday];
    return {
      date: format(parseISO(sunday), 'dd MMM'),
      total: summary.total,
      P1: summary.totalP1,
      P2: summary.totalP2
    };
  });
};

export const getAttendanceByCategory = (
  visibleSundays: string[], 
  summaries: Record<string, AttendanceSummary>
) => {
  let membriTotal = 0;
  let guestTotal = 0;
  
  visibleSundays.forEach(sunday => {
    const summary = summaries[sunday];
    membriTotal += summary.byCategory.Membru;
    guestTotal += summary.byCategory.Guest;
  });
  
  return [
    { name: 'Membri', value: membriTotal },
    { name: 'Guests', value: guestTotal }
  ];
};

export const getAttendanceByAgeGroup = (
  visibleSundays: string[], 
  summaries: Record<string, AttendanceSummary>
) => {
  const ageGroups = {
    '0-1': 0,
    '1-2': 0,
    '2-3': 0,
    '4-6': 0,
    '7-12': 0
  };
  
  visibleSundays.forEach(sunday => {
    const summary = summaries[sunday];
    
    Object.entries(summary.byAgeGroup).forEach(([group, data]) => {
      ageGroups[group as keyof typeof ageGroups] += data.total;
    });
  });
  
  return Object.entries(ageGroups).map(([group, total]) => ({
    name: group,
    total
  }));
};

export const getTopPresentChildren = (
  visibleSundays: string[], 
  attendance: Attendance[], 
  children: Child[]
) => {
  const childAttendance = new Map<string, number>();
  
  attendance.filter(a => visibleSundays.includes(a.date) && a.status === 'P')
    .forEach(a => {
      const count = childAttendance.get(a.childId) || 0;
      childAttendance.set(a.childId, count + 1);
    });
  
  const sortedChildren = Array.from(childAttendance.entries())
    .map(([childId, count]) => {
      const child = children.find(c => c.id === childId);
      return {
        id: childId,
        name: child?.fullName || 'Unknown',
        count,
        ageGroup: child?.ageGroup || '0-1',
        category: child?.category || 'Guest'
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  return sortedChildren;
};

export const getTopAbsentChildren = (
  visibleSundays: string[], 
  attendance: Attendance[], 
  children: Child[]
) => {
  const maxAttendance = visibleSundays.length * 2;
  const childAttendance = new Map<string, number>();
  
  children.forEach(child => {
    childAttendance.set(child.id, 0);
  });
  
  attendance.filter(a => visibleSundays.includes(a.date) && a.status === 'P')
    .forEach(a => {
      const count = childAttendance.get(a.childId) || 0;
      childAttendance.set(a.childId, count + 1);
    });
  
  const childrenWithAbsences = Array.from(childAttendance.entries())
    .map(([childId, presentCount]) => {
      const child = children.find(c => c.id === childId);
      return {
        id: childId,
        name: child?.fullName || 'Unknown',
        absences: maxAttendance - presentCount,
        ageGroup: child?.ageGroup || '0-1',
        category: child?.category || 'Guest'
      };
    })
    .filter(c => c.absences > 0)
    .sort((a, b) => b.absences - a.absences)
    .slice(0, 20);
  
  return childrenWithAbsences;
};

export const getAttendanceTrends = (summaries: Record<string, AttendanceSummary>, count = 5) => {
  const recentSundays = Object.keys(summaries)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, count)
    .reverse();
  
  return recentSundays.map(date => {
    const summary = summaries[date];
    return {
      date: format(parseISO(date), "dd MMM"),
      P1: summary.totalP1,
      P2: summary.totalP2,
      total: summary.total
    };
  });
};

export const getMockChartsData = (period: "week" | "month" | "quarter" | "year") => {
  const trendsData = period === "week" 
    ? [
        { date: "Duminică", P1: 35, P2: 28, total: 63 },
        { date: "Duminica Trecută", P1: 32, P2: 25, total: 57 },
        { date: "2 Săpt. în urmă", P1: 30, P2: 23, total: 53 },
        { date: "3 Săpt. în urmă", P1: 33, P2: 26, total: 59 },
      ]
    : period === "month"
    ? [
        { month: "Aprilie", P1: 140, P2: 105, total: 245 },
        { month: "Martie", P1: 125, P2: 95, total: 220 },
        { month: "Februarie", P1: 120, P2: 90, total: 210 },
        { month: "Ianuarie", P1: 130, P2: 100, total: 230 },
      ]
    : period === "quarter"
    ? [
        { month: "Q1 2025", P1: 380, P2: 290, total: 670 },
        { month: "Q4 2024", P1: 365, P2: 275, total: 640 },
        { month: "Q3 2024", P1: 320, P2: 250, total: 570 },
        { month: "Q2 2024", P1: 350, P2: 270, total: 620 },
      ]
    : [
        { month: "2025", P1: 1500, P2: 1200, total: 2700 },
        { month: "2024", P1: 1400, P2: 1100, total: 2500 },
        { month: "2023", P1: 1300, P2: 1000, total: 2300 },
        { month: "2022", P1: 1100, P2: 900, total: 2000 },
      ];

  const ageGroupData = [
    { name: "0-1", P1: 5, P2: 3, total: 8 },
    { name: "1-2", P1: 8, P2: 6, total: 14 },
    { name: "2-3", P1: 10, P2: 7, total: 17 },
    { name: "4-6", P1: 15, P2: 12, total: 27 },
    { name: "7-12", P1: 12, P2: 9, total: 21 },
  ];

  const categoryData = [
    { name: "Membri", value: 65 },
    { name: "Guests", value: 22 },
  ];

  const topChildren = [
    { id: "1", name: "Ana Maria", count: 12, ageGroup: "4-6" as AgeGroup, category: "Membru" as "Membru" | "Guest" },
    { id: "2", name: "Mihai Alexandru", count: 11, ageGroup: "7-12" as AgeGroup, category: "Membru" as "Membru" | "Guest" },
    { id: "3", name: "Elena Cristina", count: 10, ageGroup: "4-6" as AgeGroup, category: "Membru" as "Membru" | "Guest" },
    { id: "4", name: "Andrei Ioan", count: 9, ageGroup: "2-3" as AgeGroup, category: "Membru" as "Membru" | "Guest" },
    { id: "5", name: "Maria Alexandra", count: 8, ageGroup: "4-6" as AgeGroup, category: "Guest" as "Membru" | "Guest" },
    { id: "6", name: "David Stefan", count: 7, ageGroup: "7-12" as AgeGroup, category: "Membru" as "Membru" | "Guest" },
    { id: "7", name: "Sofia Gabriela", count: 6, ageGroup: "4-6" as AgeGroup, category: "Guest" as "Membru" | "Guest" },
    { id: "8", name: "Gabriel Nicolae", count: 5, ageGroup: "1-2" as AgeGroup, category: "Membru" as "Membru" | "Guest" },
  ];

  return {
    trendsData,
    ageGroupData,
    categoryData,
    topChildren
  };
};

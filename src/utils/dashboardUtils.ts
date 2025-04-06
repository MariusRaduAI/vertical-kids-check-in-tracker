import { format, parseISO, subMonths } from "date-fns";
import { Attendance, AttendanceSummary, Child } from "@/types/models";

// Determine visible Sundays based on the selected period
export const getVisibleSundays = (
  period: string, 
  currentSunday: string, 
  summaries: Record<string, AttendanceSummary>
) => {
  const today = new Date();
  let startDate;
  
  switch (period) {
    case "current":
      // Only the current Sunday
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
  
  // Filter sundays
  return Object.keys(summaries)
    .filter(date => parseISO(date) >= startDate)
    .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime());
};

// Calculate monthly attendance
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

// Calculate average attendance for specific dates
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

// Calculate attendance by category
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

// Calculate attendance by age group
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

// Get top 20 most present children
export const getTopPresentChildren = (
  visibleSundays: string[], 
  attendance: Attendance[], 
  children: Child[]
) => {
  const childAttendance = new Map<string, number>();
  
  // Count attendance for each child
  attendance.filter(a => visibleSundays.includes(a.date) && a.status === 'P')
    .forEach(a => {
      const count = childAttendance.get(a.childId) || 0;
      childAttendance.set(a.childId, count + 1);
    });
  
  // Convert to array and sort
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

// Get top 20 most absent children
export const getTopAbsentChildren = (
  visibleSundays: string[], 
  attendance: Attendance[], 
  children: Child[]
) => {
  const maxAttendance = visibleSundays.length * 2; // P1 and P2 for each Sunday
  const childAttendance = new Map<string, number>();
  
  // Initialize all children with 0 attendance
  children.forEach(child => {
    childAttendance.set(child.id, 0);
  });
  
  // Count attendance for each child
  attendance.filter(a => visibleSundays.includes(a.date) && a.status === 'P')
    .forEach(a => {
      const count = childAttendance.get(a.childId) || 0;
      childAttendance.set(a.childId, count + 1);
    });
  
  // Convert to array and calculate absences
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
    .filter(c => c.absences > 0) // Only include children with absences
    .sort((a, b) => b.absences - a.absences)
    .slice(0, 20);
  
  return childrenWithAbsences;
};

// Get attendance trends (for the recent Sundays)
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

// Mock data generator for dashboard charts
export const getMockChartsData = (period: "week" | "month" | "quarter" | "year") => {
  // Generate mock data based on the selected period
  const trendsData = generateMockTrendsData(period);
  const ageGroupData = generateMockAgeGroupData(period);
  const categoryData = generateMockCategoryData();
  const topChildren = generateMockTopChildren();
  
  return {
    trendsData,
    ageGroupData,
    categoryData,
    topChildren
  };
};

// Generate mock trends data based on period
const generateMockTrendsData = (period: "week" | "month" | "quarter" | "year") => {
  let data: { date: string; P1: number; P2: number; total: number; }[] = [];
  
  switch (period) {
    case "week":
      data = [
        { date: "Luni", P1: 42, P2: 35, total: 77 },
        { date: "Marți", P1: 38, P2: 32, total: 70 },
        { date: "Miercuri", P1: 45, P2: 39, total: 84 },
        { date: "Joi", P1: 39, P2: 30, total: 69 },
        { date: "Vineri", P1: 47, P2: 41, total: 88 },
        { date: "Sâmbătă", P1: 25, P2: 18, total: 43 },
        { date: "Duminică", P1: 57, P2: 52, total: 109 }
      ];
      break;
    case "month":
      data = [
        { date: "Săpt 1", P1: 57, P2: 52, total: 109 },
        { date: "Săpt 2", P1: 54, P2: 48, total: 102 },
        { date: "Săpt 3", P1: 59, P2: 51, total: 110 },
        { date: "Săpt 4", P1: 53, P2: 49, total: 102 }
      ];
      break;
    case "quarter":
      data = [
        { date: "Ian", P1: 220, P2: 198, total: 418 },
        { date: "Feb", P1: 210, P2: 195, total: 405 },
        { date: "Mar", P1: 230, P2: 210, total: 440 }
      ];
      break;
    case "year":
      data = [
        { date: "Ian", P1: 220, P2: 198, total: 418 },
        { date: "Feb", P1: 210, P2: 195, total: 405 },
        { date: "Mar", P1: 230, P2: 210, total: 440 },
        { date: "Apr", P1: 225, P2: 205, total: 430 },
        { date: "Mai", P1: 235, P2: 215, total: 450 },
        { date: "Iun", P1: 200, P2: 180, total: 380 },
        { date: "Iul", P1: 180, P2: 160, total: 340 },
        { date: "Aug", P1: 160, P2: 140, total: 300 },
        { date: "Sep", P1: 210, P2: 190, total: 400 },
        { date: "Oct", P1: 230, P2: 210, total: 440 },
        { date: "Nov", P1: 240, P2: 220, total: 460 },
        { date: "Dec", P1: 210, P2: 190, total: 400 }
      ];
      break;
  }
  
  return data;
};

// Generate mock age group data
const generateMockAgeGroupData = (period: "week" | "month" | "quarter" | "year") => {
  return [
    { name: "0-1", total: 12, P1: 7, P2: 5 },
    { name: "1-2", total: 18, P1: 10, P2: 8 },
    { name: "2-3", total: 25, P1: 14, P2: 11 },
    { name: "4-6", total: 32, P1: 18, P2: 14 },
    { name: "7-12", total: 28, P1: 15, P2: 13 }
  ];
};

// Generate mock category data
const generateMockCategoryData = () => {
  return [
    { name: "Membri", value: 75 },
    { name: "Guests", value: 25 }
  ];
};

// Generate mock top children data
const generateMockTopChildren = () => {
  return [
    { id: "1", name: "Ana Maria", count: 12, ageGroup: "4-6", category: "Membru" },
    { id: "2", name: "Mihai Ioan", count: 11, ageGroup: "7-12", category: "Membru" },
    { id: "3", name: "Elena Cristina", count: 10, ageGroup: "2-3", category: "Membru" },
    { id: "4", name: "Alexandru", count: 9, ageGroup: "4-6", category: "Membru" },
    { id: "5", name: "Maria", count: 9, ageGroup: "1-2", category: "Membru" },
    { id: "6", name: "Andrei", count: 8, ageGroup: "7-12", category: "Guest" },
    { id: "7", name: "Sofia", count: 8, ageGroup: "2-3", category: "Membru" },
    { id: "8", name: "David", count: 7, ageGroup: "4-6", category: "Membru" },
    { id: "9", name: "Gabriela", count: 7, ageGroup: "1-2", category: "Guest" },
    { id: "10", name: "Matei", count: 6, ageGroup: "0-1", category: "Membru" }
  ];
};

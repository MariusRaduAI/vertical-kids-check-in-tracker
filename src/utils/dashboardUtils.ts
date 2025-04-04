
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


import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Attendance, Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";

const Analytics: React.FC = () => {
  const { children, attendance, summaries } = useApp();
  const [period, setPeriod] = useState("3months");
  
  // Get relevant data based on period
  const getVisibleSundays = () => {
    const today = new Date();
    let startDate;
    
    switch (period) {
      case "1month":
        startDate = subMonths(today, 1);
        break;
      case "3months":
        startDate = subMonths(today, 3);
        break;
      case "6months":
        startDate = subMonths(today, 6);
        break;
      case "12months":
        startDate = subMonths(today, 12);
        break;
      default:
        startDate = subMonths(today, 3);
    }
    
    // Filter sundays
    return Object.keys(summaries)
      .filter(date => parseISO(date) >= startDate)
      .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime());
  };
  
  const visibleSundays = getVisibleSundays();
  
  // Calculate monthly attendance
  const getMonthlyAttendance = () => {
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
  
  // Calculate average attendance
  const getAverageAttendance = () => {
    const data = visibleSundays.map(sunday => {
      const summary = summaries[sunday];
      return {
        date: format(parseISO(sunday), 'dd MMM'),
        total: summary.total,
        P1: summary.totalP1,
        P2: summary.totalP2
      };
    });
    
    return data;
  };
  
  // Calculate attendance by category
  const getAttendanceByCategory = () => {
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
  const getAttendanceByAgeGroup = () => {
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
  
  // Calculate top 20 most present children
  const getTopPresentChildren = () => {
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
  
  // Calculate top 20 most absent children
  const getTopAbsentChildren = () => {
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
  
  const monthlyAttendance = getMonthlyAttendance();
  const averageAttendance = getAverageAttendance();
  const categoryData = getAttendanceByCategory();
  const ageGroupData = getAttendanceByAgeGroup();
  const topPresent = getTopPresentChildren();
  const topAbsent = getTopAbsentChildren();
  
  const COLORS = ['#4a9af5', '#ff9f7f', '#64d887', '#a288e3', '#ffbb78'];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard & Analize"
        description="Analiză detaliată a prezenței și tendințelor"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Perioada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Ultima lună</SelectItem>
              <SelectItem value="3months">Ultimele 3 luni</SelectItem>
              <SelectItem value="6months">Ultimele 6 luni</SelectItem>
              <SelectItem value="12months">Ultimul an</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Prezență Lunară</CardTitle>
            <CardDescription>
              Total copii prezenți în fiecare lună
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="P1" name="Program 1" fill="#6b5ecc" />
                <Bar dataKey="P2" name="Program 2" fill="#4a9af5" />
                <Bar dataKey="total" name="Total" fill="#5fd4ac" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tendință Prezență</CardTitle>
            <CardDescription>
              Evoluția prezenței pe fiecare duminică
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={averageAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total" stroke="#5fd4ac" strokeWidth={2} />
                <Line type="monotone" dataKey="P1" name="Program 1" stroke="#6b5ecc" />
                <Line type="monotone" dataKey="P2" name="Program 2" stroke="#4a9af5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Membri vs Guests</CardTitle>
            <CardDescription>
              Distribuția prezenței pe categorii
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} prezențe`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prezență pe Grupe de Vârstă</CardTitle>
            <CardDescription>
              Distribuția prezenței pe grupe de vârstă
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tickFormatter={(value) => {
                    switch(value) {
                      case "0-1": return "0-1 ani";
                      case "1-2": return "1-2 ani";
                      case "2-3": return "2-3 ani";
                      case "4-6": return "4-6 ani";
                      case "7-12": return "7-12 ani";
                      default: return value;
                    }
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total Prezențe" fill="#6b5ecc" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 20 Copii Cei Mai Prezenți</CardTitle>
            <CardDescription>
              Copiii cu cele mai multe prezențe
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96 overflow-auto">
            <div className="space-y-2">
              {topPresent.map((child, index) => (
                <div 
                  key={child.id} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 text-center font-medium">{index + 1}.</div>
                    <div>
                      <div className="font-medium">{child.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <AgeGroupBadge ageGroup={child.ageGroup} />
                        <CategoryBadge category={child.category} />
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-primary">{child.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 20 Copii Cei Mai Absenți</CardTitle>
            <CardDescription>
              Copiii cu cele mai multe absențe
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96 overflow-auto">
            <div className="space-y-2">
              {topAbsent.map((child, index) => (
                <div 
                  key={child.id} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 text-center font-medium">{index + 1}.</div>
                    <div>
                      <div className="font-medium">{child.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <AgeGroupBadge ageGroup={child.ageGroup} />
                        <CategoryBadge category={child.category} />
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-red-500">{child.absences}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

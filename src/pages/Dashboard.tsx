
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, Users } from "lucide-react";

// Import refactored components
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import StatsCard from "@/components/dashboard/StatsCard";
import AttendanceByAgeChart from "@/components/dashboard/AttendanceByAgeChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import AttendanceTrendsChart from "@/components/dashboard/AttendanceTrendsChart";
import TopChildrenList from "@/components/dashboard/TopChildrenList";

// Import utility functions
import {
  getVisibleSundays,
  getMonthlyAttendance,
  getAverageAttendance,
  getAttendanceByCategory,
  getAttendanceByAgeGroup,
  getTopPresentChildren,
  getTopAbsentChildren,
  getAttendanceTrends
} from "@/utils/dashboardUtils";

const Dashboard: React.FC = () => {
  const { 
    getTotalPresentToday, 
    currentSunday,
    getAttendanceSummaryForDate,
    children,
    attendance,
    summaries 
  } = useApp();
  
  const [period, setPeriod] = useState("current");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get the attendance data for today
  const todayStats = getTotalPresentToday();
  const todaySummary = getAttendanceSummaryForDate(currentSunday);
  
  // Get the visible Sundays based on the selected period
  const visibleSundays = getVisibleSundays(period, currentSunday, summaries);
  
  // Create data for age group chart
  const ageGroupData = todaySummary
    ? Object.entries(todaySummary.byAgeGroup).map(([group, data]) => ({
        name: group,
        P1: data.P1,
        P2: data.P2,
        total: data.total,
      }))
    : [];
  
  // Create data for category pie chart
  const categoryData = todaySummary
    ? [
        { name: "Membri", value: todaySummary.byCategory.Membru },
        { name: "Guests", value: todaySummary.byCategory.Guest },
      ]
    : [];
  
  // Calculate data for various charts and displays
  const monthlyAttendance = getMonthlyAttendance(visibleSundays, summaries);
  const averageAttendance = getAverageAttendance(visibleSundays, summaries);
  const categoryData2 = getAttendanceByCategory(visibleSundays, summaries);
  const ageGroupData2 = getAttendanceByAgeGroup(visibleSundays, summaries);
  const topPresent = getTopPresentChildren(visibleSundays, attendance, children);
  const topAbsent = getTopAbsentChildren(visibleSundays, attendance, children);
  const attendanceTrends = getAttendanceTrends(summaries);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard & Analize"
        description="Vizualizare generală a prezenței și statisticilor"
        actions={<PeriodSelector value={period} onValueChange={setPeriod} />}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Statistici Generale</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Tendințe</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Membri</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title={`Total Copii ${period === "current" ? "Astăzi" : "în Perioada Selectată"}`}
              value={averageAttendance.reduce((sum, item) => sum + item.total, 0)}
              description={
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>Program 1: {averageAttendance.reduce((sum, item) => sum + item.P1, 0)}</span>
                  <span>•</span>
                  <span>Program 2: {averageAttendance.reduce((sum, item) => sum + item.P2, 0)}</span>
                </div>
              }
            />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Membri vs Guests
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {categoryData2[0]?.value || 0}
                  <span className="text-sm text-muted-foreground ml-1">Membri</span>
                </div>
                <div className="text-3xl font-bold">
                  {categoryData2[1]?.value || 0}
                  <span className="text-sm text-muted-foreground ml-1">Guests</span>
                </div>
              </CardContent>
            </Card>
            
            <StatsCard
              title="Total Membri Înregistrați"
              value={children.filter(c => c.category === "Membru").length}
              description={`Din total de ${children.length} copii`}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AttendanceByAgeChart 
              data={period === "current" ? ageGroupData : ageGroupData2} 
              period={period} 
            />
            
            <CategoryPieChart data={period === "current" ? categoryData : categoryData2} />
          </div>
          
          <AttendanceTrendsChart
            data={period === "current" ? attendanceTrends : monthlyAttendance}
            period={period}
            title={period === "current" ? "Tendințe de Prezență (Ultimele 5 Duminici)" : "Prezență Lunară"}
            description={period === "current" ? undefined : "Total copii prezenți în fiecare lună"}
          />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6 animate-fade-in">
          <AttendanceTrendsChart
            data={period === "current" ? attendanceTrends : averageAttendance}
            period={period}
            title="Tendință Prezență"
            description="Evoluția prezenței pe fiecare duminică"
            chartType="line"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuție pe Vârstă</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <AttendanceByAgeChart 
                  data={period === "current" ? ageGroupData : ageGroupData2} 
                  period={period} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistici pe Categorii</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <CategoryPieChart data={period === "current" ? categoryData : categoryData2} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopChildrenList
              data={topPresent}
              title="Top 20 Copii Cei Mai Prezenți"
              description="Copiii cu cele mai multe prezențe"
              valueColor="text-primary"
            />
            
            <TopChildrenList
              data={topAbsent}
              title="Top 20 Copii Cei Mai Absenți"
              description="Copiii cu cele mai multe absențe"
              valueColor="text-red-500"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/dashboard/StatsCard";
import AttendanceTrendsChart from "@/components/dashboard/AttendanceTrendsChart";
import AttendanceByAgeChart from "@/components/dashboard/AttendanceByAgeChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import TopChildrenList from "@/components/dashboard/TopChildrenList";
import UpcomingBirthdays from "@/components/dashboard/UpcomingBirthdays";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import { useApp } from "@/context/AppContext";
import { Users, CalendarDays, TrendingUp, Layers } from "lucide-react";
import { AttendanceSummary } from "@/types/models";

const Dashboard: React.FC = () => {
  const { currentSunday, getTotalPresentToday, sundays, getAttendanceSummaryForDate, children } = useApp();
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("week");
  
  const todayStats = getTotalPresentToday();
  
  // This is to handle the error where todayStats might be unknown
  const totalP1 = todayStats && 'totalP1' in todayStats ? todayStats.totalP1 : 0;
  const totalP2 = todayStats && 'totalP2' in todayStats ? todayStats.totalP2 : 0;
  const totalAttendance = todayStats && 'total' in todayStats ? todayStats.total : 0;
  
  // Calculate the trend data based on the last 6 Sundays (or fewer if not available)
  const recentSundays = [...sundays].sort().slice(-6);
  const trendData = recentSundays.map(sunday => {
    const summary = getAttendanceSummaryForDate(sunday) as AttendanceSummary | undefined;
    return {
      date: sunday,
      P1: summary?.totalP1 || 0,
      P2: summary?.totalP2 || 0,
      total: summary?.total || 0
    };
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Tablou de Bord"
        description="Statistici și informații importante despre participarea la Școala Duminicală"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Copii"
          value={children.length}
          description="Copii înregistrați" 
          icon={<Users className="h-4 w-4" />}
          trend={5}
        />
        <StatsCard 
          title="Program 1"
          value={totalP1}
          description="Prezența Program 1" 
          icon={<CalendarDays className="h-4 w-4" />}
          trend={-2}
        />
        <StatsCard 
          title="Program 2"
          value={totalP2}
          description="Prezența Program 2" 
          icon={<CalendarDays className="h-4 w-4" />}
          trend={8}
        />
        <StatsCard 
          title="Total Prezență"
          value={totalAttendance}
          description="Copii prezenți astăzi" 
          icon={<TrendingUp className="h-4 w-4" />}
          trend={3}
        />
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendințe</TabsTrigger>
          <TabsTrigger value="demographics">Demografice</TabsTrigger>
          <TabsTrigger value="top-children">Top Copii</TabsTrigger>
        </TabsList>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendința Prezenței</CardTitle>
              <CardDescription>Evoluția prezenței în timp</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTrendsChart data={trendData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="demographics" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Participare pe Grupe de Vârstă</CardTitle>
              <CardDescription>Distribuția participanților pe grupe de vârstă</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceByAgeChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Participare pe Categorie</CardTitle>
              <CardDescription>Distribuția participanților pe categorii (Membru/Vizitator)</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPieChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="top-children" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Copii cu Cea Mai Bună Prezență</CardTitle>
              <CardDescription>Copiii care participă cel mai des</CardDescription>
            </CardHeader>
            <CardContent>
              <TopChildrenList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UpcomingBirthdays children={children} weekCount={4} />
    </div>
  );
};

export default Dashboard;

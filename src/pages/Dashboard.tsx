
import React from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";

const Dashboard: React.FC = () => {
  const { 
    getTotalPresentToday, 
    currentSunday,
    getAttendanceSummaryForDate,
    children,
    summaries 
  } = useApp();
  
  const todayStats = getTotalPresentToday();
  const todaySummary = getAttendanceSummaryForDate(currentSunday);
  
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
  
  const COLORS = ["#4a9af5", "#ff9f7f"];
  
  // Create data for attendance trends (last 5 Sundays)
  const recentSundays = Object.keys(summaries)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 5)
    .reverse();
  
  const attendanceTrends = recentSundays.map(date => {
    const summary = summaries[date];
    return {
      date: format(parseISO(date), "dd MMM"),
      P1: summary.totalP1,
      P2: summary.totalP2,
      total: summary.total
    };
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Vizualizare generală a prezenței și statisticilor"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Copii Astăzi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayStats.total}</div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>Program 1: {todayStats.totalP1}</span>
              <span>•</span>
              <span>Program 2: {todayStats.totalP2}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membri vs Guests
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              {todaySummary ? todaySummary.byCategory.Membru : 0}
              <span className="text-sm text-muted-foreground ml-1">Membri</span>
            </div>
            <div className="text-3xl font-bold">
              {todaySummary ? todaySummary.byCategory.Guest : 0}
              <span className="text-sm text-muted-foreground ml-1">Guests</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Membri Înregistrați
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {children.filter(c => c.category === "Membru").length}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Din total de {children.length} copii
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Prezență pe Grupe de Vârstă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroupData}>
                  <XAxis 
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
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === "P1" ? "Program 1" : name === "P2" ? "Program 2" : "Total"]}
                    labelFormatter={(label) => {
                      switch(label) {
                        case "0-1": return "0-1 ani";
                        case "1-2": return "1-2 ani";
                        case "2-3": return "2-3 ani";
                        case "4-6": return "4-6 ani";
                        case "7-12": return "7-12 ani";
                        default: return label;
                      }
                    }}
                  />
                  <Legend />
                  <Bar dataKey="P1" name="Program 1" fill="#6b5ecc" />
                  <Bar dataKey="P2" name="Program 2" fill="#4a9af5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Membri vs Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col items-center justify-center">
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
                  <Tooltip formatter={(value) => [`${value} copii`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendințe de Prezență (Ultimele 5 Duminici)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrends}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="P1" name="Program 1" fill="#6b5ecc" />
                  <Bar dataKey="P2" name="Program 2" fill="#4a9af5" />
                  <Bar dataKey="total" name="Total" fill="#5fd4ac" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

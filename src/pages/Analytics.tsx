import React, { useState, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { format, subMonths, isAfter, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { AttendanceSummary } from "@/types/models";

const periods = [
  { value: "6m", label: "Ultimele 6 luni" },
  { value: "3m", label: "Ultimele 3 luni" },
  { value: "1m", label: "Ultima lună" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
  const { sundays, getAttendanceSummaryForDate } = useApp();
  const [period, setPeriod] = useState("6m");
  
  // Filter sundays based on selected period
  const filteredSundays = useMemo(() => {
    const now = new Date();
    const months = parseInt(period.replace("m", ""));
    const cutoffDate = subMonths(now, months);
    
    return sundays.filter(sunday => {
      const sundayDate = parseISO(sunday);
      return isAfter(sundayDate, cutoffDate);
    }).sort();
  }, [sundays, period]);
  
  // Prepare data for program attendance chart
  const programAttendanceData = useMemo(() => {
    return filteredSundays.map(sunday => {
      const summary = getAttendanceSummaryForDate(sunday) as AttendanceSummary | undefined;
      return {
        name: format(parseISO(sunday), "dd.MM"),
        "Program 1": summary?.totalP1 || 0,
        "Program 2": summary?.totalP2 || 0,
      };
    });
  }, [filteredSundays, getAttendanceSummaryForDate]);
  
  // Prepare data for age group chart
  const ageGroupData = useMemo(() => {
    // Initialize with zeros
    const aggregatedData = {
      "0-1": 0,
      "1-2": 0,
      "2-3": 0,
      "4-6": 0,
      "7-12": 0
    };
    
    // Sum up all values from the period
    filteredSundays.forEach(sunday => {
      const summary = getAttendanceSummaryForDate(sunday) as AttendanceSummary | undefined;
      if (summary && summary.byAgeGroup) {
        Object.entries(summary.byAgeGroup).forEach(([ageGroup, data]) => {
          if (data && typeof data === 'object' && 'total' in data) {
            aggregatedData[ageGroup as keyof typeof aggregatedData] += data.total;
          }
        });
      }
    });
    
    // Convert to array format for PieChart
    return Object.entries(aggregatedData).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredSundays, getAttendanceSummaryForDate]);
  
  // Prepare data for new children trend
  const newChildrenData = useMemo(() => {
    return filteredSundays.map(sunday => {
      const summary = getAttendanceSummaryForDate(sunday) as AttendanceSummary | undefined;
      return {
        name: format(parseISO(sunday), "dd.MM"),
        "Copii noi": summary?.newChildrenCount || 0,
      };
    });
  }, [filteredSundays, getAttendanceSummaryForDate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analiza Participării"
        description="Statistici detaliate despre participare și tendințe"
      />
      
      <div className="flex justify-end">
        <div className="space-y-1 w-[180px]">
          <Label htmlFor="period">Perioadă</Label>
          <Select
            value={period}
            onValueChange={setPeriod}
          >
            <SelectTrigger id="period">
              <SelectValue placeholder="Selectează perioada" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="program" className="space-y-4">
        <TabsList>
          <TabsTrigger value="program">Participare Program</TabsTrigger>
          <TabsTrigger value="age">Participare pe Grupe de Vârstă</TabsTrigger>
          <TabsTrigger value="new">Copii Noi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="program" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participare pe Program</CardTitle>
              <CardDescription>Tendințe de participare pentru fiecare program în perioada selectată</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={programAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Program 1" fill="#8884d8" />
                  <Bar dataKey="Program 2" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="age" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participare pe Grupe de Vârstă</CardTitle>
              <CardDescription>Distribuția participanților pe grupe de vârstă</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendința Copiilor Noi</CardTitle>
              <CardDescription>Numărul de copii noi înregistrați în perioada selectată</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={newChildrenData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Copii noi" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

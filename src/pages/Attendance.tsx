
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import { Child, AgeGroup, Attendance as AttendanceType } from "@/types/models";
import { Search, Download, Filter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AttendancePage: React.FC = () => {
  const { children, attendance, sundays } = useApp();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState<AgeGroup | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<"Membru" | "Guest" | "all">("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  
  // Get filtered children
  const getFilteredChildren = () => {
    let filteredChildren = [...children];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredChildren = filteredChildren.filter(child => 
        child.fullName.toLowerCase().includes(query)
      );
    }
    
    // Apply age group filter
    if (ageGroupFilter !== "all") {
      filteredChildren = filteredChildren.filter(child => 
        child.ageGroup === ageGroupFilter
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filteredChildren = filteredChildren.filter(child => 
        child.category === categoryFilter
      );
    }
    
    return filteredChildren;
  };
  
  // Get visible sundays based on period filter
  const getVisibleSundays = () => {
    const today = new Date();
    let filtered: string[] = [];
    
    switch (period) {
      case "week":
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
        const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
        filtered = sundays.filter(sunday => {
          const date = parseISO(sunday);
          return date >= startOfCurrentWeek && date <= endOfCurrentWeek;
        });
        break;
      case "month":
        const startOfCurrentMonth = startOfMonth(today);
        const endOfCurrentMonth = endOfMonth(today);
        filtered = sundays.filter(sunday => {
          const date = parseISO(sunday);
          return date >= startOfCurrentMonth && date <= endOfCurrentMonth;
        });
        break;
      case "3months":
        const threeMonthsAgo = subMonths(today, 3);
        filtered = sundays.filter(sunday => {
          const date = parseISO(sunday);
          return date >= threeMonthsAgo;
        });
        break;
      default:
        filtered = sundays;
    }
    
    // Sort sundays in descending order (newest first)
    return filtered.sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());
  };
  
  const visibleSundays = getVisibleSundays();
  const filteredChildren = getFilteredChildren();
  
  // Calculate attendance statistics for a specific child based on filtered Sundays
  const calculateAttendanceStats = (childId: string) => {
    const childAttendances = attendance.filter(a => 
      a.childId === childId && 
      visibleSundays.includes(a.date)
    );
    
    const totalPresent = childAttendances.filter(a => a.status === "P").length;
    const totalPossible = visibleSundays.length * 2; // P1 and P2 for each Sunday
    const attendancePercentage = totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;
    
    return {
      totalPresent,
      totalPossible,
      attendancePercentage: Math.round(attendancePercentage)
    };
  };
  
  // Calculate summary for a Sunday
  const getSundaySummary = (sundayDate: string) => {
    const records = attendance.filter(a => a.date === sundayDate);
    const presentP1 = records.filter(a => a.program === "P1" && a.status === "P").length;
    const presentP2 = records.filter(a => a.program === "P2" && a.status === "P").length;
    
    return {
      p1: presentP1,
      p2: presentP2,
      total: presentP1 + presentP2
    };
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Prezență Duminicală"
        description="Vizualizează și gestionează prezența copiilor"
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-1">
          <Collapsible
            open={isFiltersOpen}
            onOpenChange={setIsFiltersOpen}
            className="w-full"
          >
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtre
                </CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    {isFiltersOpen ? "Ascunde" : "Arată"}
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Caută</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Caută după nume..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Perioada</label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Perioada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate duminicile</SelectItem>
                        <SelectItem value="week">Această săptămână</SelectItem>
                        <SelectItem value="month">Această lună</SelectItem>
                        <SelectItem value="3months">Ultimele 3 luni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Grupa de vârstă</label>
                    <Select value={ageGroupFilter} onValueChange={(value) => setAgeGroupFilter(value as AgeGroup | "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Grupa de vârstă" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate grupele</SelectItem>
                        <SelectItem value="0-1">0-1 ani</SelectItem>
                        <SelectItem value="1-2">1-2 ani</SelectItem>
                        <SelectItem value="2-3">2-3 ani</SelectItem>
                        <SelectItem value="4-6">4-6 ani</SelectItem>
                        <SelectItem value="7-12">7-12 ani</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Categorie</label>
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as "Membru" | "Guest" | "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toate categoriile</SelectItem>
                        <SelectItem value="Membru">Membri</SelectItem>
                        <SelectItem value="Guest">Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Tabel Prezență</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px] sticky left-0 bg-white">Nume</TableHead>
                      <TableHead>Grupa</TableHead>
                      <TableHead>Vârsta</TableHead>
                      <TableHead>Categorie</TableHead>
                      <TableHead>% Prezență</TableHead>
                      
                      {visibleSundays.map(sunday => (
                        <TableHead key={sunday} className="text-center" colSpan={2}>
                          <div className="text-xs whitespace-nowrap">
                            {format(parseISO(sunday), "dd.MM.yyyy")}
                          </div>
                          <div className="flex text-[10px] divide-x">
                            <div className="flex-1 px-1">P1</div>
                            <div className="flex-1 px-1">P2</div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChildren.map(child => {
                      const stats = calculateAttendanceStats(child.id);
                      
                      return (
                        <TableRow key={child.id}>
                          <TableCell className="font-medium sticky left-0 bg-white">
                            {child.fullName}
                          </TableCell>
                          <TableCell>
                            <AgeGroupBadge ageGroup={child.ageGroup} />
                          </TableCell>
                          <TableCell>{child.age} ani</TableCell>
                          <TableCell>
                            <CategoryBadge category={child.category} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${stats.attendancePercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{stats.attendancePercentage}%</span>
                            </div>
                          </TableCell>
                          
                          {visibleSundays.map(sunday => (
                            <TableCell key={`${child.id}-${sunday}`} className="p-0" colSpan={2}>
                              <div className="grid grid-cols-2 h-full">
                                <div className="py-4 text-center border-r">
                                  <span
                                    className={
                                      getChildAttendance(child.id, sunday, "P1") === "P"
                                        ? "text-green-600 font-bold"
                                        : "text-red-600"
                                    }
                                  >
                                    {getChildAttendance(child.id, sunday, "P1")}
                                  </span>
                                </div>
                                <div className="py-4 text-center">
                                  <span
                                    className={
                                      getChildAttendance(child.id, sunday, "P2") === "P"
                                        ? "text-green-600 font-bold"
                                        : "text-red-600"
                                    }
                                  >
                                    {getChildAttendance(child.id, sunday, "P2")}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                    
                    {/* Summary row */}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold sticky left-0 bg-muted/50" colSpan={5}>
                        Total prezențe
                      </TableCell>
                      
                      {visibleSundays.map(sunday => {
                        const summary = getSundaySummary(sunday);
                        
                        return (
                          <TableCell key={`summary-${sunday}`} className="p-0" colSpan={2}>
                            <div className="grid grid-cols-2 h-full">
                              <div className="py-4 text-center border-r font-medium text-primary">
                                {summary.p1}
                              </div>
                              <div className="py-4 text-center font-medium text-primary">
                                {summary.p2}
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  
  // Helper function to get attendance status for a child on a specific Sunday and program
  function getChildAttendance(childId: string, sundayDate: string, program: "P1" | "P2") {
    const record = attendance.find(a => 
      a.childId === childId && 
      a.date === sundayDate && 
      a.program === program
    );
    
    return record?.status || "A";
  }
};

export default AttendancePage;

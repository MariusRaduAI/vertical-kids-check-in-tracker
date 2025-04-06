
import React, { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, Calendar, UserPlus, Repeat } from "lucide-react";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import AttendanceTrendsChart from "@/components/dashboard/AttendanceTrendsChart";
import AttendanceByAgeChart from "@/components/dashboard/AttendanceByAgeChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import TopChildrenList from "@/components/dashboard/TopChildrenList";
import UpcomingBirthdays from "@/components/dashboard/UpcomingBirthdays";
import { Card } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { getMockChartsData } from "@/utils/dashboardUtils";

// Fix StatsCard usage and other components with proper props

// Inside the Dashboard component, update the StatsCard and chart components usage:
const Dashboard = () => {
  const { children } = useApp();
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  
  // Get mock data for charts
  const chartsData = getMockChartsData(period);
  
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Dashboard"
        description="Statistici și informații despre Școala Duminicală"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Copii"
          value={children.length}
          description="Copii înregistrați"
          icon={<Users className="h-5 w-5" />}
        />
        
        <StatsCard
          title="Prezență Săptămâna Aceasta"
          value={57}
          description="Copii prezenți duminica trecută"
          icon={<Calendar className="h-5 w-5" />}
        />
        
        <StatsCard
          title="Copii Noi"
          value={3}
          description="Înregistrați luna aceasta"
          icon={<UserPlus className="h-5 w-5" />}
        />
        
        <StatsCard
          title="Rata de Revenire"
          value={78}
          description="Procentaj revenire"
          icon={<Repeat className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="col-span-1 xl:col-span-2 p-4">
          <PeriodSelector
            value={period}
            onValueChange={(value) => setPeriod(value as "week" | "month" | "quarter" | "year")}
          />
          <AttendanceTrendsChart 
            data={chartsData.trendsData} 
            period={period}
            title="Tendințe de Prezență"
          />
        </Card>
        
        <Card className="p-4">
          <AttendanceByAgeChart 
            data={chartsData.ageGroupData}
            period={period}
          />
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <CategoryPieChart 
            data={chartsData.categoryData}
          />
        </Card>
        
        <Card className="p-4">
          <TopChildrenList 
            data={chartsData.topChildren}
            title="Top Prezențe"
            description="Copii cu cele mai multe prezențe"
          />
        </Card>
      </div>
      
      <div className="mt-6">
        <UpcomingBirthdays children={children} />
      </div>
    </div>
  );
};

export default Dashboard;

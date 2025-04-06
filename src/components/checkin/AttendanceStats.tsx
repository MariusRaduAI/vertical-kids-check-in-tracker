
import React from "react";
import { format } from "date-fns";
import { BadgePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AttendanceSummary, AgeGroup } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";

interface AttendanceStatsProps {
  currentSunday: string;
  todayStats: {
    totalP1: number;
    totalP2: number;
    total: number;
    newChildren: number;
  };
  todaySummary: AttendanceSummary | undefined;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  currentSunday,
  todayStats,
  todaySummary
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistici Prezență</CardTitle>
        <CardDescription>
          {format(new Date(currentSunday), "dd MMMM yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total copii</p>
            <p className="text-3xl font-bold">{todayStats.total}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm">
              <span className="font-medium">P1:</span> {todayStats.totalP1}
            </div>
            <div className="text-sm">
              <span className="font-medium">P2:</span> {todayStats.totalP2}
            </div>
          </div>
        </div>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-1">
                <BadgePlus className="h-4 w-4" /> Copii Noi
              </p>
              <p className="text-2xl font-bold">{todayStats.newChildren}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Prima prezență
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Pe grupe de vârstă</h4>
          <div className="space-y-2">
            {todaySummary && Object.entries(todaySummary.byAgeGroup).map(([group, data]) => (
              <div key={group} className="flex items-center justify-between">
                <AgeGroupBadge ageGroup={group as AgeGroup} />
                <div className="text-sm font-medium">{data.total}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Membri vs Guests
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">Membri</p>
              <p className="text-xl font-bold text-blue-800">
                {todaySummary?.byCategory.Membru || 0}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-md">
              <p className="text-sm text-orange-800">Guests</p>
              <p className="text-xl font-bold text-orange-800">
                {todaySummary?.byCategory.Guest || 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceStats;

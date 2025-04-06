
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, UserPlus } from "lucide-react";

interface AttendanceStatsProps {
  p1Count: number;
  p2Count: number;
  total: number;
  newCount: number;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ 
  p1Count, 
  p2Count, 
  total, 
  newCount 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prezență Astăzi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">Program 1</span>
          </div>
          <span className="font-bold">{p1Count}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">Program 2</span>
          </div>
          <span className="font-bold">{p2Count}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">Total Copii</span>
          </div>
          <span className="font-bold">{total}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm">Copii Noi</span>
          </div>
          <span className="font-bold">{newCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceStats;

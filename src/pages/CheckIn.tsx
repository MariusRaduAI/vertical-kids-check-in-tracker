
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AgeGroup } from "@/types/models";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import NewChildForm from "@/components/checkin/NewChildForm";
import IntegratedCheckIn from "@/components/checkin/IntegratedCheckIn";
import Stats from "@/components/checkin/Stats";
import UpcomingSundayBirthdays from "@/components/checkin/UpcomingSundayBirthdays";

const CheckIn: React.FC = () => {
  const { currentSunday, children, getAttendanceSummaryForDate } = useApp();
  const [isNewChild, setIsNewChild] = useState(false);
  const [newChildData, setNewChildData] = useState({
    firstName: "",
    lastName: "",
    ageGroup: "4-6" as AgeGroup
  });

  // Handle updating newChildData
  const handleNewChildDataChange = (data: {
    firstName: string;
    lastName: string;
    ageGroup: AgeGroup;
  }) => {
    setNewChildData(data);
  };
  
  const handleAddNew = () => {
    setIsNewChild(true);
  };
  
  const handleCreateNewChild = () => {
    setIsNewChild(false);
  };

  // Get attendance summary
  const summary = getAttendanceSummaryForDate(currentSunday);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <PageHeader
        title="Check-in & Etichete"
        description="Înregistrează și tipărește etichetele pentru participanți"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-3 md:p-6">
              {isNewChild ? (
                <NewChildForm 
                  newChildData={newChildData}
                  setNewChildData={handleNewChildDataChange}
                  onCreateNewChild={handleCreateNewChild}
                  onCancel={() => setIsNewChild(false)}
                />
              ) : (
                <IntegratedCheckIn onNewChildClick={handleAddNew} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:space-y-6">
          <UpcomingSundayBirthdays children={children} weekCount={4} />
          
          <Stats 
            currentSunday={currentSunday} 
            stats={summary ? {
              totalP1: summary.totalP1,
              totalP2: summary.totalP2,
              total: summary.total,
              newChildren: summary.newChildrenCount
            } : { totalP1: 0, totalP2: 0, total: 0, newChildren: 0 }}
            summary={summary}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckIn;

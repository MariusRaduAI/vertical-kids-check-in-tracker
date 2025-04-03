
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChildSearch from "@/components/checkin/ChildSearch";
import NewChildForm from "@/components/checkin/NewChildForm";
import SingleChildCheckIn from "@/components/checkin/SingleChildCheckIn";
import MultiChildCheckIn from "@/components/checkin/MultiChildCheckIn";
import TagsDialog from "@/components/checkin/TagsDialog";
import { Child } from "@/types/models";
import Stats from "@/components/checkin/Stats";
import UpcomingSundayBirthdays from "@/components/checkin/UpcomingSundayBirthdays";

const CheckIn: React.FC = () => {
  const { currentSunday, children, getTotalForDate, getAttendanceSummaryForDate } = useApp();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<Child[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [shouldCheckMedicalStatus, setShouldCheckMedicalStatus] = useState(true);
  const [showTagsDialog, setShowTagsDialog] = useState(false);

  const handleSearch = (child: Child) => {
    setSelectedChild(child);
    if (child.siblingIds?.length) {
      setActiveTab("multi-checkin");
    } else {
      setActiveTab("single-checkin");
    }
  };

  const handleAddNew = () => {
    setSelectedChild(null);
    setActiveTab("add-new");
  };

  const handleMultiChildSearch = (children: Child[]) => {
    setSelectedChildren(children);
    setActiveTab("multi-checkin");
  };

  const handlePrintComplete = () => {
    setSelectedChild(null);
    setSelectedChildren([]);
    setActiveTab("search");
  };

  const handleShowTags = () => {
    setShowTagsDialog(true);
  };

  // Stats for today
  const stats = getTotalForDate(currentSunday);
  const summary = getAttendanceSummaryForDate(currentSunday);

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <PageHeader
        title="Check-in & Etichete"
        description="Înregistrează și tipărește etichetele pentru participanți"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="search">Caută</TabsTrigger>
              <TabsTrigger value="add-new">Înregistrare copil nou</TabsTrigger>
              <TabsTrigger value="single-checkin" disabled={!selectedChild}>
                Check-in individual
              </TabsTrigger>
              <TabsTrigger value="multi-checkin" disabled={selectedChildren.length === 0}>
                Check-in multiplu
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="p-3 md:p-6">
                <TabsContent value="search" className="m-0">
                  <ChildSearch
                    onChildSelect={handleSearch}
                    onMultiChildSelect={handleMultiChildSearch}
                    onAddNew={handleAddNew}
                    onTagsClick={handleShowTags}
                  />
                </TabsContent>

                <TabsContent value="add-new" className="m-0">
                  <NewChildForm 
                    onSave={(child) => {
                      setSelectedChild(child);
                      setActiveTab("single-checkin");
                    }}
                  />
                </TabsContent>

                <TabsContent value="single-checkin" className="m-0">
                  {selectedChild && (
                    <SingleChildCheckIn
                      child={selectedChild}
                      date={currentSunday}
                      checkMedical={shouldCheckMedicalStatus}
                      onCheckMedicalChange={setShouldCheckMedicalStatus}
                      onPrintComplete={handlePrintComplete}
                    />
                  )}
                </TabsContent>

                <TabsContent value="multi-checkin" className="m-0">
                  <MultiChildCheckIn
                    children={selectedChildren.length > 0 ? selectedChildren : selectedChild ? [selectedChild] : []}
                    date={currentSunday}
                    checkMedical={shouldCheckMedicalStatus}
                    onCheckMedicalChange={setShouldCheckMedicalStatus}
                    onPrintComplete={handlePrintComplete}
                  />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* UpcomingSundayBirthdays moved above Stats as requested */}
          <UpcomingSundayBirthdays children={children} weekCount={4} />
          
          <Stats 
            currentSunday={currentSunday} 
            stats={stats} 
            summary={summary} 
          />
        </div>
      </div>

      {showTagsDialog && (
        <TagsDialog 
          date={currentSunday} 
          open={showTagsDialog} 
          onOpenChange={setShowTagsDialog} 
        />
      )}
    </div>
  );
};

export default CheckIn;

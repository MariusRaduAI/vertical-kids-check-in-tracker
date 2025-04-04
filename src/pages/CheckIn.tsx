
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Child, AgeGroup } from "@/types/models";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChildSearch from "@/components/checkin/ChildSearch";
import NewChildForm from "@/components/checkin/NewChildForm";
import SingleChildCheckIn from "@/components/checkin/SingleChildCheckIn";
import MultiChildCheckIn from "@/components/checkin/MultiChildCheckIn";
import TagsDialog from "@/components/checkin/TagsDialog";
import Stats from "@/components/checkin/Stats";
import UpcomingSundayBirthdays from "@/components/checkin/UpcomingSundayBirthdays";

const CheckIn: React.FC = () => {
  const { currentSunday, children, getAttendanceSummaryForDate } = useApp();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedChildren, setSelectedChildren] = useState<Child[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [shouldCheckMedicalStatus, setShouldCheckMedicalStatus] = useState(true);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Child[]>([]);
  const [isNewChild, setIsNewChild] = useState(false);
  const [newChildData, setNewChildData] = useState({
    firstName: "",
    lastName: "",
    ageGroup: "4-6" as AgeGroup
  });

  // Search functionality
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      const results = children.filter(child => 
        child.fullName.toLowerCase().includes(query.toLowerCase()) ||
        child.firstName.toLowerCase().includes(query.toLowerCase()) ||
        child.lastName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setSearchQuery("");
    setSearchResults([]);
    if (child.siblingIds?.length) {
      setActiveTab("multi-checkin");
    } else {
      setActiveTab("single-checkin");
    }
  };

  const handleMultiSelectSiblings = (children: Child[]) => {
    setSelectedChildren(children);
    setSearchQuery("");
    setSearchResults([]);
    setActiveTab("multi-checkin");
  };

  const handleAddNew = () => {
    setIsNewChild(true);
    setSelectedChild(null);
    setActiveTab("add-new");
  };

  const handlePrintComplete = () => {
    setSelectedChild(null);
    setSelectedChildren([]);
    setActiveTab("search");
    setIsNewChild(false);
  };

  const handleShowTags = () => {
    setShowTagsDialog(true);
  };

  const handleCreateNewChild = () => {
    // This would be handled by the NewChildForm component
    setIsNewChild(false);
    setActiveTab("search");
  };

  // Handle updating newChildData
  const handleNewChildDataChange = (data: {
    firstName: string;
    lastName: string;
    ageGroup: AgeGroup;
  }) => {
    setNewChildData(data);
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
                    searchQuery={searchQuery}
                    setSearchQuery={handleSearchChange}
                    searchResults={searchResults}
                    onSelectChild={handleChildSelect}
                    onNewChildClick={handleAddNew}
                    selectedChild={selectedChild}
                    isNewChild={isNewChild}
                    multiCheckInMode={false}
                    onMultiSelectSiblings={handleMultiSelectSiblings}
                  />
                </TabsContent>

                <TabsContent value="add-new" className="m-0">
                  <NewChildForm 
                    newChildData={newChildData}
                    setNewChildData={handleNewChildDataChange}
                    onCreateNewChild={handleCreateNewChild}
                    onCancel={() => {
                      setIsNewChild(false);
                      setActiveTab("search");
                    }}
                  />
                </TabsContent>

                <TabsContent value="single-checkin" className="m-0">
                  {selectedChild && (
                    <SingleChildCheckIn
                      child={selectedChild}
                    />
                  )}
                </TabsContent>

                <TabsContent value="multi-checkin" className="m-0">
                  <MultiChildCheckIn
                    children={selectedChildren.length > 0 ? selectedChildren : selectedChild ? [selectedChild] : []}
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

      {showTagsDialog && (
        <TagsDialog 
          open={showTagsDialog} 
          onOpenChange={setShowTagsDialog} 
          date={currentSunday}
          preselectedChildren={selectedChild ? [selectedChild] : selectedChildren}
        />
      )}
    </div>
  );
};

export default CheckIn;

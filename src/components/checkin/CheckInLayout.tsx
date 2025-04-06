
import React from "react";
import CheckInForm from "./CheckInForm";
import AttendanceStats from "./AttendanceStats";
import UpcomingSundayBirthdays from "./UpcomingSundayBirthdays";
import TagDialog from "./TagDialog";
import { TagPreviewType } from "@/types/checkin";
import { Child } from "@/types/models";
import { NewChildFormData } from "@/types/checkin";

interface CheckInLayoutProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Child[];
  selectedChild: Child | null;
  isNewChild: boolean;
  setIsNewChild: (isNew: boolean) => void;
  programSelection: string;
  setProgramSelection: (program: any) => void;
  newChildData: NewChildFormData;
  medicalCheckComplete: boolean;
  setMedicalCheckComplete: (complete: boolean) => void;
  tagOpen: boolean;
  setTagOpen: (open: boolean) => void;
  tagCount: number;
  setTagCount: (count: number) => void;
  generatedTags: TagPreviewType[] | null;
  todayStats: any;
  todaySummary: any;
  currentSunday: string;
  children: Child[];
  handleSelectChild: (child: Child) => void;
  handleNewChildClick: () => void;
  handleCreateNewChild: () => void;
  handleCheckIn: () => void;
  handlePrintTags: () => void;
  handleReset: () => void;
  handleUpdateNewChildData: (data: Partial<NewChildFormData>) => void;
}

const CheckInLayout: React.FC<CheckInLayoutProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  selectedChild,
  isNewChild,
  setIsNewChild,
  programSelection,
  setProgramSelection,
  newChildData,
  medicalCheckComplete,
  setMedicalCheckComplete,
  tagOpen,
  setTagOpen,
  tagCount,
  setTagCount,
  generatedTags,
  todayStats,
  todaySummary,
  currentSunday,
  children,
  handleSelectChild,
  handleNewChildClick,
  handleCreateNewChild,
  handleCheckIn,
  handlePrintTags,
  handleReset,
  handleUpdateNewChildData
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CheckInForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          selectedChild={selectedChild}
          isNewChild={isNewChild}
          setIsNewChild={setIsNewChild}
          programSelection={programSelection}
          setProgramSelection={setProgramSelection}
          newChildData={newChildData}
          medicalCheckComplete={medicalCheckComplete}
          setMedicalCheckComplete={setMedicalCheckComplete}
          handleSelectChild={handleSelectChild}
          handleNewChildClick={handleNewChildClick}
          handleCreateNewChild={handleCreateNewChild}
          handleCheckIn={handleCheckIn}
          handleReset={handleReset}
          handleUpdateNewChildData={handleUpdateNewChildData}
        />
      </div>

      <div className="space-y-6">
        <AttendanceStats 
          currentSunday={currentSunday}
          todayStats={todayStats}
          todaySummary={todaySummary}
        />
        
        <UpcomingSundayBirthdays children={children} weekCount={4} />
      </div>

      <TagDialog 
        open={tagOpen}
        onOpenChange={setTagOpen}
        tags={generatedTags}
        childName={selectedChild?.fullName}
        tagCount={tagCount}
        onTagCountChange={setTagCount}
        onPrint={handlePrintTags}
      />
    </div>
  );
};

export default CheckInLayout;

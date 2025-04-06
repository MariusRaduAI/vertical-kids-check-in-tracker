
import React from "react";
import PageHeader from "@/components/common/PageHeader";
import CheckInLayout from "@/components/checkin/CheckInLayout";
import { useCheckInForm } from "@/hooks/useCheckInForm";

const CheckIn: React.FC = () => {
  const {
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
  } = useCheckInForm();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Check-in & Generare Etichete"
        description="Înregistrează prezența copiilor și generează etichete pentru ei"
      />

      <CheckInLayout 
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
        tagOpen={tagOpen}
        setTagOpen={setTagOpen}
        tagCount={tagCount}
        setTagCount={setTagCount}
        generatedTags={generatedTags}
        todayStats={todayStats}
        todaySummary={todaySummary}
        currentSunday={currentSunday}
        children={children}
        handleSelectChild={handleSelectChild}
        handleNewChildClick={handleNewChildClick}
        handleCreateNewChild={handleCreateNewChild}
        handleCheckIn={handleCheckIn}
        handlePrintTags={handlePrintTags}
        handleReset={handleReset}
        handleUpdateNewChildData={handleUpdateNewChildData}
      />
    </div>
  );
};

export default CheckIn;

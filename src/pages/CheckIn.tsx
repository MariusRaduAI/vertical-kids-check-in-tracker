
import React from "react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Tag } from "lucide-react";
import { useCheckIn } from "@/hooks/useCheckIn";
import NewChildForm from "@/components/checkin/NewChildForm";
import SearchResults from "@/components/checkin/SearchResults";
import ChildProgramSelection from "@/components/checkin/ChildProgramSelection";
import TagDialog from "@/components/checkin/TagDialog";
import AttendanceStats from "@/components/checkin/AttendanceStats";
import UpcomingSundayBirthdays from "@/components/checkin/UpcomingSundayBirthdays";

const CheckIn: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedChild,
    isNewChild,
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
  } = useCheckIn();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Check-in & Generare Etichete"
        description="Înregistrează prezența copiilor și generează etichete pentru ei"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Copii</CardTitle>
              <CardDescription>
                Caută un copil după nume sau creează un nou profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
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

                <SearchResults 
                  searchQuery={searchQuery}
                  searchResults={searchResults}
                  selectedChild={selectedChild}
                  isNewChild={isNewChild}
                  onSelectChild={handleSelectChild}
                  onNewChildClick={handleNewChildClick}
                />
              </div>

              {isNewChild && (
                <NewChildForm 
                  formData={newChildData}
                  onChange={handleUpdateNewChildData}
                  onSubmit={handleCreateNewChild}
                  onCancel={() => setIsNewChild(false)}
                />
              )}

              {selectedChild && (
                <ChildProgramSelection 
                  selectedChild={selectedChild}
                  programSelection={programSelection}
                  onProgramChange={setProgramSelection}
                  medicalCheckComplete={medicalCheckComplete}
                  onMedicalCheckChange={setMedicalCheckComplete}
                  currentSunday={currentSunday}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Resetează
              </Button>
              <Button
                onClick={handleCheckIn}
                disabled={!selectedChild || !medicalCheckComplete}
              >
                <Tag className="mr-2 h-4 w-4" />
                Generează Etichetă
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <AttendanceStats 
            currentSunday={currentSunday}
            todayStats={todayStats}
            todaySummary={todaySummary}
          />
          
          <UpcomingSundayBirthdays children={children} weekCount={4} />
        </div>
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

export default CheckIn;

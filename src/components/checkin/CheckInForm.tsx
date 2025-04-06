
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCheckInForm } from '@/hooks/useCheckInForm';
import SearchResults from './SearchResults';
import ChildProgramSelection from './ChildProgramSelection';
import TagDialog from './TagDialog';
import { Search, Tag } from 'lucide-react';

const CheckInForm: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedChild,
    isNewChild,
    programSelection,
    setProgramSelection,
    medicalCheckComplete,
    setMedicalCheckComplete,
    tagOpen,
    setTagOpen,
    generatedTags,
    tagCount,
    setTagCount,
    handleSelectChild,
    handleNewChildClick,
    handleCheckIn,
    currentSunday
  } = useCheckInForm();

  return (
    <div>
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Check-In Copii</CardTitle>
          <CardDescription>
            Caută după nume și înregistrează prezența copiilor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center border rounded-md px-3 mb-4 focus-within:ring-1 focus-within:ring-primary">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 p-0"
              placeholder="Caută după nume..."
              autoFocus
            />
          </div>

          {searchResults.length > 0 && !selectedChild && !isNewChild && (
            <SearchResults
              searchQuery={searchQuery}
              searchResults={searchResults}
              selectedChild={selectedChild}
              isNewChild={isNewChild}
              onSelectChild={handleSelectChild}
              onNewChildClick={handleNewChildClick}
            />
          )}

          {selectedChild && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-xl">{selectedChild.fullName}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectChild(null)}
                  className="self-start sm:self-center"
                >
                  Schimbă
                </Button>
              </div>

              <ChildProgramSelection
                selectedChild={selectedChild}
                programSelection={programSelection}
                onProgramChange={setProgramSelection}
                medicalCheckComplete={medicalCheckComplete}
                onMedicalCheckChange={setMedicalCheckComplete}
                currentSunday={currentSunday}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleCheckIn}
            disabled={!selectedChild || !medicalCheckComplete}
            variant="default"
            className="ml-auto"
          >
            Check-In
          </Button>
        </CardFooter>
      </Card>

      {tagOpen && generatedTags && (
        <TagDialog
          open={tagOpen}
          onOpenChange={setTagOpen}
          tags={generatedTags}
          childName={selectedChild?.fullName}
          tagCount={tagCount}
          onTagCountChange={setTagCount}
          onPrint={handleCheckIn}
        />
      )}
    </div>
  );
};

export default CheckInForm;

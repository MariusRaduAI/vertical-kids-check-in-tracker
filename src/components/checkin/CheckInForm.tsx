
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCheckInForm } from '@/hooks/useCheckInForm';
import SearchResults from './SearchResults';
import ChildProgramSelection from './ChildProgramSelection';
import TagDialog from './TagDialog';
import AgeGroupBadge from '../common/AgeGroupBadge';
import CategoryBadge from '../common/CategoryBadge';
import NewChildBadge from '../common/NewChildBadge';
import { Search, Tag } from 'lucide-react';

const CheckInForm: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedChild,
    setSelectedChild,
    searchResults,
    program,
    setProgram,
    medicalCheck,
    setMedicalCheck,
    isTagDialogOpen,
    setIsTagDialogOpen,
    handleCheckIn,
    handleKeyDown,
    canCheckIn,
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
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 p-0"
              placeholder="Caută după nume..."
              autoFocus
            />
          </div>

          {searchResults.length > 0 && !selectedChild && (
            <SearchResults
              results={searchResults}
              onSelect={setSelectedChild}
            />
          )}

          {selectedChild && (
            <div className="space-y-4 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-xl">{selectedChild.fullName}</h3>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <AgeGroupBadge ageGroup={selectedChild.ageGroup} />
                    <CategoryBadge category={selectedChild.category} />
                    {selectedChild.isNew && <NewChildBadge />}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedChild(null)}
                  className="self-start sm:self-center"
                >
                  Schimbă
                </Button>
              </div>

              <ChildProgramSelection
                program={program}
                onChange={setProgram}
                medicalCheck={medicalCheck}
                onMedicalCheckChange={setMedicalCheck}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => setIsTagDialogOpen(true)}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Tag className="h-4 w-4" />
            Printează Ecusonul
          </Button>
        </CardFooter>
      </Card>

      {isTagDialogOpen && selectedChild && (
        <TagDialog
          child={selectedChild}
          open={isTagDialogOpen}
          onClose={() => setIsTagDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default CheckInForm;

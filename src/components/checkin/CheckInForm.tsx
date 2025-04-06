import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResults from "./SearchResults";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NewChildForm from "./NewChildForm";
import { Child, ProgramType } from "@/types/models";
import { AgeGroupBadge } from "../common/AgeGroupBadge";
import { CategoryBadge } from "../common/CategoryBadge";
import { NewChildBadge } from "../common/NewChildBadge";
import ChildProgramSelection from "./ChildProgramSelection";
import { NewChildFormData } from "@/types/checkin";

interface CheckInFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Child[];
  selectedChild: Child | null;
  isNewChild: boolean;
  setIsNewChild: (isNew: boolean) => void;
  programSelection: ProgramType;
  setProgramSelection: (program: ProgramType) => void;
  newChildData: NewChildFormData;
  medicalCheckComplete: boolean;
  setMedicalCheckComplete: (complete: boolean) => void;
  handleSelectChild: (child: Child) => void;
  handleNewChildClick: () => void;
  handleCreateNewChild: () => void;
  handleCheckIn: () => void;
  handleReset: () => void;
  handleUpdateNewChildData: (data: Partial<NewChildFormData>) => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({
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
  handleSelectChild,
  handleNewChildClick,
  handleCreateNewChild,
  handleCheckIn,
  handleReset,
  handleUpdateNewChildData
}) => {
  return (
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
            currentSunday={new Date().toISOString().split('T')[0]} // Placeholder, will be replaced by actual prop
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
  );
};

export default CheckInForm;

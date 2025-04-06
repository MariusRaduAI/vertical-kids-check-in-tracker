
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProgramType } from "@/types/models";
import { Child } from "@/types/models";
import { TagPreviewType } from "@/types/checkin";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { format } from "date-fns";
import TagPreview from "./TagPreview";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import { Checkbox } from "@/components/ui/checkbox";

interface ChildProgramSelectionProps {
  selectedChild: Child;
  programSelection: ProgramType;
  onProgramChange: (value: ProgramType) => void;
  medicalCheckComplete: boolean;
  onMedicalCheckChange: (checked: boolean) => void;
  currentSunday: string;
}

const ChildProgramSelection: React.FC<ChildProgramSelectionProps> = ({
  selectedChild,
  programSelection,
  onProgramChange,
  medicalCheckComplete,
  onMedicalCheckChange,
  currentSunday,
}) => {
  const previewTag: TagPreviewType = {
    childName: selectedChild.fullName,
    uniqueCode: `${selectedChild.firstName.charAt(0)}${selectedChild.lastName.charAt(0)}--${programSelection === "Both" ? "P1+P2" : programSelection}`,
    ageGroup: selectedChild.ageGroup,
    program: programSelection,
    date: format(new Date(currentSunday), "dd.MM.yyyy"),
  };

  const LiveTagPreview = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Tag className="h-4 w-4" />
          Previzualizare etichetă
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4">
          <h4 className="font-semibold mb-2">Previzualizare etichetă</h4>
          <TagPreview tag={previewTag} />
          <p className="text-xs text-muted-foreground mt-2">
            Aceasta este o previzualizare. Codul unic final va fi generat la check-in.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">{selectedChild.fullName}</h3>
        <div className="flex items-center gap-2">
          <AgeGroupBadge ageGroup={selectedChild.ageGroup} />
          <CategoryBadge category={selectedChild.category} />
          {selectedChild.isNew && <NewChildBadge />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="program">Participare la Program</Label>
        <RadioGroup
          value={programSelection}
          onValueChange={(value) => onProgramChange(value as ProgramType)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="P1" id="p1" />
            <Label htmlFor="p1">Doar Program 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="P2" id="p2" />
            <Label htmlFor="p2">Doar Program 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Both" id="both" />
            <Label htmlFor="both">Ambele Programe</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Verificare medicală</h4>
        <div className="flex items-start space-x-2 p-4 rounded-md border border-gray-200 bg-gray-50">
          <Checkbox
            id="medicalCheckComplete"
            checked={medicalCheckComplete}
            onCheckedChange={(checked) => onMedicalCheckChange(checked === true)}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label htmlFor="medicalCheckComplete" className="font-medium">
              Confirmă verificarea medicală completă
            </Label>
            <p className="text-sm text-muted-foreground">
              Confirm că am verificat temperatura, copilul nu prezintă simptome (tuse/febră) 
              și este într-o stare generală bună.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <LiveTagPreview />
      </div>
    </div>
  );
};

export default ChildProgramSelection;

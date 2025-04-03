
import React from "react";
import { Child } from "@/types/models";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import LiveTagPreview from "./LiveTagPreview";

interface SingleChildCheckInProps {
  child: Child;
  program: "P1" | "P2" | "Both";
  medicalCheckComplete: boolean;
  onProgramChange: (value: "P1" | "P2" | "Both") => void;
  onMedicalCheckChange: (checked: boolean) => void;
}

const SingleChildCheckIn: React.FC<SingleChildCheckInProps> = ({
  child,
  program,
  medicalCheckComplete,
  onProgramChange,
  onMedicalCheckChange
}) => {
  const hasAbsenceWarning = child.consecutiveAbsences && child.consecutiveAbsences >= 3;

  return (
    <div className={`space-y-4 border rounded-md p-4 ${hasAbsenceWarning ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">{child.fullName}</h3>
        <div className="flex items-center gap-2">
          <AgeGroupBadge ageGroup={child.ageGroup} />
          <CategoryBadge category={child.category} />
          {child.isNew && <NewChildBadge />}
        </div>
      </div>

      {hasAbsenceWarning && (
        <Alert variant="destructive" className="border-red-500 bg-red-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">ATENȚIE: Absențe consecutive</AlertTitle>
          <AlertDescription className="font-medium">
            Acest copil are {child.consecutiveAbsences} absențe consecutive. Contactați familia URGENT!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="program">Participare la Program</Label>
        <RadioGroup
          value={program}
          onValueChange={(value) => onProgramChange(value as "P1" | "P2" | "Both")}
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
            id="medical-check"
            checked={medicalCheckComplete}
            onCheckedChange={(checked) => onMedicalCheckChange(checked === true)}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label htmlFor="medical-check" className="font-medium">
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
        <LiveTagPreview childId={child.id} program={program} />
      </div>
    </div>
  );
};

export default SingleChildCheckIn;


import React from "react";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import SiblingBadge, { AbsenceWarningBadge } from "@/components/common/SiblingBadge";
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
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">{child.fullName}</h3>
        <div className="flex items-center gap-2">
          <AgeGroupBadge ageGroup={child.ageGroup} />
          <CategoryBadge category={child.category} />
          {child.isNew && <NewChildBadge />}
          <SiblingBadge 
            count={child.siblingIds?.length || 0} 
          />
          {child.consecutiveAbsences && child.consecutiveAbsences >= 3 && (
            <AbsenceWarningBadge consecutiveAbsences={child.consecutiveAbsences} />
          )}
        </div>
      </div>
      
      {child.consecutiveAbsences && child.consecutiveAbsences >= 3 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Absențe consecutive</AlertTitle>
          <AlertDescription>
            Acest copil are {child.consecutiveAbsences} absențe consecutive. Contactați familia!
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
        <LiveTagPreview 
          childId={child.id} 
          program={program} 
        />
      </div>
    </div>
  );
};

export default SingleChildCheckIn;


import React from "react";
import { Child } from "@/types/models";
import { Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { AbsenceWarningBadge } from "@/components/common/SiblingBadge";
import LiveTagPreview from "./LiveTagPreview";

interface ChildCheckInState {
  childId: string;
  selected: boolean;
  program: "P1" | "P2" | "Both";
  medicalCheckComplete: boolean;
}

interface MultiChildCheckInProps {
  children: Child[];
  childrenToCheckIn: ChildCheckInState[];
  updateChildCheckInState: (
    childId: string,
    field: keyof ChildCheckInState,
    value: any
  ) => void;
}

const MultiChildCheckIn: React.FC<MultiChildCheckInProps> = ({ 
  children, 
  childrenToCheckIn,
  updateChildCheckInState
}) => {
  const toggleSelectAll = () => {
    const allSelected = childrenToCheckIn.every(c => c.selected);
    childrenToCheckIn.forEach(child => {
      updateChildCheckInState(child.childId, 'selected', !allSelected);
    });
  };

  const renderChildCheckInItem = (childId: string, index: number) => {
    const child = children.find(c => c.id === childId);
    if (!child) return null;
    
    const childState = childrenToCheckIn.find(c => c.childId === childId);
    if (!childState) return null;
    
    const hasAbsenceWarning = child.consecutiveAbsences && child.consecutiveAbsences >= 3;
    
    return (
      <div key={childId} className={`border rounded-md p-4 ${index > 0 ? 'mt-4' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={childState.selected}
              onCheckedChange={(checked) => 
                updateChildCheckInState(childId, 'selected', checked === true)
              }
              id={`select-${childId}`}
            />
            <Label htmlFor={`select-${childId}`} className="font-medium text-lg">
              {child.fullName}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <AgeGroupBadge ageGroup={child.ageGroup} />
            <CategoryBadge category={child.category} />
            {child.isNew && <NewChildBadge />}
            {hasAbsenceWarning && (
              <AbsenceWarningBadge consecutiveAbsences={child.consecutiveAbsences || 0} />
            )}
          </div>
        </div>
        
        {hasAbsenceWarning && childState.selected && (
          <Alert variant="destructive" className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Absențe consecutive</AlertTitle>
            <AlertDescription>
              Acest copil are {child.consecutiveAbsences} absențe consecutive. Contactați familia!
            </AlertDescription>
          </Alert>
        )}
        
        {childState.selected && (
          <>
            <div className="space-y-2 pl-7">
              <Label htmlFor={`program-${childId}`}>Participare la Program</Label>
              <RadioGroup
                value={childState.program}
                onValueChange={(value) => 
                  updateChildCheckInState(childId, 'program', value as "P1" | "P2" | "Both")
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P1" id={`p1-${childId}`} />
                  <Label htmlFor={`p1-${childId}`}>Doar Program 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P2" id={`p2-${childId}`} />
                  <Label htmlFor={`p2-${childId}`}>Doar Program 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Both" id={`both-${childId}`} />
                  <Label htmlFor={`both-${childId}`}>Ambele Programe</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 pl-7 mt-4">
              <h4 className="font-medium">Verificare medicală</h4>
              <div className="flex items-start space-x-2 p-4 rounded-md border border-gray-200 bg-gray-50">
                <Checkbox
                  id={`medical-${childId}`}
                  checked={childState.medicalCheckComplete}
                  onCheckedChange={(checked) => 
                    updateChildCheckInState(childId, 'medicalCheckComplete', checked === true)
                  }
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor={`medical-${childId}`} className="font-medium">
                    Confirmă verificarea medicală completă
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Confirm că am verificat temperatura, copilul nu prezintă simptome (tuse/febră) 
                    și este într-o stare generală bună.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-3 pl-7">
              <LiveTagPreview childId={childId} program={childState.program} />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Users className="h-5 w-5" /> Check-in frați/surori
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSelectAll}
        >
          {childrenToCheckIn.every(c => c.selected) 
            ? "Deselectează toți" 
            : "Selectează toți"}
        </Button>
      </div>
      
      {childrenToCheckIn.map((child, index) => 
        renderChildCheckInItem(child.childId, index)
      )}
    </div>
  );
};

export default MultiChildCheckIn;

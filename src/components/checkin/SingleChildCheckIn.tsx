
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

interface SingleChildCheckInProps {
  child: Child;
  program?: "P1" | "P2" | "Both";
  medicalCheckComplete?: boolean;
  onProgramChange?: (value: "P1" | "P2" | "Both") => void;
  onMedicalCheckChange?: (checked: boolean) => void;
  onCheckInComplete?: () => void;
  siblings?: Child[];
  onSiblingSelect?: (childId: string, selected: boolean) => void;
}

const SingleChildCheckIn: React.FC<SingleChildCheckInProps> = ({
  child,
  program: propProgram,
  medicalCheckComplete: propMedicalCheck,
  onProgramChange,
  onMedicalCheckChange,
  onCheckInComplete,
  siblings,
  onSiblingSelect
}) => {
  const { getSiblings, checkInChild } = useApp();
  const [program, setProgram] = useState<"P1" | "P2" | "Both">(propProgram || "P1");
  const [medicalCheckComplete, setMedicalCheckComplete] = useState(propMedicalCheck || false);
  const [showSiblings, setShowSiblings] = useState(false);
  
  // Get siblings if not provided
  const childSiblings = siblings || getSiblings(child.id);
  const hasAbsenceWarning = child.consecutiveAbsences && child.consecutiveAbsences >= 3;
  
  // Handle program change
  const handleProgramChange = (value: "P1" | "P2" | "Both") => {
    setProgram(value);
    if (onProgramChange) onProgramChange(value);
  };
  
  // Handle medical check change
  const handleMedicalCheckChange = (checked: boolean) => {
    setMedicalCheckComplete(checked);
    if (onMedicalCheckChange) onMedicalCheckChange(checked);
  };
  
  // Handle check-in
  const handleCheckIn = () => {
    if (!medicalCheckComplete) {
      return; // Medical check must be completed
    }
    
    // Process program selection
    const programsToCheckIn = program === "Both" ? ["P1", "P2"] : [program];
    
    // Perform check-in for each program
    programsToCheckIn.forEach(p => {
      checkInChild(
        child.id,
        p as "P1" | "P2",
        { temperature: true, noSymptoms: true, goodCondition: true }
      );
    });
    
    if (onCheckInComplete) onCheckInComplete();
  };

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

      {/* Siblings section */}
      {childSiblings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Frați/Surori</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSiblings(!showSiblings)}
            >
              {showSiblings ? "Ascunde" : "Arată"} ({childSiblings.length})
            </Button>
          </div>
          
          {showSiblings && (
            <div className="pl-4 space-y-2 border-l-2 border-gray-200">
              {childSiblings.map(sibling => (
                <div key={sibling.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={`sibling-${sibling.id}`}
                    onChange={(e) => {
                      if (onSiblingSelect) {
                        onSiblingSelect(sibling.id, e.target.checked);
                      }
                    }}
                  />
                  <Label htmlFor={`sibling-${sibling.id}`} className="cursor-pointer">
                    {sibling.fullName} 
                    <span className="ml-2 text-xs text-gray-500">
                      ({sibling.ageGroup} ani)
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="program">Participare la Program</Label>
        <RadioGroup
          value={program}
          onValueChange={(value) => handleProgramChange(value as "P1" | "P2" | "Both")}
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
            onCheckedChange={(checked) => handleMedicalCheckChange(checked === true)}
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

      <div className="flex justify-between items-center">
        <Button 
          onClick={handleCheckIn}
          disabled={!medicalCheckComplete}
          className="bg-green-600 hover:bg-green-700"
        >
          Înregistrează prezența
        </Button>
        
        <LiveTagPreview childId={child.id} program={program} />
      </div>
    </div>
  );
};

export default SingleChildCheckIn;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Child } from "@/types/models";
import { format } from "date-fns";
import TagPreview from "../TagPreview";

interface CheckInFormSectionProps {
  selectedChild: Child;
  selectedSiblings: Child[];
  program: "P1" | "P2" | "Both";
  setProgram: (program: "P1" | "P2" | "Both") => void;
  medicalCheckComplete: boolean;
  setMedicalCheckComplete: (complete: boolean) => void;
  handleCheckInComplete: () => void;
  setShowTagsDialog: (show: boolean) => void;
  currentSunday: string;
}

const CheckInFormSection: React.FC<CheckInFormSectionProps> = ({
  selectedChild,
  selectedSiblings,
  program,
  setProgram,
  medicalCheckComplete,
  setMedicalCheckComplete,
  handleCheckInComplete,
  setShowTagsDialog,
  currentSunday
}) => {
  // Generate tag data for preview
  const generateTagData = (child: Child) => {
    return {
      childName: child.fullName,
      ageGroup: child.ageGroup,
      program,
      uniqueCode: `${child.firstName.charAt(0)}${child.lastName.charAt(0)}-${program === "Both" ? "P1+P2" : program}`,
      date: format(new Date(currentSunday), "dd.MM.yyyy"),
      hasAllergies: child.hasAllergies || false,
      allergiesDetails: child.allergiesDetails || "",
      hasSpecialNeeds: child.hasSpecialNeeds || false,
      parents: child.parents.join(", ")
    };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-3">Check-in</h3>
          
          <div className="space-y-4">
            {/* Program selection */}
            <div className="space-y-2">
              <Label htmlFor="program">Participare la Program</Label>
              <RadioGroup
                value={program}
                onValueChange={(value) => setProgram(value as "P1" | "P2" | "Both")}
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
            
            {/* Medical check section */}
            <div className="space-y-2">
              <h4 className="font-medium">Verificare medicală</h4>
              <div className="flex items-start space-x-2 p-4 rounded-md border border-gray-200 bg-gray-50">
                <Checkbox
                  id="medical-check"
                  checked={medicalCheckComplete}
                  onCheckedChange={(checked) => setMedicalCheckComplete(checked === true)}
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
            
            {/* Tag preview */}
            {selectedChild && (
              <div className="border rounded-md p-3 bg-gray-50">
                <h4 className="font-medium text-sm mb-2 text-center">Previzualizare etichetă</h4>
                <div className="max-w-[250px] mx-auto">
                  <TagPreview tag={generateTagData(selectedChild)} />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  {selectedSiblings.length > 0 && 
                    `+ ${selectedSiblings.length} etichete pentru frați/surori`}
                </p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                onClick={handleCheckInComplete}
                disabled={!medicalCheckComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                Înregistrează prezența
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowTagsDialog(true)}
                disabled={!medicalCheckComplete}
              >
                <Tag className="h-4 w-4 mr-2" />
                Generează etichete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInFormSection;

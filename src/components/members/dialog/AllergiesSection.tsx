
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AllergiesSectionProps {
  hasAllergies: boolean;
  allergiesDetails?: string;
  onCheckboxChange: (field: string, checked: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AllergiesSection: React.FC<AllergiesSectionProps> = ({
  hasAllergies,
  allergiesDetails = "",
  onCheckboxChange,
  onInputChange,
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasAllergies" 
          checked={hasAllergies}
          onCheckedChange={(checked) => 
            onCheckboxChange('hasAllergies', checked === true)
          } 
        />
        <Label htmlFor="hasAllergies" className="font-medium">Are alergii</Label>
      </div>
      
      {hasAllergies && (
        <div className="space-y-2">
          <Label htmlFor="allergiesDetails">Detalii alergii</Label>
          <Input
            id="allergiesDetails"
            name="allergiesDetails"
            value={allergiesDetails}
            onChange={onInputChange}
            placeholder="Specificați alergiile"
          />
        </div>
      )}
    </div>
  );
};

export default AllergiesSection;

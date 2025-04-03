
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SpecialNeedsSectionProps {
  hasSpecialNeeds: boolean;
  specialNeedsDetails?: string;
  onCheckboxChange: (field: string, checked: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpecialNeedsSection: React.FC<SpecialNeedsSectionProps> = ({
  hasSpecialNeeds,
  specialNeedsDetails = "",
  onCheckboxChange,
  onInputChange,
}) => {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasSpecialNeeds" 
          checked={hasSpecialNeeds}
          onCheckedChange={(checked) => 
            onCheckboxChange('hasSpecialNeeds', checked === true)
          } 
        />
        <Label htmlFor="hasSpecialNeeds" className="font-medium">Are nevoi speciale</Label>
      </div>
      
      {hasSpecialNeeds && (
        <div className="space-y-2">
          <Label htmlFor="specialNeedsDetails">Detalii nevoi speciale</Label>
          <Input
            id="specialNeedsDetails"
            name="specialNeedsDetails"
            value={specialNeedsDetails}
            onChange={onInputChange}
            placeholder="Ex: ADHD, sindrom Down, etc."
          />
        </div>
      )}
    </div>
  );
};

export default SpecialNeedsSection;

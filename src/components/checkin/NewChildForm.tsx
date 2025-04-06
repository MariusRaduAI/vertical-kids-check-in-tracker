
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgeGroup } from "@/types/models";
import { NewChildFormData } from "@/types/checkin";

interface NewChildFormProps {
  formData: NewChildFormData;
  onChange: (data: Partial<NewChildFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const NewChildForm: React.FC<NewChildFormProps> = ({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prenume</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nume</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ageGroup">Grupa de vârstă</Label>
        <Select
          value={formData.ageGroup}
          onValueChange={(value) => onChange({ ageGroup: value as AgeGroup })}
        >
          <SelectTrigger id="ageGroup">
            <SelectValue placeholder="Selectează grupa de vârstă" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 ani</SelectItem>
            <SelectItem value="1-2">1-2 ani</SelectItem>
            <SelectItem value="2-3">2-3 ani</SelectItem>
            <SelectItem value="4-6">4-6 ani</SelectItem>
            <SelectItem value="7-12">7-12 ani</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Anulează
        </Button>
        <Button onClick={onSubmit}>
          Adaugă Copil
        </Button>
      </div>
    </div>
  );
};

export default NewChildForm;


import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AgeGroup } from "@/types/models";

interface NewChildFormProps {
  newChildData: {
    firstName: string;
    lastName: string;
    ageGroup: AgeGroup;
  };
  setNewChildData: (data: {
    firstName: string;
    lastName: string;
    ageGroup: AgeGroup;
  }) => void;
  onCreateNewChild: () => void;
  onCancel: () => void;
}

const NewChildForm: React.FC<NewChildFormProps> = ({
  newChildData,
  setNewChildData,
  onCreateNewChild,
  onCancel
}) => {
  return (
    <div className="space-y-4 border rounded-md p-4 mt-4">
      <h3 className="font-medium">Adaugă copil nou</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prenume</Label>
          <Input
            id="firstName"
            value={newChildData.firstName}
            onChange={(e) =>
              setNewChildData({
                ...newChildData,
                firstName: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nume</Label>
          <Input
            id="lastName"
            value={newChildData.lastName}
            onChange={(e) =>
              setNewChildData({
                ...newChildData,
                lastName: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ageGroup">Grupa de vârstă</Label>
        <Select
          value={newChildData.ageGroup}
          onValueChange={(value) =>
            setNewChildData({
              ...newChildData,
              ageGroup: value as AgeGroup,
            })
          }
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
        <Button onClick={onCreateNewChild}>
          Adaugă Copil
        </Button>
      </div>
    </div>
  );
};

export default NewChildForm;

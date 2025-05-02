
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgeGroup } from "@/types/models";
import { NewChildFormData } from "@/types/checkin";
import { cn } from "@/lib/utils";

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
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange({ birthDate: format(date, "yyyy-MM-dd") });
    }
  };

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
        <Label htmlFor="parentName">Nume Părinte</Label>
        <Input
          id="parentName"
          value={formData.parentName || ""}
          onChange={(e) => onChange({ parentName: e.target.value })}
          placeholder="Introduceți numele unui părinte"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Data Nașterii</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.birthDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.birthDate ? (
                  format(new Date(formData.birthDate), "PPP", { locale: ro })
                ) : (
                  <span>Selectează data nașterii</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                onSelect={handleDateSelect}
                initialFocus
                locale={ro}
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasAllergies" 
            checked={formData.hasAllergies || false}
            onCheckedChange={(checked) => onChange({ hasAllergies: !!checked })}
          />
          <Label htmlFor="hasAllergies">Are alergii</Label>
        </div>

        {formData.hasAllergies && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="allergiesDetails">Detalii despre alergii</Label>
            <Input
              id="allergiesDetails"
              value={formData.allergiesDetails || ""}
              onChange={(e) => onChange({ allergiesDetails: e.target.value })}
              placeholder="Specificați alergiile"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
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

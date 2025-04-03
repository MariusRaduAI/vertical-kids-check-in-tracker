
import React from "react";
import { AgeGroup } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  ageGroup: AgeGroup;
  category: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgeGroupChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  firstName,
  lastName,
  birthDate,
  ageGroup,
  category,
  onInputChange,
  onAgeGroupChange,
  onCategoryChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prenume</Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nume</Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Data Nașterii</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={onInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ageGroup">Grupa de Vârstă</Label>
          <Select
            name="ageGroup"
            value={ageGroup}
            onValueChange={onAgeGroupChange}
          >
            <SelectTrigger id="ageGroup">
              <SelectValue placeholder="Selectează grupa" />
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
      
      <div className="space-y-2">
        <Label htmlFor="category">Categorie</Label>
        <Select
          name="category"
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Selectează categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Membru">Membru</SelectItem>
            <SelectItem value="Guest">Guest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PersonalInfoSection;

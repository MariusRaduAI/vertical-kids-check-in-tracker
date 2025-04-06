
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  value?: string;
  period?: "week" | "month" | "quarter" | "year";
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  value, 
  period, 
  onChange, 
  onValueChange 
}) => {
  // Use the appropriate props based on what's provided
  const selectedValue = value || period || "month";
  const handleChange = onValueChange || onChange || (() => {});

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Perioada" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Săptămâna</SelectItem>
        <SelectItem value="month">Luna</SelectItem>
        <SelectItem value="quarter">Trimestrul</SelectItem>
        <SelectItem value="year">Anul</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;


import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ value, onValueChange }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Perioada" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="current">Duminica curentă</SelectItem>
        <SelectItem value="lastMonth">Ultima lună</SelectItem>
        <SelectItem value="last3Months">Ultimele 3 luni</SelectItem>
        <SelectItem value="last6Months">Ultimele 6 luni</SelectItem>
        <SelectItem value="allTime">Tot timpul</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;

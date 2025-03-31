
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MemberFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MemberFilters: React.FC<MemberFiltersProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Caută după nume..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default MemberFilters;

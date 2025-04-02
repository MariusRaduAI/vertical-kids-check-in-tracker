
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle } from "lucide-react";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import SiblingBadge, { AbsenceWarningBadge } from "@/components/common/SiblingBadge";

interface ChildSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Child[];
  onSelectChild: (child: Child) => void;
  onNewChildClick: () => void;
  selectedChild: Child | null;
  isNewChild: boolean;
  multiCheckInMode: boolean;
}

const ChildSearch: React.FC<ChildSearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectChild,
  onNewChildClick,
  selectedChild,
  isNewChild,
  multiCheckInMode
}) => {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Caută după nume..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {searchResults.length > 0 && !selectedChild && !isNewChild && !multiCheckInMode && (
        <div className="absolute z-10 w-full bg-white rounded-md shadow-lg mt-1 border">
          <ul className="py-1">
            {searchResults.map((child) => (
              <li
                key={child.id}
                className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                onClick={() => onSelectChild(child)}
              >
                <div>
                  <span className="font-medium">{child.fullName}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <AgeGroupBadge ageGroup={child.ageGroup} />
                    <CategoryBadge category={child.category} />
                    {child.isNew && <NewChildBadge />}
                    <SiblingBadge 
                      count={child.siblingIds?.length || 0} 
                    />
                    {child.consecutiveAbsences && child.consecutiveAbsences >= 3 && (
                      <AbsenceWarningBadge consecutiveAbsences={child.consecutiveAbsences} />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchQuery && !selectedChild && searchResults.length === 0 && !isNewChild && !multiCheckInMode && (
        <div className="mt-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span>Niciun copil găsit. </span>
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={onNewChildClick}
          >
            Este copil nou?
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChildSearch;

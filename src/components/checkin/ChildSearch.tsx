
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Users } from "lucide-react";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import SiblingBadge, { AbsenceWarningBadge } from "@/components/common/SiblingBadge";
import { useApp } from "@/context/AppContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChildSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Child[];
  onSelectChild: (child: Child) => void;
  onNewChildClick: () => void;
  selectedChild: Child | null;
  isNewChild: boolean;
  multiCheckInMode: boolean;
  onMultiSelectSiblings?: (siblings: Child[]) => void;
}

const ChildSearch: React.FC<ChildSearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectChild,
  onNewChildClick,
  selectedChild,
  isNewChild,
  multiCheckInMode,
  onMultiSelectSiblings
}) => {
  const { getSiblings } = useApp();
  
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
            {searchResults.map((child) => {
              const siblings = getSiblings(child.id);
              const hasSiblings = siblings.length > 0;
              
              return (
                <li
                  key={child.id}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div onClick={() => onSelectChild(child)}>
                      <span className="font-medium">{child.fullName}</span>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <AgeGroupBadge ageGroup={child.ageGroup} />
                        <CategoryBadge category={child.category} />
                        {child.isNew && <NewChildBadge />}
                        {child.consecutiveAbsences && child.consecutiveAbsences >= 3 && (
                          <AbsenceWarningBadge consecutiveAbsences={child.consecutiveAbsences} />
                        )}
                      </div>
                    </div>
                    
                    {hasSiblings && onMultiSelectSiblings && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="ml-2 flex items-center text-xs text-cyan-600"
                              onClick={() => onMultiSelectSiblings([child, ...siblings])}
                            >
                              <Users className="h-3.5 w-3.5 mr-1" />
                              <span>+{siblings.length}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">Check-in cu frați/surori: {siblings.map(s => s.fullName).join(", ")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </li>
              );
            })}
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


import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Users, CalendarPlus } from "lucide-react";
import { Child } from "@/types/models";
import { Card, CardContent } from "@/components/ui/card";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";

interface ChildSelectionSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Child[];
  setSearchResults: (results: Child[]) => void;
  selectedChild: Child | null;
  handleChildSelect: (child: Child) => void;
  selectAllSiblings: (child: Child) => void;
  getSiblings: (childId: string) => Child[];
  onNewChildClick?: () => void;
}

const ChildSelectionSection: React.FC<ChildSelectionSectionProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  selectedChild,
  handleChildSelect,
  selectAllSiblings,
  getSiblings,
  onNewChildClick
}) => {
  // Handle search with useEffect
  const { searchChildren } = useApp();
  
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchChildren(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchChildren, setSearchResults]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Caută un copil după nume sau nume părinte..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-2.5" 
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {searchResults.length > 0 && !selectedChild && (
        <Card>
          <CardContent className="p-2">
            <div className="max-h-60 overflow-y-auto divide-y">
              {searchResults.map(child => {
                const siblings = getSiblings(child.id);
                const hasSiblings = siblings.length > 0;
                
                return (
                  <div 
                    key={child.id}
                    className="p-2 hover:bg-muted cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div onClick={() => handleChildSelect(child)} className="flex-1">
                        <span className="font-medium">{child.fullName}</span>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          <AgeGroupBadge ageGroup={child.ageGroup} className="text-xs" />
                          <CategoryBadge category={child.category} className="text-xs" />
                          {child.isNew && <NewChildBadge />}
                          {child.consecutiveAbsences && child.consecutiveAbsences >= 3 && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                              <AlertTitle className="h-3 w-3 mr-1" />
                              {child.consecutiveAbsences} absențe
                            </span>
                          )}
                        </div>
                        {child.parents.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Părinți: {child.parents.join(", ")}
                          </div>
                        )}
                      </div>
                      
                      {hasSiblings && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs text-cyan-600 whitespace-nowrap"
                          onClick={() => selectAllSiblings(child)}
                        >
                          <Users className="h-3.5 w-3.5 mr-1" />
                          Check-in cu frați ({siblings.length})
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {searchQuery && searchResults.length === 0 && !selectedChild && (
        <div className="text-center p-4 border rounded-md bg-muted mt-3">
          <p className="text-muted-foreground">Niciun rezultat găsit</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={onNewChildClick}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Înregistrează copil nou
          </Button>
        </div>
      )}
    </div>
  );
};

import { useApp } from "@/context/AppContext";
import { AlertTitle } from "@/components/ui/alert";

export default ChildSelectionSection;

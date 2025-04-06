
import React from "react";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: Child[];
  selectedChild: Child | null;
  isNewChild: boolean;
  onSelectChild: (child: Child) => void;
  onNewChildClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  searchResults,
  selectedChild,
  isNewChild,
  onSelectChild,
  onNewChildClick,
}) => {
  if (searchResults.length > 0 && !selectedChild && !isNewChild) {
    return (
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (searchQuery && !selectedChild && searchResults.length === 0 && !isNewChild) {
    return (
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
    );
  }

  return null;
};

export default SearchResults;

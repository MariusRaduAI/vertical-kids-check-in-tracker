
import React, { useState } from "react";
import { Child } from "@/types/models";

interface MemberSearchProps {
  children: Child[];
}

interface MemberSearchResult {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredChildren: Child[];
}

const MemberSearch = ({ children }: MemberSearchProps): MemberSearchResult => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const getFilteredChildren = () => {
    if (!searchQuery) return children;
    
    const query = searchQuery.toLowerCase();
    return children.filter(child => 
      child.fullName.toLowerCase().includes(query) ||
      child.parents.some(parent => parent.toLowerCase().includes(query))
    );
  };
  
  const filteredChildren = getFilteredChildren();
  
  return {
    searchQuery,
    setSearchQuery,
    filteredChildren
  };
};

export { MemberSearch };
export type { MemberSearchResult };

// Create a React component wrapper that can be used with React.memo
const MemoizedMemberSearch: React.FC<MemberSearchProps & {
  onSearchResultsChange?: (results: MemberSearchResult) => void
}> = (props) => {
  const results = MemberSearch(props);
  
  React.useEffect(() => {
    if (props.onSearchResultsChange) {
      props.onSearchResultsChange(results);
    }
  }, [results, props.onSearchResultsChange]);
  
  return null; // This component doesn't render anything
};

export default React.memo(MemoizedMemberSearch);

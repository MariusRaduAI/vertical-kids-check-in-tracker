
import React, { useState } from "react";
import { Child } from "@/types/models";

interface MemberSearchProps {
  children: Child[];
}

export interface MemberSearchResult {
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

// This is needed because TypeScript expects a React component to return JSX
const MemoizedMemberSearch = React.memo(MemberSearch) as unknown as React.FC<MemberSearchProps>;
export default MemoizedMemberSearch;

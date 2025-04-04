
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

const MemberSearch: React.FC<MemberSearchProps> = ({ children }): MemberSearchResult => {
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

export default MemberSearch;

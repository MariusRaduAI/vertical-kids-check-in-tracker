
import React, { useState } from "react";
import { Child } from "@/types/models";
import MemberFilters from "./MemberFilters";

interface MemberSearchProps {
  children: Child[];
}

const MemberSearch: React.FC<MemberSearchProps> = ({ children }) => {
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


import React from "react";
import { AgeGroup } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";

export interface TagData {
  childName: string;
  uniqueCode: string;
  ageGroup: AgeGroup;
  program: "P1" | "P2" | "Both";
  date: string;
}

interface TagPreviewProps {
  tag: TagData;
}

const TagPreview: React.FC<TagPreviewProps> = ({ tag }) => {
  if (!tag) return null;
  
  return (
    <div className="border-2 border-primary rounded-lg p-4 md:p-6 my-3 md:my-4 space-y-3 md:space-y-4 bg-white shadow-md">
      <div className="text-center space-y-1 md:space-y-2">
        <h3 className="text-xl md:text-2xl font-bold line-clamp-1">{tag.childName}</h3>
        <div className="text-lg md:text-xl font-mono tracking-wider">
          {tag.uniqueCode}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <AgeGroupBadge ageGroup={tag.ageGroup} className="text-xs md:text-sm" />
        <div className="px-2 py-1 bg-primary text-white rounded-full text-xs md:text-sm">
          {tag.program === "Both" ? "P1+P2" : tag.program}
        </div>
      </div>
      
      <div className="text-center text-xs md:text-sm">
        {tag.date}
      </div>
    </div>
  );
};

export default TagPreview;

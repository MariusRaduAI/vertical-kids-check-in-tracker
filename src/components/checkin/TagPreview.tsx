
import React from "react";
import { TagPreviewType } from "@/types/checkin";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";

interface TagPreviewProps {
  tag: TagPreviewType;
}

const TagPreview: React.FC<TagPreviewProps> = ({ tag }) => {
  if (!tag) return null;
  
  return (
    <div className="border-2 border-primary rounded-lg p-6 my-4 space-y-4 bg-white shadow-md">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{tag.childName}</h3>
        <div className="text-xl font-mono tracking-wider">
          {tag.uniqueCode}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <AgeGroupBadge ageGroup={tag.ageGroup} className="text-sm" />
        <div className="px-2 py-1 bg-primary text-white rounded-full text-sm">
          {tag.program === "Both" ? "P1+P2" : tag.program}
        </div>
      </div>
      
      <div className="text-center text-sm">
        {tag.date}
      </div>
    </div>
  );
};

export default TagPreview;

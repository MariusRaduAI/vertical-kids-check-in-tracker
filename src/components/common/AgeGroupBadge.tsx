
import React from "react";
import { AgeGroup } from "@/types/models";
import { cn } from "@/lib/utils";

interface AgeGroupBadgeProps {
  ageGroup: AgeGroup;
  className?: string;
}

const AgeGroupBadge: React.FC<AgeGroupBadgeProps> = ({ ageGroup, className }) => {
  const getBadgeClass = () => {
    switch (ageGroup) {
      case "0-1":
        return "age-badge-baby";
      case "1-2":
        return "age-badge-toddler";
      case "2-3":
        return "age-badge-preschool";
      case "4-6":
        return "age-badge-primary";
      case "7-12":
        return "age-badge-junior";
      default:
        return "";
    }
  };

  const getLabel = () => {
    switch (ageGroup) {
      case "0-1":
        return "0-1 ani";
      case "1-2":
        return "1-2 ani";
      case "2-3":
        return "2-3 ani";
      case "4-6":
        return "4-6 ani";
      case "7-12":
        return "7-12 ani";
      default:
        return ageGroup;
    }
  };

  return (
    <span className={cn("age-badge", getBadgeClass(), className)}>
      {getLabel()}
    </span>
  );
};

export default AgeGroupBadge;

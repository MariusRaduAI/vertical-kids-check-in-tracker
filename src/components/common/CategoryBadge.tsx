
import React from "react";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: "Membru" | "Guest";
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        category === "Membru"
          ? "bg-blue-100 text-blue-800"
          : "bg-orange-100 text-orange-800",
        className
      )}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;

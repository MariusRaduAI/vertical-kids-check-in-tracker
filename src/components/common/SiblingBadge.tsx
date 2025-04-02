
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface SiblingBadgeProps {
  count: number;
  className?: string;
}

const SiblingBadge: React.FC<SiblingBadgeProps> = ({ count, className = "" }) => {
  if (count <= 0) return null;
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 bg-cyan-50 text-cyan-800 border-cyan-200 ${className}`}>
      <Users className="h-3 w-3" />
      <span>{count} {count === 1 ? 'frate/soră' : 'frați/surori'}</span>
    </Badge>
  );
};

export default SiblingBadge;

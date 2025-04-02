
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle } from "lucide-react";

interface SiblingBadgeProps {
  count: number;
  className?: string;
}

interface AbsenceWarningBadgeProps {
  consecutiveAbsences: number;
  className?: string;
}

// Original SiblingBadge component
export const SiblingBadge: React.FC<SiblingBadgeProps> = ({ count, className = "" }) => {
  if (count <= 0) return null;
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 bg-cyan-50 text-cyan-800 border-cyan-200 ${className}`}>
      <Users className="h-3 w-3" />
      <span>{count} {count === 1 ? 'frate/soră' : 'frați/surori'}</span>
    </Badge>
  );
};

// New AbsenceWarningBadge component
export const AbsenceWarningBadge: React.FC<AbsenceWarningBadgeProps> = ({ consecutiveAbsences, className = "" }) => {
  if (consecutiveAbsences < 3) return null;
  
  return (
    <Badge variant="outline" className={`flex items-center gap-1 bg-red-50 text-red-800 border-red-200 ${className}`}>
      <AlertTriangle className="h-3 w-3" />
      <span>{consecutiveAbsences} absențe consecutive</span>
    </Badge>
  );
};

export default SiblingBadge;

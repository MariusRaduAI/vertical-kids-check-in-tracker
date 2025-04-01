
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck } from 'lucide-react';

interface NewChildBadgeProps {
  className?: string;
}

const NewChildBadge: React.FC<NewChildBadgeProps> = ({ className }) => {
  return (
    <Badge variant="secondary" className={`bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1 ${className}`}>
      <BadgeCheck className="h-3 w-3" />
      <span>Nou</span>
    </Badge>
  );
};

export default NewChildBadge;

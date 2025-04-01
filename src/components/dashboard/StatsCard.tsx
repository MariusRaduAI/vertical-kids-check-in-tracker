
import React, { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, className, icon }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-2">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;

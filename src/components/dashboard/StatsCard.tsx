
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
    <Card className={`border bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon && <span className="text-brand-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-brand-dark">{value}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-2">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;


import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
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

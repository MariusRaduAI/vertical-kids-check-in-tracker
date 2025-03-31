
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import { AgeGroup } from "@/types/models";

interface ChildData {
  id: string;
  name: string;
  count?: number;
  absences?: number;
  ageGroup: AgeGroup;
  category: 'Membru' | 'Guest';
}

interface TopChildrenListProps {
  data: ChildData[];
  title: string;
  description: string;
  valueLabel?: string;
  valueColor?: string;
}

const TopChildrenList: React.FC<TopChildrenListProps> = ({ 
  data, 
  title, 
  description, 
  valueLabel = "prezenț",
  valueColor = "text-primary" 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-96 overflow-auto">
        <div className="space-y-2">
          {data.map((child, index) => (
            <div 
              key={child.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 text-center font-medium">{index + 1}.</div>
                <div>
                  <div className="font-medium">{child.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <AgeGroupBadge ageGroup={child.ageGroup} />
                    <CategoryBadge category={child.category} />
                  </div>
                </div>
              </div>
              <div className={`font-bold ${valueColor}`}>
                {child.count !== undefined ? child.count : child.absences}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopChildrenList;


import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Child } from "@/types/models";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { Cake } from "lucide-react";
import AgeGroupBadge from "../common/AgeGroupBadge";

interface UpcomingSundayBirthdaysProps {
  birthdayChildren: Child[];
  currentDate: string;
}

const UpcomingSundayBirthdays: React.FC<UpcomingSundayBirthdaysProps> = ({ 
  birthdayChildren,
  currentDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aniversări Astăzi</CardTitle>
      </CardHeader>
      <CardContent>
        {birthdayChildren.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            Niciun copil nu își sărbătorește ziua de naștere astăzi.
          </div>
        ) : (
          <div className="space-y-2">
            {birthdayChildren.map((child) => {
              // Calculate the age the child is turning today
              const birthDate = new Date(child.birthDate);
              const today = new Date(currentDate);
              const age = today.getFullYear() - birthDate.getFullYear();
              
              return (
                <div key={child.id} className="flex items-start space-x-2 p-2 rounded-md bg-muted/50">
                  <Cake className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{child.fullName}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <AgeGroupBadge ageGroup={child.ageGroup} />
                      <span className="text-xs bg-pink-100 text-pink-800 rounded-full px-2 py-0.5">
                        {age} ani
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSundayBirthdays;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, nextSunday, addWeeks, parseISO, isSameDay } from "date-fns";
import { Child } from "@/types/models";
import { Calendar, Gift } from "lucide-react";

interface UpcomingSundayBirthdaysProps {
  children: Child[];
  weekCount?: number;
}

const UpcomingSundayBirthdays: React.FC<UpcomingSundayBirthdaysProps> = ({ 
  children, 
  weekCount = 4 
}) => {
  const today = new Date();
  const upcomingSundays: Date[] = [];
  
  // Get the next few Sundays
  let sunday = nextSunday(today);
  upcomingSundays.push(sunday);
  
  for (let i = 1; i < weekCount; i++) {
    sunday = nextSunday(addWeeks(sunday, 0));
    upcomingSundays.push(sunday);
  }
  
  // Find children with birthdays on these Sundays
  const birthdaysByDate = upcomingSundays.map(sunday => {
    const childrenWithBirthday = children.filter(child => {
      const birthDate = parseISO(child.birthDate);
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );
      
      // Check if birthday falls on this Sunday
      return isSameDay(sunday, thisYearBirthday);
    });
    
    return {
      date: sunday,
      children: childrenWithBirthday
    };
  }).filter(date => date.children.length > 0);
  
  if (birthdaysByDate.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            Aniversări pe Duminici
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nu există aniversări în următoarele {weekCount} duminici.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          Aniversări pe Duminici
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {birthdaysByDate.map((birthday, index) => (
          <div key={index} className="p-3 rounded-md bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {format(birthday.date, "d MMMM")}
              </span>
            </div>
            <div className="space-y-1">
              {birthday.children.map(child => (
                <div key={child.id} className="flex justify-between items-center">
                  <div className="text-sm">{child.fullName}</div>
                  <div className="text-xs px-2 py-1 bg-primary text-white rounded-full">
                    {child.age + 1} ani
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingSundayBirthdays;

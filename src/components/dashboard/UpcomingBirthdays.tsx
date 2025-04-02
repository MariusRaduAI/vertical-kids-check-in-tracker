
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSunday, addDays, parseISO } from "date-fns";
import { Child } from "@/types/models";
import { Calendar } from "lucide-react";

interface UpcomingBirthdaysProps {
  children: Child[];
  days?: number;
}

interface BirthdaysByDate {
  date: Date;
  children: Child[];
  isSunday: boolean;
}

const UpcomingBirthdays: React.FC<UpcomingBirthdaysProps> = ({ 
  children, 
  days = 30 
}) => {
  // Group children by their upcoming birthday date
  const birthdaysByDate: BirthdaysByDate[] = [];
  const today = new Date();
  const endDate = addDays(today, days);
  
  const childrenWithUpcomingBirthdays = children.filter(
    child => child.daysUntilBirthday <= days
  );
  
  // Create a map of dates with children who have birthdays on those dates
  childrenWithUpcomingBirthdays.forEach(child => {
    // Calculate the birthday date
    const birthDate = parseISO(child.birthDate);
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    
    // Adjust for birthdays that already passed this year
    const birthdayDate = thisYearBirthday < today 
      ? new Date(
          today.getFullYear() + 1,
          birthDate.getMonth(),
          birthDate.getDate()
        )
      : thisYearBirthday;
    
    // Check if the birthday falls within our range
    if (birthdayDate <= endDate) {
      const formattedDate = format(birthdayDate, "yyyy-MM-dd");
      const existingDateIndex = birthdaysByDate.findIndex(
        item => format(item.date, "yyyy-MM-dd") === formattedDate
      );
      
      if (existingDateIndex >= 0) {
        birthdaysByDate[existingDateIndex].children.push(child);
      } else {
        birthdaysByDate.push({
          date: birthdayDate,
          children: [child],
          isSunday: isSunday(birthdayDate)
        });
      }
    }
  });
  
  // Sort dates chronologically
  birthdaysByDate.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  if (birthdaysByDate.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Aniversări Următoarele {days} Zile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nu există aniversări în următoarele {days} zile.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Aniversări Următoarele {days} Zile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {birthdaysByDate.map((birthday, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-md ${
              birthday.isSunday ? "bg-primary/10 border border-primary/20" : "bg-muted"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {format(birthday.date, "d MMMM")}
                {birthday.isSunday && " (Duminică)"}
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

export default UpcomingBirthdays;

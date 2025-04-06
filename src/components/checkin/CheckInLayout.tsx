
import React from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import CheckInForm from './CheckInForm';
import AttendanceStats from './AttendanceStats';
import UpcomingSundayBirthdays from './UpcomingSundayBirthdays';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewChildForm from './NewChildForm';
import { useCheckInForm } from '@/hooks/useCheckInForm';

const CheckInLayout: React.FC = () => {
  const { currentSunday, children, getTotalPresentToday } = useApp();
  const {
    newChildData,
    handleUpdateNewChildData,
    handleCreateNewChild,
    isNewChild,
    setIsNewChild
  } = useCheckInForm();
  
  const stats = getTotalPresentToday();
  const formattedDate = format(new Date(currentSunday), "d MMMM yyyy", { locale: ro });
  
  // Find children with birthdays this Sunday
  const birthdayChildren = children.filter(child => {
    const birthDate = new Date(child.birthDate);
    const currentSundayDate = new Date(currentSunday);
    return (
      birthDate.getDate() === currentSundayDate.getDate() &&
      birthDate.getMonth() === currentSundayDate.getMonth()
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Check-In pentru {formattedDate}
              </CardTitle>
              <CardDescription>
                Prezență curentă: {stats.total} copii ({stats.totalP1} la programul 1, {stats.totalP2} la programul 2)
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="check-in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="check-in">Check-In Copii</TabsTrigger>
              <TabsTrigger value="new-child">Copil Nou</TabsTrigger>
            </TabsList>
            <TabsContent value="check-in">
              <CheckInForm />
            </TabsContent>
            <TabsContent value="new-child">
              <Card>
                <CardHeader>
                  <CardTitle>Adaugă Copil Nou</CardTitle>
                  <CardDescription>
                    Completează datele pentru a înregistra un copil nou
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NewChildForm 
                    formData={newChildData}
                    onChange={handleUpdateNewChildData}
                    onSubmit={handleCreateNewChild}
                    onCancel={() => setIsNewChild(false)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:w-80 space-y-8">
          <AttendanceStats 
            p1Count={stats.totalP1}
            p2Count={stats.totalP2}
            total={stats.total}
            newCount={stats.newChildren}
          />
          
          <UpcomingSundayBirthdays 
            birthdayChildren={birthdayChildren} 
            currentDate={currentSunday}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckInLayout;


import React from "react";
import { Tag, School, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CheckInGuide from "./CheckInGuide";
import GeneralUsageGuide from "./GeneralUsageGuide";
import TipsAndTricksGuide from "./TipsAndTricksGuide";

const TrainingTabs: React.FC = () => {
  return (
    <Tabs defaultValue="checkin" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="checkin" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <span>Check-in & Etichete</span>
        </TabsTrigger>
        <TabsTrigger value="general" className="flex items-center gap-2">
          <School className="h-4 w-4" />
          <span>Utilizare Generală</span>
        </TabsTrigger>
        <TabsTrigger value="tips" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          <span>Sfaturi & Trucuri</span>
        </TabsTrigger>
      </TabsList>

      {/* Check-in & Tags Section */}
      <TabsContent value="checkin" className="space-y-6">
        <CheckInGuide />
      </TabsContent>

      {/* General Usage Section */}
      <TabsContent value="general" className="space-y-6">
        <GeneralUsageGuide />
      </TabsContent>

      {/* Tips & Tricks Section */}
      <TabsContent value="tips" className="space-y-6">
        <TipsAndTricksGuide />
      </TabsContent>
    </Tabs>
  );
};

export default TrainingTabs;

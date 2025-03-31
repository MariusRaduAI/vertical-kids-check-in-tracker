
import React from "react";
import PageHeader from "@/components/common/PageHeader";
import TrainingTabs from "@/components/training/TrainingTabs";

const Training: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Training & Onboarding"
        description="Învață cum să folosești aplicația Vertical Kids Check-In"
      />
      
      <TrainingTabs />
    </div>
  );
};

export default Training;

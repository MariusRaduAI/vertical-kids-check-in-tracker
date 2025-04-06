
import React from "react";
import PageHeader from "@/components/common/PageHeader";
import CheckInLayout from "@/components/checkin/CheckInLayout";

const CheckIn: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Check-in & Generare Etichete"
        description="Înregistrează prezența copiilor și generează etichete pentru ei"
      />

      <CheckInLayout />
    </div>
  );
};

export default CheckIn;

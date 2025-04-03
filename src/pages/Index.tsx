
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md sm:max-w-lg md:max-w-2xl px-4 py-8 md:py-12 bg-white rounded-xl shadow-md mx-4">
        <img 
          src="/lovable-uploads/41d4c4ca-017a-4fe0-a4d3-cfc69e2998cc.png" 
          alt="Vertical Kids Logo" 
          className="h-16 md:h-24 mx-auto mb-4 md:mb-6" 
        />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Check-In Tracker</h1>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
          Gestionați prezența copiilor în programele Vertical Kids cu ușurință.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Button asChild size="lg" className="text-sm md:text-base py-2 md:py-3">
            <Link to="/checkin">
              Începe Check-In
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-sm md:text-base py-2 md:py-3">
            <Link to="/dashboard">
              Vezi Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
